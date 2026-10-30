import "server-only";
import { createReadStream } from "node:fs";
import fs from "node:fs/promises";
import { Readable } from "node:stream";

/**
 * Streams a file from disk with conditional GET (ETag / Last-Modified → 304) and single
 * byte ranges (206), so large PDFs and installers aren't buffered in memory, videos can
 * seek and interrupted downloads can resume. Returns null when the file doesn't exist.
 */
export async function serveFile(req: Request, file: string, headers: Record<string, string>): Promise<Response | null> {
  const stat = await fs.stat(file).catch(() => null);
  if (!stat?.isFile()) return null;

  const etag = `W/"${stat.size.toString(16)}-${Math.floor(stat.mtimeMs).toString(16)}"`;
  const base: Record<string, string> = { ...headers, ETag: etag, "Last-Modified": stat.mtime.toUTCString(), "Accept-Ranges": "bytes" };

  const inm = req.headers.get("if-none-match");
  const ims = req.headers.get("if-modified-since");
  const notModified = inm ? inm.split(",").some((t) => t.trim() === etag || t.trim() === "*") : !!ims && Math.floor(stat.mtimeMs / 1000) <= Math.floor(Date.parse(ims) / 1000);
  if (notModified) return new Response(null, { status: 304, headers: base });

  let start = 0;
  let end = stat.size - 1;
  let status = 200;
  const range = req.headers.get("range");
  // A range is honoured only while the file still matches the client's copy (If-Range).
  const ifRange = req.headers.get("if-range");
  if (range && (!ifRange || ifRange === etag)) {
    const m = /^bytes=(\d*)-(\d*)$/.exec(range.trim());
    if (m && (m[1] || m[2])) {
      if (m[1]) {
        start = Number(m[1]);
        if (m[2]) end = Math.min(Number(m[2]), stat.size - 1);
      } else start = Math.max(0, stat.size - Number(m[2])); // suffix: last N bytes
      if (start > end || start >= stat.size)
        return new Response(null, { status: 416, headers: { ...base, "Content-Range": `bytes */${stat.size}` } });
      status = 206;
      base["Content-Range"] = `bytes ${start}-${end}/${stat.size}`;
    }
  }

  base["Content-Length"] = String(stat.size ? end - start + 1 : 0);
  if (req.method === "HEAD" || !stat.size) return new Response(null, { status, headers: base });
  const body = Readable.toWeb(createReadStream(file, { start, end })) as ReadableStream<Uint8Array>;
  return new Response(body, { status, headers: base });
}
