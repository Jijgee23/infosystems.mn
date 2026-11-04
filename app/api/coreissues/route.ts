import { db } from "@/lib/db";
import { strapiError } from "@/lib/legacy";
import { escapeHtml, NOTIFY_TO, SITE_URL, sendMail } from "@/lib/mail";
import { after } from "next/server";
import { isKeyRateLimited, isRateLimited } from "@/lib/rate-limit";
import { IMAGE_TYPES, releaseUploads, saveUploads, UploadError } from "@/lib/uploads";

// Open endpoint (no sign-in), so uploads are capped per request and requests per day overall.
const MAX_FILES = 5;
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const DAILY_LIMIT = 300;

/**
 * POST /api/coreissues — Strapi-compatible create used by custom-project apps.
 * Accepts JSON, or multipart with a `data` JSON field and `files.image` (Strapi convention).
 */
export async function POST(req: Request) {
  if (await isRateLimited("coreissues", 20, 60 * 60_000)) return strapiError(429, "Too many requests");
  if (isKeyRateLimited("coreissues:all", DAILY_LIMIT, 24 * 60 * 60_000)) return strapiError(429, "Too many requests");

  let data: Record<string, unknown> = {};
  let uploads: File[] = [];
  const type = req.headers.get("content-type") ?? "";
  try {
    if (type.includes("multipart/form-data")) {
      const form = await req.formData();
      data = JSON.parse(String(form.get("data") ?? "{}"));
      uploads = [...form.getAll("files.image"), ...form.getAll("files")].filter((f): f is File => f instanceof File && f.size > 0).slice(0, MAX_FILES);
    } else {
      data = await req.json();
    }
  } catch {
    return strapiError(400, "Invalid body");
  }
  // `null`, a number or an array is valid JSON but not a request.
  if (!data || typeof data !== "object" || Array.isArray(data)) return strapiError(400, "Invalid body");

  const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : null);
  const title = str(data.title, 255);
  const description = str(data.description, 20_000);
  if (!title && !description) return strapiError(400, "title or description is required");

  // projectcategory may be sent as the old numeric id or a slug.
  let categoryId: string | null = null;
  if (data.projectcategory != null) {
    const v = String(data.projectcategory);
    const cat = await db.projectCategory.findFirst({
      // Up to 9 digits, so the number always fits the integer column.
      where: /^\d{1,9}$/.test(v) ? { OR: [{ legacyId: Number(v) }, { slug: v }] } : { slug: v },
      select: { id: true },
    });
    categoryId = cat?.id ?? null;
  }

  let files;
  try {
    files = await saveUploads(uploads, { types: IMAGE_TYPES, maxBytes: MAX_FILE_BYTES, private: true });
  } catch (e) {
    if (e instanceof UploadError) return strapiError(400, e.message);
    throw e;
  }

  let row;
  try {
    row = await db.coreIssue.create({
      data: {
        title,
        description: description ? escapeHtml(description).replace(/\n/g, "<br>") : null,
        name: str(data.name, 255),
        email: str(data.email, 255),
        categoryId,
        files: { create: files.map((f) => ({ fileId: f.id })) },
      },
    });
  } catch (e) {
    await releaseUploads(files.map((f) => f.id));
    throw e;
  }

  const reporter = str(data.email, 255);
  // After the response: the desktop app shouldn't wait on SMTP.
  after(() => sendMail({
    to: NOTIFY_TO,
    replyTo: reporter ?? undefined,
    subject: `Төслийн асуудал — ${title ?? ""} · InfoSystems`,
    content: {
      kicker: "Төслийн асуудал",
      title: title ?? "Шинэ асуудал",
      intro: "Төслийн программаас шинэ асуудал ирлээ.",
      fields: [
        { label: "Илгээсэн", value: str(data.name, 255) },
        { label: "И-мэйл", value: reporter },
        { label: "Хавсралт", value: files.length ? `${files.length} файл` : null },
      ],
      message: { label: "Тайлбар", value: description },
      button: { label: "Админ хэсэгт харах", url: `${SITE_URL}/admin/core-issues` },
      footnote: "Энэ мэйлийг infosystems.mn сайт автоматаар илгээв.",
    },
  }));

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
