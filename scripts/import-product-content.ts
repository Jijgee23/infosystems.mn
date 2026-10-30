/**
 * Loads the product page content (prisma/data/product-content.json, taken from the
 * hand-written pages of the new design) into products / product_blocks.
 *
 *   npm run db:products            # fills products that have no blocks yet
 *   npm run db:products -- --force # also replaces blocks (and the image) edited in admin
 *
 * Also renames the old Strapi product "macs" to "macs-erp" (keeping its customers and
 * issues), unlists the old products whose pages moved elsewhere, and turns the Strapi
 * description of every other product into a text block.
 */
import { readFileSync } from "node:fs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, type ProductBlockKind, type ProductGroup, type ProductStatus } from "../lib/generated/prisma/client";

process.loadEnvFile?.(".env");

type Item = { title: string; body?: string | null; href?: string | null };
type Block = { kind: ProductBlockKind; heading?: string | null; style?: string | null; body?: string | null; columns?: number; items?: Item[] };
type Entry = {
  slug: string;
  parent?: string;
  name: string;
  tagline: string | null;
  icon: string | null;
  badge?: string | null;
  status: ProductStatus;
  group: ProductGroup;
  sortOrder: number;
  versionNames?: string[];
  solutions?: string[];
  inComparison?: boolean;
  blocks: Block[];
};

/** Old Strapi products whose content now lives on another page (see lib/product-pages.ts). */
const UNLISTED = ["macs-human-capital", "carservice", "farmacy-pos"];
const RENAMED: Record<string, string> = { macs: "macs-erp" };

const force = process.argv.includes("--force");
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATA_BASE_URL!, options: "-c TimeZone=UTC" }),
});

async function setBlocks(productId: string, blocks: Block[]) {
  await prisma.productBlock.deleteMany({ where: { productId } });
  for (const [i, b] of blocks.entries()) {
    await prisma.productBlock.create({
      data: {
        productId,
        kind: b.kind,
        heading: b.heading ?? null,
        style: b.style ?? null,
        body: b.body ?? null,
        columns: b.columns ?? 1,
        sortOrder: i,
        items: { create: (b.items ?? []).map((it, j) => ({ title: it.title, body: it.body ?? null, href: it.href ?? null, sortOrder: j })) },
      },
    });
  }
}

async function main() {
  const entries: Entry[] = JSON.parse(readFileSync("prisma/data/product-content.json", "utf8"));

  for (const [from, to] of Object.entries(RENAMED)) {
    const old = await prisma.product.findUnique({ where: { slug: from } });
    if (old && !(await prisma.product.findUnique({ where: { slug: to } }))) {
      await prisma.product.update({ where: { id: old.id }, data: { slug: to } });
      console.log(`renamed ${from} → ${to}`);
    }
  }

  const ids = new Map<string, string>();
  // Parents first, so modules can point at them.
  for (const e of [...entries].sort((a, b) => Number(!!a.parent) - Number(!!b.parent))) {
    const parentId = e.parent ? ids.get(e.parent) : null;
    if (e.parent && !parentId) throw new Error(`${e.slug}: parent ${e.parent} missing`);
    const data = {
      name: e.name,
      tagline: e.tagline,
      icon: e.icon,
      badge: e.badge ?? null,
      status: e.status,
      group: e.group,
      sortOrder: e.sortOrder,
      parentId,
      listed: true,
      versionNames: e.versionNames ?? [],
      solutions: e.solutions ?? [],
      inComparison: e.inComparison ?? false,
    };
    const existing = await prisma.product.findUnique({ where: { slug: e.slug }, include: { _count: { select: { blocks: true } } } });
    // A product already filled in (and maybe edited in admin) is left alone unless --force.
    const fill = force || !existing || existing._count.blocks === 0;
    // Only one main product (products_single_main_key).
    if (fill && data.group === "main") await prisma.product.updateMany({ where: { group: "main", slug: { not: e.slug } }, data: { group: "featured" } });
    const product = !existing
      ? await prisma.product.create({ data: { ...data, slug: e.slug, title: e.name, category: "Бүтээгдэхүүн", publishedAt: new Date() } })
      : fill
        ? await prisma.product.update({ where: { id: existing.id }, data: { ...data, publishedAt: existing.publishedAt ?? new Date() } })
        : existing;
    ids.set(e.slug, product.id);
    if (fill) {
      await setBlocks(product.id, e.blocks);
      // The design shows the product icon; the old Strapi stock photo (kept in files) is unlinked.
      if (product.imageId) await prisma.product.update({ where: { id: product.id }, data: { imageId: null } });
    }
    console.log(`${!existing ? "created" : fill ? "updated" : "kept"} ${e.parent ? e.parent + "/" : ""}${e.slug}${fill ? ` (${e.blocks.length} blocks)` : ""}`);
  }

  const unlisted = await prisma.product.updateMany({ where: { slug: { in: UNLISTED } }, data: { listed: false } });
  console.log(`unlisted ${unlisted.count} old products`);

  // Products added in admin or imported from Strapi: their description becomes the page body.
  const rest = await prisma.product.findMany({ where: { slug: { notIn: entries.map((e) => e.slug) }, blocks: { none: {} }, description: { not: null } } });
  for (const p of rest) {
    await setBlocks(p.id, [{ kind: "text", body: p.description }]);
    console.log(`description → text block: ${p.slug}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
