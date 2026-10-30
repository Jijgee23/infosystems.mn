import { cacheLife } from "next/cache";
import type { NextRequest } from "next/server";
import { parse } from "node-html-parser";
import { strapiError } from "@/lib/legacy";

const ORDER = ["USD", "RUB", "CNY", "KRW", "EUR", "JPY", "GBP", "HKD", "TRY", "AUD", "CAD", "THB", "SGD", "NZD", "CHF"];

type Rate = { currency: string; belen_avah: number; belen_zarah: number; belen_bus_avah: number; belen_bus_zarah: number };

/** Listed currencies first in ORDER, the rest after (same as the Strapi controller). */
function sortRates(rates: Rate[]) {
  const rank = (c: string) => (ORDER.includes(c) ? ORDER.indexOf(c) : ORDER.length);
  return rates.sort((a, b) => rank(a.currency) - rank(b.currency));
}

async function mongolBankRates(): Promise<Rate[]> {
  "use cache";
  cacheLife("minutes");
  const res = await fetch(`http://monxansh.appspot.com/xansh.json?currency=${ORDER.join("|")}`);
  if (!res.ok) throw new Error(`monxansh ${res.status}`);
  const rows: { code: string; rate_float: number }[] = await res.json();
  return rows.map((r) => ({ currency: r.code, belen_avah: r.rate_float, belen_zarah: r.rate_float, belen_bus_avah: 0, belen_bus_zarah: 0 }));
}

async function khanBankRates(): Promise<Rate[]> {
  "use cache";
  cacheLife("minutes");
  const res = await fetch("https://www.khanbank.com/mn/home/ratesForSites/");
  if (!res.ok) throw new Error(`khanbank ${res.status}`);
  const rows = parse(await res.text()).querySelector("tbody")?.querySelectorAll("tr") ?? [];
  const num = (s: string | undefined) => parseFloat((s ?? "").trim().replace(/,/g, ""));
  return rows.map((tr) => {
    const c = tr.querySelectorAll("td").map((td) => td.textContent);
    return { currency: (c[0] ?? "").trim(), belen_avah: num(c[1]), belen_zarah: num(c[2]), belen_bus_avah: num(c[3]), belen_bus_zarah: num(c[4]) };
  });
}

/** GET /api/bankrate?bankcode=mongol|khan — exchange rates for the desktop apps. */
export async function GET(req: NextRequest) {
  const bankcode = req.nextUrl.searchParams.get("bankcode");
  try {
    const rates = !bankcode || bankcode === "mongol" ? await mongolBankRates() : await khanBankRates();
    return Response.json(sortRates([...rates]));
  } catch (e) {
    console.error("[bankrate]", e);
    return strapiError(502, "Ханшийн мэдээлэл авах боломжгүй байна");
  }
}
