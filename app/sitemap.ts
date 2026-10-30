import fs from "node:fs";
import path from "node:path";
import type { MetadataRoute } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib/db";
import { GUIDES_TAG } from "@/lib/data/guides";
import { getPublishedPosts } from "@/lib/data/posts";
import { PRODUCTS_TAG } from "@/lib/data/products";
import { lifeUntil, nextPublishAt } from "@/lib/data/schedule";
import { TRUST_TAG } from "@/lib/data/trust";

const SITE = process.env.SITE_URL ?? "https://infosystems.mn";

/**
 * Every static page under app/(site), skipping dynamic segments and the portal.
 * Reads the app source, which `next start` runs next to; dynamic pages come from the DB below.
 */
function staticRoutes(dir = path.join(/*turbopackIgnore: true*/ process.cwd(), "app", "(site)"), base = ""): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const name = entry.name;
    if (name.startsWith("[") || name === "portal") continue;
    const seg = name.startsWith("(") ? base : `${base}/${name}`;
    const full = path.join(/*turbopackIgnore: true*/ dir, name);
    if (fs.existsSync(path.join(full, "page.tsx"))) out.push(seg);
    out.push(...staticRoutes(full, seg));
  }
  return out;
}

/** Product, module, case-study and guide pages; same visibility rules as the pages themselves. */
async function dynamicPages(): Promise<MetadataRoute.Sitemap> {
  "use cache";
  cacheLife(lifeUntil(await Promise.all([nextPublishAt("product"), nextPublishAt("caseStudy"), nextPublishAt("guide")]), "days"));
  cacheTag(PRODUCTS_TAG, TRUST_TAG, GUIDES_TAG);
  const published = { publishedAt: { not: null, lte: new Date() } };
  const [products, cases, guides] = await Promise.all([
    // Unlisted products keep their page, so they stay in the sitemap too.
    db.product.findMany({
      where: { ...published, OR: [{ parentId: null }, { parent: published }] },
      select: { slug: true, updatedAt: true, parentId: true, parent: { select: { slug: true } } },
    }),
    db.caseStudy.findMany({ where: published, select: { slug: true, updatedAt: true } }),
    db.guide.findMany({ where: published, select: { slug: true, updatedAt: true } }),
  ]);
  return [
    ...products.map((p) => ({
      url: `${SITE}/products/${p.parent ? `${p.parent.slug}/` : ""}${p.slug}`,
      lastModified: p.updatedAt,
      priority: p.parentId ? 0.7 : 0.9,
    })),
    ...cases.map((c) => ({ url: `${SITE}/customers/${c.slug}`, lastModified: c.updatedAt, priority: 0.6 })),
    ...guides.map((g) => ({ url: `${SITE}/support/guides/${g.slug}`, lastModified: g.updatedAt, priority: 0.6 })),
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ["", ...staticRoutes()].map((p) => ({ url: `${SITE}${p}`, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.7 }));
  const [dynamic, posts] = await Promise.all([
    dynamicPages().catch((e) => {
      console.error("[sitemap] products/case studies unavailable", e);
      return [];
    }),
    getPublishedPosts().then(
      (rows) => rows.map((p) => ({ url: `${SITE}/news/${p.slug}`, lastModified: p.publishedAt ?? undefined, priority: 0.5 })),
      (e) => {
        console.error("[sitemap] posts unavailable", e);
        return [];
      },
    ),
  ]);
  return [...pages, ...dynamic, ...posts];
}
