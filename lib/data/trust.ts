import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib/db";
import { lifeUntil, nextPublishAt } from "./schedule";
import { COMPANY_TAG } from "./company";
import { PRODUCTS_TAG } from "./products";

/** Changes to testimonials, client logos, stats and case studies. */
export const TRUST_TAG = "trust";

const published = () => ({ publishedAt: { not: null, lte: new Date() } });

export type TrustStat = { id: string; value: string; label: string; note: string | null };

/**
 * Placeholders a figure may contain, filled in on every render so it never goes stale:
 * {years} years since founding, {founded} the founding year, {products} / {modules} the
 * products and ERP modules listed on the site.
 */
export const STAT_TOKENS = ["years", "founded", "products", "modules"] as const;
type Tokens = Record<(typeof STAT_TOKENS)[number], string>;

export async function getStatTokens(): Promise<Tokens> {
  const visible = { listed: true, ...published() };
  const [modules, products, settings] = await Promise.all([
    db.product.count({ where: { ...visible, parent: { ...visible } } }),
    db.product.count({ where: { ...visible, parentId: null } }),
    db.companySettings.findFirst({ select: { foundedYear: true } }),
  ]);
  const founded = settings?.foundedYear ?? null;
  return { years: founded ? String(new Date().getFullYear() - founded) : "", founded: founded ? String(founded) : "", products: String(products), modules: String(modules) };
}

const fill = (text: string, t: Tokens) => text.replace(/\{(years|founded|products|modules)\}/g, (_, k: keyof Tokens) => t[k]);

/** The figures with their placeholders filled in. */
export const fillStats = (stats: TrustStat[], t: Tokens) => stats.map((s) => ({ ...s, value: fill(s.value, t), note: s.note && fill(s.note, t) }));

/**
 * Figures the data itself proves, as templates: years since founding, products and ERP
 * modules. Shown while admin has entered none, and offered there to add one by one.
 */
export function autoStatTemplates(t: Tokens): TrustStat[] {
  return [
    ...(t.years && Number(t.years) > 0 ? [{ id: "auto-years", value: "{years}+", label: "жил програм хангамжийн салбарт", note: "{founded} оноос" }] : []),
    { id: "auto-products", value: "{products}", label: "бүтээгдэхүүн, систем", note: null },
    ...(Number(t.modules) > 0 ? [{ id: "auto-modules", value: "{modules}", label: "ERP модуль", note: "нэг системд холбогддог" }] : []),
  ];
}

/**
 * Figures for the trust bar. Admin-entered stats win; with none, counts that come from
 * the data itself are shown, so nothing on the site is a made-up number.
 */
export async function getStats(): Promise<TrustStat[]> {
  "use cache";
  cacheTag(TRUST_TAG, PRODUCTS_TAG, COMPANY_TAG);
  cacheLife(lifeUntil(await nextPublishAt("product"), "days"));
  const [custom, tokens] = await Promise.all([
    db.companyStat.findMany({ where: { isPublic: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }], select: { id: true, value: true, label: true, note: true } }),
    getStatTokens(),
  ]);
  return fillStats(custom.length ? custom : autoStatTemplates(tokens), tokens);
}

export async function getClientLogos() {
  "use cache";
  cacheLife("days");
  cacheTag(TRUST_TAG);
  const rows = await db.clientLogo.findMany({
    where: { isPublic: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: { id: true, name: true, url: true, logo: { select: { url: true, width: true, height: true } } },
  });
  return rows.map(({ logo, ...r }) => ({ ...r, logoUrl: logo.url, width: logo.width, height: logo.height }));
}

/** Public testimonials; with `productId`, only that product's. */
export async function getTestimonials(productId?: string) {
  "use cache";
  cacheLife("days");
  cacheTag(TRUST_TAG);
  const rows = await db.testimonial.findMany({
    where: { isPublic: true, ...(productId ? { productId } : {}) },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    select: { id: true, quote: true, authorName: true, authorTitle: true, companyName: true, photo: { select: { url: true } }, product: { select: { name: true } } },
  });
  return rows.map(({ photo, product, ...t }) => ({ ...t, photoUrl: photo?.url ?? null, productName: product?.name ?? null }));
}

const caseSelect = {
  id: true,
  title: true,
  slug: true,
  clientName: true,
  industry: true,
  summary: true,
  highlights: true,
  cover: { select: { url: true, width: true, height: true } },
  logo: { select: { url: true } },
  products: { select: { slug: true, name: true, parent: { select: { slug: true } } } },
} as const;

/** "value | label" lines → up to three headline results. */
export const parseHighlights = (text: string | null) =>
  (text ?? "")
    .split(/\r?\n/)
    .map((l) => l.split("|").map((x) => x.trim()))
    .filter(([v, l]) => v && l)
    .slice(0, 3)
    .map(([value, label]) => ({ value, label }));

const toCard = <T extends { cover: { url: string; width: number | null; height: number | null } | null; logo: { url: string } | null; highlights: string | null }>({ cover, logo, highlights, ...c }: T) => ({
  ...c,
  coverUrl: cover?.url ?? null,
  coverWidth: cover?.width ?? null,
  coverHeight: cover?.height ?? null,
  logoUrl: logo?.url ?? null,
  highlights: parseHighlights(highlights),
});

/** Published case studies; with `productId`, those that used that product. */
export async function getCaseStudies(productId?: string) {
  "use cache";
  cacheLife(lifeUntil(await nextPublishAt("caseStudy"), "days"));
  cacheTag(TRUST_TAG);
  const rows = await db.caseStudy.findMany({
    where: { ...published(), ...(productId ? { products: { some: { id: productId } } } : {}) },
    orderBy: [{ sortOrder: "asc" }, { publishedAt: "desc" }],
    select: caseSelect,
  });
  return rows.map(toCard);
}

export async function getCaseStudy(slug: string) {
  "use cache";
  cacheLife(lifeUntil(await nextPublishAt("caseStudy"), "days"));
  cacheTag(TRUST_TAG, `case:${slug}`);
  const row = await db.caseStudy.findFirst({ where: { slug, ...published() }, select: { ...caseSelect, body: true, publishedAt: true } });
  return row ? toCard(row) : null;
}
