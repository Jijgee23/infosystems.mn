/**
 * Moves issue attachments and project-issue screenshots out of the public upload dir into
 * PRIVATE_UPLOAD_DIR, and points their rows at /files/<id> (served with an access check).
 * Files that are also used publicly (post image, logo, ...) are left where they are.
 * Safe to run more than once; run it after every `db:import`.
 *
 *   npm run db:privatize            # dry run: lists what would move
 *   npm run db:privatize -- --apply
 */
import fs from "node:fs/promises";
import path from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";

process.loadEnvFile?.(".env");

const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR ?? "storage/uploads");
const PRIVATE_DIR = path.resolve(process.env.PRIVATE_UPLOAD_DIR ?? "storage/private");

async function main() {
  const apply = process.argv.includes("--apply");
  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATA_BASE_URL!, options: "-c TimeZone=UTC" }),
  });

  const files = await prisma.file.findMany({
    where: {
      isPrivate: false,
      OR: [{ issueAttachments: { some: {} } }, { coreIssueFiles: { some: {} } }],
      // Only files nothing public refers to.
      posts: { none: {} },
      products: { none: {} },
      productLogos: { none: {} },
      productBgs: { none: {} },
      testimonials: { none: {} },
      clientLogos: { none: {} },
      caseCovers: { none: {} },
      caseLogos: { none: {} },
      employees: { none: {} },
      awards: { none: {} },
    },
  });

  await fs.mkdir(PRIVATE_DIR, { recursive: true });
  let moved = 0;
  let missing = 0;
  for (const f of files) {
    const name = f.hash + (f.ext ?? "");
    const from = path.join(UPLOAD_DIR, name);
    const exists = await fs.stat(from).then(() => true, () => false);
    if (!exists) missing++;
    console.log(`${exists ? "move" : "missing on disk"}  ${name}`);
    if (!apply) continue;
    if (exists) {
      await fs.copyFile(from, path.join(PRIVATE_DIR, name));
      // Strapi's resized copies (large_, small_, ...) are public too.
      for (const prefix of ["large_", "medium_", "small_", "thumbnail_"]) await fs.rm(path.join(UPLOAD_DIR, prefix + name), { force: true });
    }
    await prisma.file.update({ where: { id: f.id }, data: { isPrivate: true, url: `/files/${f.id}` } });
    if (exists) await fs.rm(from);
    moved++;
  }
  console.log(`\n${files.length} file(s), ${missing} missing on disk.${apply ? ` Moved ${moved}.` : " Dry run; pass --apply to move them."}`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
