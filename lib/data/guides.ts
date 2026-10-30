import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib/db";
import { GUIDE_CATEGORIES } from "@/lib/guide-categories";
import { hasVideo } from "@/lib/rich-body";
import { lifeUntil, nextPublishAt } from "./schedule";

export const GUIDES_TAG = "guides";

const published = () => ({ publishedAt: { not: null, lte: new Date() } });
const rank = (category: string) => {
  const i = GUIDE_CATEGORIES.findIndex((c) => c.key === category);
  return i < 0 ? GUIDE_CATEGORIES.length : i;
};

/** Published guides in display order (category, then step), without their bodies. */
export async function getGuides() {
  "use cache";
  cacheLife(lifeUntil(await nextPublishAt("guide"), "days"));
  cacheTag(GUIDES_TAG);
  const rows = await db.guide.findMany({
    where: published(),
    orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
    select: { id: true, slug: true, title: true, category: true, sortOrder: true, contentDate: true, updatedAt: true, body: true },
  });
  return rows
    .map(({ body, ...g }) => ({ ...g, video: hasVideo(body) }))
    .sort((a, b) => rank(a.category) - rank(b.category));
}

export type GuideListItem = Awaited<ReturnType<typeof getGuides>>[number];

export async function getGuide(slug: string) {
  "use cache";
  cacheLife(lifeUntil(await nextPublishAt("guide"), "days"));
  cacheTag(GUIDES_TAG, `guide:${slug}`);
  return db.guide.findFirst({ where: { slug, ...published() } });
}
