/**
 * Fills files.width / files.height for images that have none (uploads from before sizes were
 * recorded, Strapi rows without them). Only reads the files; safe to run more than once.
 *
 *   npm run db:image-sizes
 */
import path from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import sharp from "sharp";
import { PrismaClient } from "../lib/generated/prisma/client";

process.loadEnvFile?.(".env");

const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR ?? "storage/uploads");
const PRIVATE_DIR = path.resolve(process.env.PRIVATE_UPLOAD_DIR ?? "storage/private");

async function main() {
  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATA_BASE_URL!, options: "-c TimeZone=UTC" }),
  });
  const files = await prisma.file.findMany({
    where: { mime: { startsWith: "image/" }, NOT: { mime: "image/svg+xml" }, OR: [{ width: null }, { height: null }] },
    select: { id: true, hash: true, ext: true, isPrivate: true },
  });
  let done = 0;
  for (const f of files) {
    const file = path.join(f.isPrivate ? PRIVATE_DIR : UPLOAD_DIR, f.hash + (f.ext ?? ""));
    try {
      const m = await sharp(file).metadata();
      const rotated = (m.orientation ?? 1) >= 5;
      await prisma.file.update({ where: { id: f.id }, data: { width: rotated ? m.height : m.width, height: rotated ? m.width : m.height } });
      done++;
    } catch (e) {
      console.warn(`skip ${path.basename(file)}: ${(e as Error).message}`);
    }
  }
  console.log(`${done} of ${files.length} image(s) updated.`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
