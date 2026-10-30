import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib/db";
import { lifeUntil, nextPublishAt } from "./schedule";

export const POSTS_TAG = "posts";

const published = () => ({ publishedAt: { not: null, lte: new Date() } });

export async function getPublishedPosts() {
  "use cache";
  cacheLife(lifeUntil(await nextPublishAt("post"), "hours"));
  cacheTag(POSTS_TAG);
  const rows = await db.post.findMany({
    where: published(),
    orderBy: { publishedAt: "desc" },
    select: { id: true, title: true, slug: true, category: true, excerpt: true, body: true, publishedAt: true, image: { select: { url: true, width: true, height: true } } },
  });
  return rows.map(({ image, ...p }) => ({ ...p, imageUrl: image?.url ?? null, imageWidth: image?.width ?? null, imageHeight: image?.height ?? null }));
}

export async function getPostBySlug(slug: string) {
  "use cache";
  cacheLife(lifeUntil(await nextPublishAt("post"), "hours"));
  cacheTag(POSTS_TAG, `post:${slug}`);
  const post = await db.post.findFirst({ where: { slug, ...published() }, include: { image: { select: { url: true, width: true, height: true } } } });
  if (!post) return null;
  const { image, ...rest } = post;
  return { ...rest, imageUrl: image?.url ?? null, imageWidth: image?.width ?? null, imageHeight: image?.height ?? null };
}

/** Most read published posts (the old site's «Их уншсан» list). Counts change slowly enough for an hourly cache. */
export async function getPopularPosts(limit = 5) {
  "use cache";
  cacheLife(lifeUntil(await nextPublishAt("post"), "hours"));
  cacheTag(POSTS_TAG);
  return db.post.findMany({
    where: { ...published(), viewCount: { gt: 0 } },
    orderBy: [{ viewCount: "desc" }, { publishedAt: "desc" }],
    take: limit,
    select: { id: true, title: true, slug: true, publishedAt: true },
  });
}

/** Plain-text summary from the stored excerpt or the HTML body. */
export function summary(post: { excerpt: string | null; body: string }, max = 180) {
  const text = (post.excerpt || post.body.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " "))
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? text.slice(0, max).replace(/\s+\S*$/, "") + "…" : text;
}

export const formatDate = (d: Date | null) =>
  d ? new Intl.DateTimeFormat("mn-MN", { year: "numeric", month: "long", day: "numeric", timeZone: "Asia/Ulaanbaatar" }).format(d) : "";
