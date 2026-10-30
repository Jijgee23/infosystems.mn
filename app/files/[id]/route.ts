import { getSessionUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { idParam } from "@/lib/ids";
import { serveFile } from "@/lib/serve-file";
import { filePath } from "@/lib/uploads";

const notFound = () => new Response("Not found", { status: 404, headers: { "Cache-Control": "private, no-store" } });

/**
 * GET /files/:id — private uploads (issue attachments, project-issue screenshots).
 * Staff see every file; a customer only the attachments of their own issues.
 * Anyone else gets 404, so the response doesn't reveal whether the file exists.
 */
export async function GET(req: Request, ctx: RouteContext<"/files/[id]">) {
  const id = idParam((await ctx.params).id);
  if (!id) return notFound();

  const file = await db.file.findUnique({ where: { id } });
  if (!file?.isPrivate) return notFound();

  if (!(await getSessionUser("staff"))) {
    const user = await getSessionUser("customer");
    const owns =
      user && (await db.issueAttachment.findFirst({ where: { fileId: id, issue: { userId: user.id } }, select: { fileId: true } }));
    if (!owns) return notFound();
  }

  const res = await serveFile(req, filePath(file), {
    "Content-Type": file.mime,
    "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(file.name)}`,
    "Cache-Control": "private, no-store",
    // Private uploads are images and PDFs only (no SVG), so nothing served here can run scripts.
    "X-Content-Type-Options": "nosniff",
  });
  return res ?? notFound();
}

export const HEAD = GET;
