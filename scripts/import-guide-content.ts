/**
 * Loads the guides (prisma/data/guide-content.json, taken from the hand-written
 * /support/guides pages of the new design) into the guides table.
 *
 *   npm run db:guides            # adds guides whose slug doesn't exist yet
 *   npm run db:guides -- --force # also overwrites guides edited in admin
 */
import { readFileSync } from "node:fs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";

process.loadEnvFile?.(".env");

type Entry = { slug: string; title: string; category: string; sortOrder: number; contentDate: string; body: string };

async function main() {
  const force = process.argv.includes("--force");
  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATA_BASE_URL!, options: "-c TimeZone=UTC" }),
  });
  const entries: Entry[] = JSON.parse(readFileSync("prisma/data/guide-content.json", "utf8"));
  let added = 0;
  let updated = 0;
  for (const g of entries) {
    const data = {
      title: g.title,
      category: g.category,
      sortOrder: g.sortOrder,
      body: g.body,
      contentDate: new Date(`${g.contentDate}T00:00:00Z`),
    };
    const existing = await prisma.guide.findUnique({ where: { slug: g.slug }, select: { id: true } });
    if (!existing) {
      await prisma.guide.create({ data: { ...data, slug: g.slug, publishedAt: new Date() } });
      added++;
    } else if (force) {
      await prisma.guide.update({ where: { id: existing.id }, data });
      updated++;
    }
  }
  console.log(`${added} added, ${updated} overwritten, ${entries.length - added - updated} left as they are.`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
