import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma/client";

/**
 * Postgres connection options for every Prisma client (app and scripts).
 * The session must run in UTC: the pg adapter sends timestamps without an offset, so on
 * a server whose TimeZone is e.g. Asia/Ulaanbaatar they would be stored 8 hours early.
 */
export const pgOptions = (connectionString: string | undefined) => ({
  connectionString,
  options: "-c TimeZone=UTC",
});

const globalForPrisma = globalThis as unknown as {
  prisma?: { client: PrismaClient; ctor: typeof PrismaClient };
};

function createClient() {
  if (!process.env.DATA_BASE_URL)
    console.warn("[db] DATA_BASE_URL is not set; queries will fail");
  // The pg pool connects lazily, so importing this module never needs a live DB.
  return new PrismaClient({
    adapter: new PrismaPg(pgOptions(process.env.DATA_BASE_URL)),
  });
}

// Reuse one client across dev hot reloads, but replace it after `prisma generate`
// (a regenerated client is a new class; the old instance lacks the new models).
const cached = globalForPrisma.prisma;
const fresh = cached?.ctor === PrismaClient;
// Drop a stale client (older shapes stored the client itself on globalThis).
if (cached && !fresh)
  void ((cached.client ?? cached) as Partial<PrismaClient>).$disconnect?.();
export const db = fresh ? cached.client : createClient();
if (process.env.NODE_ENV !== "production")
  globalForPrisma.prisma = { client: db, ctor: PrismaClient };

/** company_register is BIGINT in the DB; every real value fits in a JS number. */
export const toNum = (v: bigint | null | undefined) =>
  v === null || v === undefined ? null : Number(v);
