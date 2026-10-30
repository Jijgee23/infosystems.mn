import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib/db";

export const DOWNLOADS_TAG = "downloads";

/** Public entries of /support/downloads, in admin order. */
export async function getDownloads() {
  "use cache";
  cacheLife("days");
  cacheTag(DOWNLOADS_TAG);
  const rows = await db.download.findMany({
    where: { isPublic: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: { id: true, title: true, description: true, externalUrl: true, guideSlug: true, file: { select: { url: true, name: true, sizeKb: true } } },
  });
  return rows.map(({ file, ...d }) => ({ ...d, fileUrl: file?.url ?? null, fileName: file?.name ?? null, fileSizeKb: file?.sizeKb ?? null }));
}

/** 3743 -> "3.7 MB", 512 -> "512 KB". */
export const formatSize = (kb: number | null) => (kb == null ? "" : kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`);
