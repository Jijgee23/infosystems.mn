/**
 * Loads product pages written from the products' own websites (prisma/data/site-products.json:
 * pharmo.mn, carservice.mn, timetry.macs.mn, macs.mn) into products / product_blocks.
 *
 *   npm run db:site-products
 *
 * Entries with `mode: "replace"` create the product or update it in place (same id, so its
 * customers and issues stay) and replace its blocks. `mode: "append"` only adds the blocks
 * whose heading the product doesn't have yet, before its trailing link lists. Safe to re-run.
 */
import { readFileSync } from "node:fs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, type ProductBlockKind, type ProductGroup, type ProductStatus } from "../lib/generated/prisma/client";

process.loadEnvFile?.(".env");

type Item = { title: string; body?: string | null; href?: string | null };
type Block = { kind: ProductBlockKind; heading?: string | null; style?: string | null; body?: string | null; columns?: number; items?: Item[] };
type Entry =
  | {
      slug: string;
      mode: "replace";
      name: string;
      title: string;
      tagline: string;
      badge: string | null;
      icon: string;
      status: ProductStatus;
      group: ProductGroup;
      sortOrder: number;
      solutions: string[];
      blocks: Block[];
    }
  | { slug: string; mode: "append"; blocks: Block[] };

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATA_BASE_URL!, options: "-c TimeZone=UTC" }),
});

/** A block's heading, or the <h3> a text block opens with. */
const headingOf = (b: { heading?: string | null; body?: string | null }) =>
  b.heading ?? /^<h3>(.*?)<\/h3>/.exec(b.body ?? "")?.[1] ?? null;

function blockData(productId: string, b: Block, sortOrder: number) {
  return {
    productId,
    kind: b.kind,
    heading: b.heading ?? null,
    style: b.style ?? null,
    body: b.body ?? null,
    columns: b.columns ?? 1,
    sortOrder,
    items: { create: (b.items ?? []).map((it, j) => ({ title: it.title, body: it.body ?? null, href: it.href ?? null, sortOrder: j })) },
  };
}

async function replace(e: Extract<Entry, { mode: "replace" }>) {
  const data = {
    name: e.name,
    title: e.title,
    tagline: e.tagline,
    badge: e.badge,
    icon: e.icon,
    status: e.status,
    group: e.group,
    sortOrder: e.sortOrder,
    solutions: e.solutions,
    listed: true,
    // The design shows the product icon; an old Strapi stock photo (kept in files) is unlinked.
    imageId: null,
  };
  const existing = await prisma.product.findUnique({ where: { slug: e.slug } });
  const product = existing
    ? await prisma.product.update({ where: { id: existing.id }, data: { ...data, publishedAt: existing.publishedAt ?? new Date() } })
    : await prisma.product.create({ data: { ...data, slug: e.slug, category: "Бүтээгдэхүүн", publishedAt: new Date() } });
  await prisma.$transaction([
    prisma.productBlock.deleteMany({ where: { productId: product.id } }),
    ...e.blocks.map((b, i) => prisma.productBlock.create({ data: blockData(product.id, b, i) })),
  ]);
  console.log(`${existing ? "updated" : "created"} ${e.slug} (${e.blocks.length} blocks)`);
}

async function append(e: Extract<Entry, { mode: "append" }>) {
  const product = await prisma.product.findUnique({ where: { slug: e.slug }, include: { blocks: { orderBy: { sortOrder: "asc" } } } });
  if (!product) return console.log(`skipped ${e.slug}: no such product`);
  const have = new Set(product.blocks.map(headingOf).filter(Boolean));
  const add = e.blocks.filter((b) => !have.has(headingOf(b)));
  if (!add.length) return console.log(`kept ${e.slug} (already has these sections)`);

  // New sections go before the link lists at the end of the page (e.g. «Холбогдох заавар»).
  let at = product.blocks.length;
  while (at > 0 && product.blocks[at - 1].kind === "links") at--;
  const tail = product.blocks.slice(at);
  await prisma.$transaction([
    ...add.map((b, i) => prisma.productBlock.create({ data: blockData(product.id, b, at + i) })),
    ...tail.map((b, i) => prisma.productBlock.update({ where: { id: b.id }, data: { sortOrder: at + add.length + i } })),
  ]);
  console.log(`appended ${add.length} section(s) to ${e.slug}: ${add.map(headingOf).join(", ")}`);
}

async function main() {
  const entries: Entry[] = JSON.parse(readFileSync("prisma/data/site-products.json", "utf8"));
  for (const e of entries) await (e.mode === "replace" ? replace(e) : append(e));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
