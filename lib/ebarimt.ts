import "server-only";
import { cacheLife } from "next/cache";
import { COMPANY_REGISTER, PERSONAL_REGISTER } from "@/lib/register-number";

/**
 * Taxpayer lookup by register number on api.ebarimt.mn (public tax-office data), for both
 * organisations (1234567) and citizens (УБ12345678), in two steps:
 *   1) /api/info/check/getTinInfo?regNo=…       → taxpayer number (TIN)
 *   2) /api/info/check/getInfo?tin=…            → name, VAT payer, …
 * Same approach as carcare.mn. Override the host with EBARIMT_BASE_URL.
 */
export type Taxpayer = { found: boolean; name: string | null; vatPayer: boolean | null; isGovernment: boolean | null };

const NOT_FOUND: Taxpayer = { found: false, name: null, vatPayer: null, isGovernment: null };

async function getData(path: string): Promise<unknown> {
  const res = await fetch(`${process.env.EBARIMT_BASE_URL ?? "https://api.ebarimt.mn"}${path}`, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(5000),
  });
  // ebarimt answers "not found" with HTTP 200/500 and `data: null`, so only a non-JSON reply is an outage.
  const body = (await res.json()) as { data?: unknown };
  return body?.data ?? null;
}

/** Throws when ebarimt is unreachable (not cached); an unknown number is a cached `found: false`. */
export async function lookupTaxpayer(regno: string): Promise<Taxpayer> {
  "use cache";
  cacheLife("days");
  if (!COMPANY_REGISTER.test(regno) && !PERSONAL_REGISTER.test(regno)) return NOT_FOUND;

  const tin = await getData(`/api/info/check/getTinInfo?regNo=${encodeURIComponent(regno)}`);
  if (typeof tin !== "string" && typeof tin !== "number") return NOT_FOUND;

  const info = await getData(`/api/info/check/getInfo?tin=${encodeURIComponent(String(tin))}`);
  if (!info || typeof info !== "object") return NOT_FOUND;
  const i = info as Record<string, unknown>;
  const name = typeof i.name === "string" ? i.name.trim() : "";
  if (!name || i.found === false) return NOT_FOUND;
  return {
    found: true,
    name,
    vatPayer: typeof i.vatPayer === "boolean" ? i.vatPayer : null,
    isGovernment: typeof i.isGovernment === "boolean" ? i.isGovernment : null,
  };
}
