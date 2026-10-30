import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib/db";
import { PRODUCTS_TAG } from "./products";

/** Changes to version_infos (admin › Хувилбарын түүх). */
export const UPDATES_TAG = "updates";

/**
 * Published release notes (version_infos) for the given desktop product names, newest
 * first. These are the same rows the MACS / POS apps read from /api/version-infos.
 */
export async function getUpdates(names: string[], limit?: number) {
  "use cache";
  cacheLife("hours");
  cacheTag(UPDATES_TAG);
  if (!names.length) return [];
  return db.versionInfo.findMany({
    where: { productname: { in: names }, publishedAt: { not: null }, description: { not: null } },
    orderBy: [{ changedDate: "desc" }, { seq: "desc" }],
    take: limit,
    select: { id: true, changedDate: true, description: true, productname: true },
  });
}

/** Products that have release notes, for the /updates filter. */
export async function getUpdateProducts() {
  "use cache";
  cacheLife("hours");
  cacheTag(UPDATES_TAG, PRODUCTS_TAG);
  return db.product.findMany({
    where: { versionNames: { isEmpty: false }, listed: true, publishedAt: { not: null } },
    orderBy: [{ sortOrder: "asc" }],
    select: { slug: true, name: true, versionNames: true },
  });
}
