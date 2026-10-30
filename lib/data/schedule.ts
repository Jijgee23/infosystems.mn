import "server-only";
import { db } from "@/lib/db";

/**
 * Scheduled publishing vs. "use cache": a cached list filters on publishedAt <= now when it
 * is filled, so an item scheduled for later would stay hidden until the entry expires
 * (hours to days). Each cached reader asks for the next scheduled time and, when it falls
 * inside the preset's window, refreshes at that moment instead:
 *
 *   cacheLife(lifeUntil(await nextPublishAt("post"), "hours"));
 */

// Next.js preset profiles (seconds), see node_modules/next/dist/docs/.../cacheLife.md.
const PRESETS = {
  hours: { stale: 300, revalidate: 3600, expire: 86_400 },
  days: { stale: 300, revalidate: 86_400, expire: 604_800 },
} as const;

/** When the next scheduled (future publishedAt) row of a model goes live, if any. */
export async function nextPublishAt(model: "post" | "product" | "caseStudy" | "guide"): Promise<Date | null> {
  const args = { where: { publishedAt: { gt: new Date() } }, orderBy: { publishedAt: "asc" as const }, select: { publishedAt: true } };
  const row =
    model === "post"
      ? await db.post.findFirst(args)
      : model === "product"
        ? await db.product.findFirst(args)
        : model === "guide"
          ? await db.guide.findFirst(args)
          : await db.caseStudy.findFirst(args);
  return row?.publishedAt ?? null;
}

/**
 * The preset's values, or an inline profile that revalidates when `next` goes live. Revalidation is
 * stale-while-revalidate: the first request after that moment triggers the refresh, and the item shows from the next one.
 */
export function lifeUntil(next: Date | null | (Date | null)[], preset: keyof typeof PRESETS): { stale: number; revalidate: number; expire: number } {
  const p = PRESETS[preset];
  const times = (Array.isArray(next) ? next : [next]).filter((d): d is Date => !!d).map((d) => d.getTime());
  const secs = times.length ? Math.ceil((Math.min(...times) - Date.now()) / 1000) : Infinity;
  if (secs >= p.revalidate) return { ...p };
  // At least a minute: shorter lifetimes would turn the cached data into a per-request hole.
  const revalidate = Math.max(secs, 60);
  return { stale: Math.min(p.stale, revalidate), revalidate, expire: p.expire };
}
