import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib/db";
import { lifeUntil, nextPublishAt } from "./schedule";

export const PRODUCTS_TAG = "products";

const published = () => ({ publishedAt: { not: null, lte: new Date() } });

export type NavProduct = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  icon: string | null;
  badge: string | null;
  logoUrl: string | null;
  status: "available" | "coming_soon";
  group: "main" | "featured" | "other";
  modules: { slug: string; name: string; tagline: string | null }[];
};

/**
 * Listed, published top-level products with their modules, in admin order. Feeds the
 * header menu, the /products page and the «Бусад бүтээгдэхүүн» sidebar.
 */
export async function getProductNav(): Promise<NavProduct[]> {
  "use cache";
  cacheLife(lifeUntil(await nextPublishAt("product"), "days"));
  cacheTag(PRODUCTS_TAG);
  const rows = await db.product.findMany({
    where: { parentId: null, listed: true, ...published() },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      slug: true,
      name: true,
      tagline: true,
      icon: true,
      badge: true,
      logo: { select: { url: true } },
      status: true,
      group: true,
      modules: {
        where: { listed: true, ...published() },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        select: { slug: true, name: true, tagline: true },
      },
    },
  });
  return rows.map(({ logo, ...p }) => ({ ...p, logoUrl: logo?.url ?? null }));
}

/**
 * A published product page with its blocks. `parentSlug` is required for modules and
 * must be absent for top-level products, so each page has exactly one URL.
 */
export async function getProductPage(slug: string, parentSlug: string | null) {
  "use cache";
  cacheLife(lifeUntil(await nextPublishAt("product"), "days"));
  cacheTag(PRODUCTS_TAG, `product:${slug}`);
  const p = await db.product.findFirst({
    where: { slug, ...published(), ...(parentSlug ? { parent: { slug: parentSlug, ...published() } } : { parentId: null }) },
    include: {
      image: { select: { url: true } },
      logo: { select: { url: true } },
      background: { select: { url: true } },
      parent: { select: { slug: true, name: true } },
      blocks: { orderBy: { sortOrder: "asc" }, include: { items: { orderBy: { sortOrder: "asc" } } } },
      modules: {
        where: { listed: true, ...published() },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        select: { slug: true, name: true, tagline: true },
      },
    },
  });
  if (!p) return null;
  // Modules of the same parent, for the side menu and previous / next links.
  const siblings = p.parentId
    ? await db.product.findMany({
        where: { parentId: p.parentId, listed: true, ...published() },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        select: { slug: true, name: true },
      })
    : [];
  const { image, logo, background, ...rest } = p;
  return { ...rest, imageUrl: image?.url ?? null, logoUrl: logo?.url ?? null, backgroundUrl: background?.url ?? null, siblings, summary: p.tagline || summary(p.blocks.find((b) => b.kind === "text")?.body) };
}

export type ProductPageData = NonNullable<Awaited<ReturnType<typeof getProductPage>>>;

/** Plain-text summary of HTML, for meta descriptions and list fallbacks. */
export function summary(html: string | null | undefined, max = 160) {
  const text = (html ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&[a-z]+;/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? text.slice(0, max).replace(/\s+\S*$/, "") + "…" : text;
}

/** Comparison table on /products: products marked «Харьцуулалтад» (columns) × admin rows. */
export async function getComparison() {
  "use cache";
  cacheLife(lifeUntil(await nextPublishAt("product"), "days"));
  cacheTag(PRODUCTS_TAG);
  const [products, rows] = await Promise.all([
    db.product.findMany({
      where: { inComparison: true, parentId: null, listed: true, ...published() },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      select: { id: true, slug: true, name: true, status: true },
    }),
    db.comparisonRow.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }], include: { cells: { select: { productId: true, value: true } } } }),
  ]);
  return {
    products,
    // A row with no value for any shown product would be an empty line.
    rows: rows
      .map((r) => ({ id: r.id, label: r.label, values: Object.fromEntries(r.cells.map((c) => [c.productId, c.value])) as Record<string, string> }))
      .filter((r) => products.some((p) => r.values[p.id])),
  };
}

/** Products used in a /solutions page (Product.solutions). */
export async function getSolutionProducts(solution: string) {
  "use cache";
  cacheLife(lifeUntil(await nextPublishAt("product"), "days"));
  cacheTag(PRODUCTS_TAG);
  return db.product.findMany({
    where: { solutions: { has: solution }, listed: true, ...published() },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: { id: true, slug: true, name: true, tagline: true, icon: true, logo: { select: { url: true } }, parent: { select: { slug: true } } },
  });
}
