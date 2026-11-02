/**
 * Converts the existing client logos («Харилцагчийн лого») to the standard 600×300 PNG that
 * new uploads get (lib/logo-image.ts): margins trimmed, logo fitted and centered.
 *
 * Each logo gets a NEW file; the client_logos row is pointed at it and the original file is
 * left in place (row and disk), so nothing is lost. Logos already in the standard size are
 * skipped, so it is safe to run more than once.
 *
 *   npm run db:logos             # dry run: lists what would change
 *   npm run db:logos -- --apply  # writes the new files and updates the rows
 */
import { randomBytes } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { createId } from "@paralleldrive/cuid2";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";
import { isNormalizedLogo, LOGO_HEIGHT, LOGO_WIDTH, normalizeLogo } from "../lib/logo-image";

process.loadEnvFile?.(".env");

const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR ?? "storage/uploads");
const PRIVATE_DIR = path.resolve(process.env.PRIVATE_UPLOAD_DIR ?? "storage/private");
const apply = process.argv.includes("--apply");

async function main() {
  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATA_BASE_URL!, options: "-c TimeZone=UTC" }),
  });
  const logos = await prisma.clientLogo.findMany({ include: { logo: true }, orderBy: { sortOrder: "asc" } });
  let done = 0;
  let skipped = 0;
  for (const c of logos) {
    const f = c.logo;
    if (isNormalizedLogo(f)) {
      skipped++;
      continue;
    }
    const src = path.join(f.isPrivate ? PRIVATE_DIR : UPLOAD_DIR, f.hash + (f.ext ?? ""));
    try {
      const png = await normalizeLogo(await fs.readFile(src));
      const label = `${c.name} (${f.width ?? "?"}×${f.height ?? "?"} ${f.mime})`;
      if (!apply) {
        console.log(`would convert: ${label}`);
        done++;
        continue;
      }
      const base = path.basename(f.hash).replace(/_[0-9a-f]{10}$/, "").slice(0, 50) || "logo";
      const hash = `${base}_logo_${randomBytes(5).toString("hex")}`;
      const dest = path.join(UPLOAD_DIR, `${hash}.png`);
      await fs.writeFile(dest, png);
      const id = createId();
      await prisma.$transaction([
        prisma.file.create({
          data: {
            id,
            name: `${(f.name ?? base).replace(/\.[^.]+$/, "")}.png`.slice(0, 255),
            hash,
            ext: ".png",
            mime: "image/png",
            sizeKb: Math.max(1, Math.round(png.length / 1024)),
            width: LOGO_WIDTH,
            height: LOGO_HEIGHT,
            isPrivate: false,
            url: `/uploads/${hash}.png`,
          },
        }),
        prisma.clientLogo.update({ where: { id: c.id }, data: { logoId: id } }),
      ]);
      console.log(`converted: ${label} → ${hash}.png`);
      done++;
    } catch (e) {
      console.warn(`skip ${c.name}: ${(e as Error).message}`);
    }
  }
  console.log(`${done} logo(s) ${apply ? "converted" : "to convert"}, ${skipped} already standard, ${logos.length} total.${apply ? "" : " Run with --apply to write."}`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
