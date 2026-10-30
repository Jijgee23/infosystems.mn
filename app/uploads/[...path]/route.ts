import path from "node:path";
import { serveFile } from "@/lib/serve-file";
import { UPLOAD_DIR } from "@/lib/uploads";

const TYPES: Record<string, string> = {
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".jfif": "image/jpeg", ".webp": "image/webp",
  ".gif": "image/gif", ".svg": "image/svg+xml", ".pdf": "application/pdf", ".mp4": "video/mp4",
  ".zip": "application/zip", ".exe": "application/octet-stream", ".rar": "application/vnd.rar",
  ".msi": "application/octet-stream", ".7z": "application/x-7z-compressed", ".apk": "application/vnd.android.package-archive",
  ".doc": "application/msword", ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".ppt": "application/vnd.ms-powerpoint", ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".xls": "application/vnd.ms-excel", ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};

/** GET /uploads/* — serves files from UPLOAD_DIR (same URLs as the old Strapi /uploads). */
export async function GET(req: Request, ctx: RouteContext<"/uploads/[...path]">) {
  const parts = (await ctx.params).path.map((p) => decodeURIComponent(p));
  const file = path.resolve(UPLOAD_DIR, ...parts);
  if (!file.startsWith(UPLOAD_DIR + path.sep)) return new Response("Not found", { status: 404 });
  const ext = path.extname(file).toLowerCase();
  const headers: Record<string, string> = {
    "Content-Type": TYPES[ext] ?? "application/octet-stream",
    // File names carry a random hash and are never rewritten, so they can be cached for good.
    "Cache-Control": "public, max-age=31536000, immutable",
    "X-Content-Type-Options": "nosniff",
  };
  // SVG can carry scripts; never render it inline from this origin.
  if (ext === ".svg") headers["Content-Security-Policy"] = "default-src 'none'; style-src 'unsafe-inline'";
  return (await serveFile(req, file, headers)) ?? new Response("Not found", { status: 404 });
}

export const HEAD = GET;
