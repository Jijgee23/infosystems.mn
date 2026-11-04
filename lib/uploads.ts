import "server-only";
import { randomBytes } from "node:crypto";
import { createId } from "@paralleldrive/cuid2";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { db } from "@/lib/db";
import type { Prisma } from "@/lib/generated/prisma/client";

/** Files live outside /public so uploads made at runtime are served by app/uploads/[...path]. */
export const UPLOAD_DIR = path.resolve(/*turbopackIgnore: true*/ process.env.UPLOAD_DIR ?? "storage/uploads");
/** Customer attachments: outside UPLOAD_DIR, served only by app/files/[id] after an access check. */
export const PRIVATE_DIR = path.resolve(/*turbopackIgnore: true*/ process.env.PRIVATE_UPLOAD_DIR ?? "storage/private");

/** Path on disk of a stored file row. */
export const filePath = (f: { hash: string; ext: string | null; isPrivate: boolean }) =>
  path.join(/*turbopackIgnore: true*/ f.isPrivate ? PRIVATE_DIR : UPLOAD_DIR, f.hash + (f.ext ?? ""));

export const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];
export const DOC_TYPES = ["application/pdf"];
const EXT: Record<string, string> = { "image/png": ".png", "image/jpeg": ".jpg", "image/webp": ".webp", "image/gif": ".gif", "application/pdf": ".pdf" };

/**
 * Files offered on /support/downloads, checked by extension: browsers report installers and
 * archives with inconsistent MIME types (or none). Value: the type they are stored and served with.
 */
export const DOWNLOAD_EXTS: Record<string, string> = {
  ".exe": "application/vnd.microsoft.portable-executable",
  ".msi": "application/x-msi",
  ".zip": "application/zip",
  ".rar": "application/vnd.rar",
  ".7z": "application/x-7z-compressed",
  ".apk": "application/vnd.android.package-archive",
  ".pdf": "application/pdf",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".xls": "application/vnd.ms-excel",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".doc": "application/msword",
};

export class UploadError extends Error {}

/** Validates and stores an uploaded file, returning its `files` row. */
export async function saveUpload(
  file: File,
  opts: { types?: string[]; maxBytes?: number; private?: boolean; /** Check by extension instead of MIME type (see DOWNLOAD_EXTS). */ extensions?: Record<string, string> } = {},
) {
  const types = opts.types ?? [...IMAGE_TYPES, ...DOC_TYPES];
  const maxBytes = opts.maxBytes ?? 10 * 1024 * 1024;
  const byExt = opts.extensions ? path.extname(file.name).toLowerCase() : null;
  const mime = byExt !== null ? opts.extensions![byExt] : types.includes(file.type) ? file.type : undefined;
  if (!mime) throw new UploadError(`Зөвшөөрөгдөөгүй файлын төрөл: ${file.name}`);
  if (file.size > maxBytes) throw new UploadError(`Файл хэт том байна (${Math.round(maxBytes / 1024 / 1024)}MB хүртэл): ${file.name}`);

  const ext = byExt ?? EXT[mime];
  const base = path.basename(file.name, path.extname(file.name)).replace(/[^\p{L}\p{N}_-]+/gu, "_").slice(0, 60) || "file";
  const hash = `${base}_${randomBytes(5).toString("hex")}`;
  const isPrivate = !!opts.private;
  const dest = filePath({ hash, ext, isPrivate });
  const data = Buffer.from(await file.arrayBuffer());
  // Pixel size, for next/image (reserves the space, so the page doesn't jump while loading).
  const { width, height } = IMAGE_TYPES.includes(mime) ? await imageSize(data) : {};
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.writeFile(dest, data);

  const id = createId();
  try {
    return await db.file.create({
      data: {
        id,
        name: file.name.slice(0, 255),
        hash,
        ext,
        mime,
        sizeKb: Math.round(file.size / 1024),
        width,
        height,
        isPrivate,
        url: isPrivate ? `/files/${id}` : `/uploads/${hash}${ext}`,
      },
    });
  } catch (e) {
    await fs.rm(dest, { force: true });
    throw e;
  }
}

/** Display size of an image (EXIF rotation applied); a file sharp can't read is rejected. */
async function imageSize(data: Buffer) {
  try {
    const m = await sharp(data).metadata();
    const rotated = (m.orientation ?? 1) >= 5;
    return { width: rotated ? m.height : m.width, height: rotated ? m.width : m.height };
  } catch {
    throw new UploadError("Зургийн файлыг уншиж чадсангүй.");
  }
}

/**
 * Saves several files, all or nothing: if one is rejected, the ones already written are removed,
 * so a failed form never leaves orphan rows and files behind.
 */
export async function saveUploads(files: File[], opts: Parameters<typeof saveUpload>[1] = {}) {
  const saved: Awaited<ReturnType<typeof saveUpload>>[] = [];
  try {
    for (const f of files) saved.push(await saveUpload(f, opts));
    return saved;
  } catch (e) {
    await releaseUploads(saved.map((f) => f.id));
    throw e;
  }
}

/** A file row that no record points at. Keep in sync with the relations on `model File`. */
const UNUSED = {
  posts: { none: {} },
  products: { none: {} },
  productLogos: { none: {} },
  productBgs: { none: {} },
  testimonials: { none: {} },
  clientLogos: { none: {} },
  caseCovers: { none: {} },
  caseLogos: { none: {} },
  issueAttachments: { none: {} },
  coreIssueFiles: { none: {} },
  employees: { none: {} },
  awards: { none: {} },
  downloads: { none: {} },
} satisfies Prisma.FileWhereInput;

/**
 * Deletes files (row and disk) that a record just stopped using: a replaced or removed picture,
 * or the files of a deleted record. A file still referenced anywhere is kept, and so are files
 * imported from the old CMS, which old rich text may still link to by URL.
 * Never throws: cleanup must not fail the save that triggered it.
 */
export async function releaseUploads(ids: Iterable<string | null | undefined>) {
  const list = [...new Set([...ids].filter((v): v is string => !!v))];
  if (!list.length) return;
  try {
    const files = await db.file.findMany({ where: { id: { in: list }, legacyId: null, ...UNUSED } });
    for (const f of files) {
      // Re-checked in the delete itself, in case something started using the file meanwhile.
      const { count } = await db.file.deleteMany({ where: { id: f.id, legacyId: null, ...UNUSED } });
      if (count) await fs.rm(filePath(f), { force: true });
    }
  } catch (e) {
    console.error("[uploads] cleanup failed", list, e);
  }
}

/** Non-empty File entries for a multi-file input. */
export const filesFrom = (formData: FormData, name: string) =>
  formData.getAll(name).filter((f): f is File => f instanceof File && f.size > 0);
