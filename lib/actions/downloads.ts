"use server";

import { refresh, revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireStaff } from "@/lib/auth/session";
import { DOWNLOADS_TAG } from "@/lib/data/downloads";
import { db } from "@/lib/db";
import { idParam } from "@/lib/ids";
import { DOWNLOAD_EXTS, saveUpload, UploadError } from "@/lib/uploads";
import type { FormState } from "./contact";

const optional = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : undefined);

const DownloadSchema = z.object({
  title: z.string().trim().min(2, "Нэр оруулна уу").max(160),
  description: z.preprocess(optional, z.string().max(500).optional()),
  externalUrl: z.preprocess(optional, z.url({ protocol: /^https?$/, error: "http(s):// хаяг оруулна уу" }).max(512).optional()),
  guideSlug: z.preprocess(optional, z.string().max(160).optional()),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0),
});

function downloadsChanged() {
  updateTag(DOWNLOADS_TAG);
  revalidatePath("/admin/downloads");
}

export async function saveDownload(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireStaff();
  const id = idParam(formData.get("id"));
  const parsed = DownloadSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: "Талбаруудаа шалгана уу.", errors: Object.fromEntries(parsed.error.issues.map((i) => [String(i.path[0]), i.message])) };
  const d = parsed.data;

  let fileId: string | null | undefined = undefined;
  const file = formData.get("file");
  if (file instanceof File && file.size > 0) {
    try {
      fileId = (await saveUpload(file, { extensions: DOWNLOAD_EXTS, maxBytes: 50 * 1024 * 1024 })).id;
    } catch (e) {
      if (e instanceof UploadError) return { ok: false, message: e.message, errors: { file: e.message } };
      throw e;
    }
  } else if (formData.get("removeFile") === "on") fileId = null;

  const existing = id ? await db.download.findUnique({ where: { id }, select: { fileId: true } }) : null;
  if (!d.externalUrl && !(fileId ?? (fileId === undefined ? existing?.fileId : null)))
    return { ok: false, message: "Файл хавсаргах эсвэл холбоос оруулна уу.", errors: { externalUrl: "Файл эсвэл холбоосын аль нэг шаардлагатай" } };

  const data = {
    title: d.title,
    description: d.description ?? null,
    externalUrl: d.externalUrl ?? null,
    guideSlug: d.guideSlug ?? null,
    sortOrder: d.sortOrder,
    isPublic: formData.get("isPublic") === "on",
    ...(fileId !== undefined ? { fileId } : {}),
  };
  const saved = id ? await db.download.update({ where: { id }, data, select: { id: true } }) : await db.download.create({ data, select: { id: true } });
  downloadsChanged();
  if (!id) redirect(`/admin/downloads/${saved.id}?saved=1`);
  refresh();
  return { ok: true, message: "Хадгалагдлаа." };
}

export async function deleteDownload(id: string) {
  await requireStaff();
  await db.download.delete({ where: { id } });
  downloadsChanged();
  redirect("/admin/downloads");
}
