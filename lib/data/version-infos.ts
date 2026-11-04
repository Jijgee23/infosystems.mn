import "server-only";
import type { Prisma, VersionInfo } from "@/lib/generated/prisma/client";
import { db } from "@/lib/db";
import { iso } from "@/lib/legacy";
import { toDateInput } from "@/lib/time";

// Strapi field name -> Prisma field. The apps' numeric `id` is our `seq`.
const FIELDS = {
  id: "seq",
  changed_date: "changedDate",
  productname: "productname",
  description: "description",
  created_at: "createdAt",
  updated_at: "updatedAt",
  published_at: "publishedAt",
} as const;
type StrapiField = keyof typeof FIELDS;
const OPS = { ne: "not", gt: "gt", gte: "gte", lt: "lt", lte: "lte" } as const;
const DATE_FIELDS = new Set(["changedDate", "createdAt", "updatedAt", "publishedAt"]);

/** A filter value that can't be used (the route answers 400 instead of a database error). */
export class BadQueryError extends Error {}

const MAX_INT = 2_147_483_647;

function coerce(field: string, value: string) {
  if (field === "seq") {
    const n = Number(value);
    if (!Number.isInteger(n) || Math.abs(n) > MAX_INT) throw new BadQueryError(`Invalid id: ${value}`);
    return n;
  }
  if (DATE_FIELDS.has(field)) {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) throw new BadQueryError(`Invalid date: ${value}`);
    return d;
  }
  return value;
}

/** Whole number from a query param, or `fallback` when missing or not a number. */
const intParam = (v: string | null, fallback: number) => {
  const n = Number(v ?? fallback);
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
};

/** Subset of Strapi v3 REST filters: field, field_ne/_gt/_gte/_lt/_lte, _sort, _limit, _start. */
export function strapiQuery(params: URLSearchParams) {
  const where: Prisma.VersionInfoWhereInput[] = [{ publishedAt: { not: null } }];
  for (const [key, value] of params) {
    if (key.startsWith("_")) continue;
    const m = /^(.+?)(?:_(ne|gt|gte|lt|lte))?$/.exec(key)!;
    const field = FIELDS[m[1] as StrapiField];
    if (!field) continue;
    const v = coerce(field, value);
    where.push({ [field]: m[2] ? { [OPS[m[2] as keyof typeof OPS]]: v } : v });
  }
  const orderBy: Prisma.VersionInfoOrderByWithRelationInput[] = (params.get("_sort") ?? "")
    .split(",")
    .filter(Boolean)
    .flatMap((s) => {
      const [f, dir] = s.split(":");
      const field = FIELDS[f as StrapiField];
      return field ? [{ [field]: dir?.toUpperCase() === "DESC" ? "desc" : "asc" }] : [];
    });
  // Strapi's _limit=-1 meant «all»; capped like any other limit so one request can't dump the table.
  const limit = intParam(params.get("_limit"), 100);
  return {
    where: { AND: where },
    orderBy: orderBy.length ? orderBy : [{ seq: "asc" as const }],
    take: limit < 0 ? 1000 : Math.min(limit, 1000),
    skip: Math.max(0, intParam(params.get("_start"), 0)),
  };
}

export function serializeVersionInfo(r: VersionInfo) {
  return {
    id: r.seq,
    changed_date: toDateInput(r.changedDate),
    description: r.description,
    productname: r.productname,
    published_at: iso(r.publishedAt),
    created_at: iso(r.createdAt),
    updated_at: iso(r.updatedAt),
  };
}

export async function findVersionInfos(params: URLSearchParams) {
  return (await db.versionInfo.findMany(strapiQuery(params))).map(serializeVersionInfo);
}

export async function countVersionInfos(params: URLSearchParams) {
  return db.versionInfo.count({ where: strapiQuery(params).where });
}

export async function findVersionInfo(seq: number) {
  const row = await db.versionInfo.findFirst({ where: { seq, publishedAt: { not: null } } });
  return row ? serializeVersionInfo(row) : null;
}
