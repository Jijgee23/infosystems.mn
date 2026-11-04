"use server";

import { refresh, revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireStaff } from "@/lib/auth/session";
import { DOWNLOADS_TAG } from "@/lib/data/downloads";
import { GUIDES_TAG } from "@/lib/data/guides";
import { db } from "@/lib/db";
import { GUIDE_CATEGORIES, type GuideCategory } from "@/lib/guide-categories";
import { idParam } from "@/lib/ids";
import { sanitizeHtml } from "@/lib/sanitize";
import { slugify } from "@/lib/slug";
import { fromDateInput, fromLocalInput } from "@/lib/time";
import type { FormState } from "./contact";

const GuideSchema = z.object({
  title: z.string().trim().min(3, "Гарчиг оруулна уу").max(255),
  slug: z.string().trim().max(120).optional(),
  category: z.enum(GUIDE_CATEGORIES.map((c) => c.key) as [GuideCategory, ...GuideCategory[]]),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0),
  body: z.string().max(500_000),
  contentDate: z.string().regex(/^(\d{4}-\d{2}-\d{2})?$/).optional(),
  // datetime-local value («YYYY-MM-DDTHH:mm», seconds optional); anything else would become an Invalid Date.
  publishedAt: z.string().regex(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?)?$/, "Огноо буруу байна").optional(),
});

/** Public guide pages, the guide lists and the admin list. */
function guidesChanged() {
  updateTag(GUIDES_TAG);
  revalidatePath("/admin/guides");
}

/** Downloads link to their guide by slug: follow a rename (or drop the link when the guide is gone). */
async function relinkDownloads(oldSlug: string, newSlug: string | null) {
  const { count } = await db.download.updateMany({ where: { guideSlug: oldSlug }, data: { guideSlug: newSlug } });
  if (count) {
    updateTag(DOWNLOADS_TAG);
    revalidatePath("/admin/downloads");
  }
}

export async function saveGuide(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireStaff();
  const id = idParam(formData.get("id"));
  const parsed = GuideSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: "Талбаруудаа шалгана уу.", errors: Object.fromEntries(parsed.error.issues.map((i) => [String(i.path[0]), i.message])) };
  const d = parsed.data;

  const slug = slugify(d.slug || d.title) || `guide-${Date.now()}`;
  const clash = await db.guide.findFirst({ where: { slug, ...(id ? { NOT: { id } } : {}) }, select: { id: true } });
  if (clash) return { ok: false, message: "Ийм slug-тай заавар байна.", errors: { slug: "Давхардсан байна" } };

  const publish = formData.get("published") === "on";
  const data = {
    title: d.title,
    slug,
    category: d.category,
    sortOrder: d.sortOrder,
    body: sanitizeHtml(d.body),
    contentDate: d.contentDate ? fromDateInput(d.contentDate) : null,
    publishedAt: publish ? (d.publishedAt ? fromLocalInput(d.publishedAt) : new Date()) : null,
  };
  const prev = id ? await db.guide.findUnique({ where: { id }, select: { slug: true } }) : null;
  const saved = id ? await db.guide.update({ where: { id }, data, select: { id: true } }) : await db.guide.create({ data, select: { id: true } });
  if (prev && prev.slug !== slug) await relinkDownloads(prev.slug, slug);
  guidesChanged();
  if (!id) redirect(`/admin/guides/${saved.id}?saved=1`);
  refresh();
  return { ok: true, message: "Хадгалагдлаа." };
}

export async function deleteGuide(id: string) {
  await requireStaff();
  const { slug } = await db.guide.delete({ where: { id }, select: { slug: true } });
  await relinkDownloads(slug, null);
  guidesChanged();
  redirect("/admin/guides");
}
