"use server";

import { idList, idParam } from "@/lib/ids";
import { refresh, revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireStaff } from "@/lib/auth/session";
import { PRODUCTS_TAG } from "@/lib/data/products";
import { autoStatTemplates, getStatTokens, TRUST_TAG } from "@/lib/data/trust";
import { db } from "@/lib/db";
import { sanitizeHtml } from "@/lib/sanitize";
import { slugify } from "@/lib/slug";
import { IMAGE_TYPES, saveUpload, UploadError } from "@/lib/uploads";
import type { FormState } from "./contact";

const errorsOf = (e: z.ZodError) => Object.fromEntries(e.issues.map((i) => [String(i.path[0]), i.message]));
const text = (max: number) => z.string().trim().max(max).optional().transform((v) => v || null);
const order = z.coerce.number().int().min(0).max(999).default(0);

function changed() {
  updateTag(TRUST_TAG);
  revalidatePath("/admin", "layout");
  refresh();
}

/**
 * An image field of the form: a new upload → its file id, the `remove_<field>` box → null,
 * otherwise undefined (unchanged). Throws UploadError with a user-facing message.
 */
async function picture(formData: FormData, field: string) {
  const upload = formData.get(field);
  if (upload instanceof File && upload.size > 0) {
    const file = await saveUpload(upload, { types: IMAGE_TYPES, maxBytes: 8 * 1024 * 1024 });
    const dim = (k: string) => {
      const n = Number(formData.get(`${field}${k}`));
      return Number.isInteger(n) && n > 0 && n <= 10_000 ? n : null;
    };
    await db.file.update({ where: { id: file.id }, data: { width: dim("Width"), height: dim("Height") } });
    return file.id;
  }
  return formData.get(`remove_${field}`) === "on" ? null : undefined;
}

const uploadError = (field: string, e: unknown): FormState => {
  if (e instanceof UploadError) return { ok: false, message: e.message, errors: { [field]: e.message } };
  throw e;
};

// ---------------- Testimonials ----------------

const TestimonialSchema = z.object({
  quote: z.string().trim().min(10, "Сэтгэгдлээ оруулна уу").max(2000),
  authorName: z.string().trim().min(2, "Нэр оруулна уу").max(120),
  authorTitle: text(120),
  companyName: text(160),
  sortOrder: order,
});

export async function saveTestimonial(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireStaff({ admin: true });
  const id = idParam(formData.get("id"));
  const parsed = TestimonialSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: "Талбаруудаа шалгана уу.", errors: errorsOf(parsed.error) };
  let photoId: string | null | undefined;
  try {
    photoId = await picture(formData, "photo");
  } catch (e) {
    return uploadError("photo", e);
  }
  const data = {
    ...parsed.data,
    productId: idParam(formData.get("productId")),
    isPublic: formData.get("isPublic") === "on",
    ...(photoId !== undefined ? { photoId } : {}),
  };
  if (id) await db.testimonial.update({ where: { id }, data });
  else await db.testimonial.create({ data });
  changed();
  return { ok: true, message: "Хадгалагдлаа." };
}

export async function deleteTestimonial(id: string) {
  await requireStaff({ admin: true });
  await db.testimonial.delete({ where: { id } });
  changed();
}

// ---------------- Client logos ----------------

const ClientSchema = z.object({
  name: z.string().trim().min(2, "Нэр оруулна уу").max(160),
  url: z
    .string()
    .trim()
    .max(500)
    .optional()
    .transform((v) => v || null)
    .refine((v) => v === null || /^https?:\/\//.test(v), "https://-ээр эхэлнэ"),
  sortOrder: order,
});

export async function saveClientLogo(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireStaff({ admin: true });
  const id = idParam(formData.get("id"));
  const parsed = ClientSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: "Талбаруудаа шалгана уу.", errors: errorsOf(parsed.error) };
  let logoId: string | null | undefined;
  try {
    logoId = await picture(formData, "logo");
  } catch (e) {
    return uploadError("logo", e);
  }
  if (!logoId && !id) return { ok: false, message: "Лого оруулна уу.", errors: { logo: "Лого заавал" } };
  const data = { ...parsed.data, isPublic: formData.get("isPublic") === "on" };
  if (id) await db.clientLogo.update({ where: { id }, data: { ...data, ...(logoId ? { logoId } : {}) } });
  else await db.clientLogo.create({ data: { ...data, logoId: logoId! } });
  changed();
  return { ok: true, message: "Хадгалагдлаа." };
}

export async function deleteClientLogo(id: string) {
  await requireStaff({ admin: true });
  await db.clientLogo.delete({ where: { id } });
  changed();
}

// ---------------- Company stats ----------------

const StatSchema = z.object({
  value: z.string().trim().min(1, "Тоо оруулна уу").max(40).regex(/\d|\{(years|founded|products|modules)\}/, "Тоо эсвэл {years} мэт автомат утга агуулсан байх ёстой (жишээ нь 500+)"),
  label: z.string().trim().min(2, "Юуг тоолсныг бичнэ үү").max(120),
  note: text(80),
  sortOrder: order,
});

