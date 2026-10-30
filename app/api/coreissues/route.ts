import { db } from "@/lib/db";
import { strapiError } from "@/lib/legacy";
import { escapeHtml, NOTIFY_EMAIL, sendMail } from "@/lib/mail";
import { isRateLimited } from "@/lib/rate-limit";
import { IMAGE_TYPES, saveUpload, UploadError } from "@/lib/uploads";

/**
 * POST /api/coreissues — Strapi-compatible create used by custom-project apps.
 * Accepts JSON, or multipart with a `data` JSON field and `files.image` (Strapi convention).
 */
export async function POST(req: Request) {
  if (await isRateLimited("coreissues", 20, 60 * 60_000)) return strapiError(429, "Too many requests");

  let data: Record<string, unknown> = {};
  let uploads: File[] = [];
  const type = req.headers.get("content-type") ?? "";
  try {
    if (type.includes("multipart/form-data")) {
      const form = await req.formData();
      data = JSON.parse(String(form.get("data") ?? "{}"));
      uploads = [...form.getAll("files.image"), ...form.getAll("files")].filter((f): f is File => f instanceof File && f.size > 0).slice(0, 10);
    } else {
      data = await req.json();
    }
  } catch {
    return strapiError(400, "Invalid body");
  }

  const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : null);
  const title = str(data.title, 255);
  const description = str(data.description, 20_000);
  if (!title && !description) return strapiError(400, "title or description is required");

  // projectcategory may be sent as the old numeric id or a slug.
  let categoryId: string | null = null;
  if (data.projectcategory != null) {
    const v = String(data.projectcategory);
    const cat = await db.projectCategory.findFirst({
      where: /^\d+$/.test(v) ? { OR: [{ legacyId: Number(v) }, { slug: v }] } : { slug: v },
      select: { id: true },
    });
    categoryId = cat?.id ?? null;
  }

  let files;
  try {
    files = await Promise.all(uploads.map((f) => saveUpload(f, { types: IMAGE_TYPES, private: true })));
  } catch (e) {
    if (e instanceof UploadError) return strapiError(400, e.message);
    throw e;
  }

  const row = await db.coreIssue.create({
    data: {
      title,
      description: description ? escapeHtml(description).replace(/\n/g, "<br>") : null,
      name: str(data.name, 255),
      email: str(data.email, 255),
      categoryId,
      files: { create: files.map((f) => ({ fileId: f.id })) },
    },
  });

  await sendMail({ to: NOTIFY_EMAIL, subject: `[infosystems.mn] Төслийн асуудал — ${title ?? ""}`, html: `<p>${escapeHtml(description ?? "")}</p>` });

  return Response.json({
    id: row.id,
    title: row.title,
    description: row.description,
    name: row.name,
    email: row.email,
    status: row.status,
    projectcategory: categoryId,
    image: files.map((f) => ({ id: f.id, name: f.name, url: f.url, mime: f.mime })),
    created_at: row.createdAt.toISOString(),
    updated_at: row.updatedAt.toISOString(),
  });
}