export async function saveStat(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireStaff({ admin: true });
  const id = idParam(formData.get("id"));
  const parsed = StatSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: "Талбаруудаа шалгана уу.", errors: errorsOf(parsed.error) };
  const data = { ...parsed.data, isPublic: formData.get("isPublic") === "on" };
  if (id) await db.companyStat.update({ where: { id }, data });
  else await db.companyStat.create({ data });
  changed();
  return { ok: true, message: "Хадгалагдлаа." };
}

export async function deleteStat(id: string) {
  await requireStaff({ admin: true });
  await db.companyStat.delete({ where: { id } });
  changed();
}

/**
 * Adds one automatic figure (see autoStatTemplates) as an editable row. It keeps its
 * placeholders ({years}, {products}, ...), so the number stays current.
 */
export async function addAutoStat(autoId: string) {
  await requireStaff({ admin: true });
  const template = autoStatTemplates(await getStatTokens()).find((t) => t.id === autoId);
  if (!template || (await db.companyStat.count({ where: { value: template.value } }))) return;
  const last = await db.companyStat.aggregate({ _max: { sortOrder: true } });
  await db.companyStat.create({ data: { value: template.value, label: template.label, note: template.note, sortOrder: (last._max.sortOrder ?? 0) + 10 } });
  changed();
}

// ---------------- Case studies ----------------

const CaseSchema = z.object({
  title: z.string().trim().min(3, "Гарчиг оруулна уу").max(255),
  slug: z.string().trim().max(160).optional(),
  clientName: z.string().trim().min(2, "Байгууллагын нэр оруулна уу").max(160),
  industry: text(120),
  summary: text(600),
  highlights: text(600),
  body: z.string().max(500_000).default(""),
  sortOrder: order,
});

export async function saveCaseStudy(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireStaff();
  const id = idParam(formData.get("id"));
  const parsed = CaseSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: "Талбаруудаа шалгана уу.", errors: errorsOf(parsed.error) };
  const d = parsed.data;
  const slug = slugify(d.slug || `${d.clientName} ${d.title}`) || `case-${Date.now()}`;
  if (await db.caseStudy.findFirst({ where: { slug, ...(id ? { NOT: { id } } : {}) }, select: { id: true } }))
    return { ok: false, message: "Ийм slug-тай түүх байна.", errors: { slug: "Давхардсан байна" } };

  let coverId: string | null | undefined, logoId: string | null | undefined;
  try {
    coverId = await picture(formData, "cover");
    logoId = await picture(formData, "logo");
  } catch (e) {
    return uploadError("cover", e);
  }
  const productIds = idList(formData.getAll("products"));
  const publish = formData.get("published") === "on";
  const prev = id ? await db.caseStudy.findUnique({ where: { id }, select: { publishedAt: true } }) : null;
  const data = {
    ...d,
    slug,
    body: sanitizeHtml(d.body),
    // Keep the first publish date when a published story is edited.
    publishedAt: publish ? (prev?.publishedAt ?? new Date()) : null,
    ...(coverId !== undefined ? { coverId } : {}),
    ...(logoId !== undefined ? { logoId } : {}),
  };
  const saved = id
    ? await db.caseStudy.update({ where: { id }, data: { ...data, products: { set: productIds.map((p) => ({ id: p })) } }, select: { id: true } })
    : await db.caseStudy.create({ data: { ...data, products: { connect: productIds.map((p) => ({ id: p })) } }, select: { id: true } });
  updateTag(PRODUCTS_TAG);
  changed();
  if (!id) redirect(`/admin/case-studies/${saved.id}?saved=1`);
  return { ok: true, message: "Хадгалагдлаа." };
}

export async function deleteCaseStudy(id: string) {
  await requireStaff();
  await db.caseStudy.delete({ where: { id } });
  updateTag(TRUST_TAG);
  revalidatePath("/admin", "layout");
  redirect("/admin/case-studies");
}

// ---------------- Comparison table ----------------

/** Saves one row: its label, order and a value per compared product (`cell_<productId>`). */
export async function saveComparisonRow(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireStaff();
  const id = idParam(formData.get("id"));
  const label = String(formData.get("label") ?? "").trim().slice(0, 160);
  if (label.length < 2) return { ok: false, message: "Мөрийн нэр оруулна уу.", errors: { label: "Хоосон" } };
  const sortOrder = order.parse(formData.get("sortOrder") ?? 0);
  const cells = [...formData.entries()]
    .filter(([k]) => k.startsWith("cell_"))
    .map(([k, v]) => ({ productId: idParam(k.slice(5)), value: String(v).trim().slice(0, 255) }))
    .filter((c): c is { productId: string; value: string } => !!c.productId);

  const row = id ? await db.comparisonRow.update({ where: { id }, data: { label, sortOrder } }) : await db.comparisonRow.create({ data: { label, sortOrder } });
  await db.$transaction([
    db.comparisonCell.deleteMany({ where: { rowId: row.id, productId: { in: cells.map((c) => c.productId) } } }),
    db.comparisonCell.createMany({ data: cells.filter((c) => c.value).map((c) => ({ ...c, rowId: row.id })) }),
  ]);
  updateTag(PRODUCTS_TAG);
  revalidatePath("/admin", "layout");
  refresh();
  return { ok: true, message: "Хадгалагдлаа." };
}

export async function deleteComparisonRow(id: string) {
  await requireStaff();
  await db.comparisonRow.delete({ where: { id } });
  updateTag(PRODUCTS_TAG);
  revalidatePath("/admin", "layout");
  refresh();
}
