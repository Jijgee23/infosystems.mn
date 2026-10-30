import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { iso } from "@/lib/legacy";
import { toDateInput } from "@/lib/time";

// Codes used by the desktop apps (see InsertNotification in prisma/schema.prisma).
const MACS_VERSION_ALL = 0;
const APP_ALL = 0;
const SEND_TO_ALL = 0;
const SEND_TO_CUSTOM = 1;

/**
 * GET /api/news-check?registerno=&macsversion=&apptype=
 * Port of the Strapi `newsCheck.index` controller: returns the last active, unexpired
 * notification matching the app's MACS version, app type and customer register number.
 */
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams;
  const registerno = q.get("registerno") ?? "";
  const macsversion = q.get("macsversion");
  const apptype = q.get("apptype") ?? "0";

  const rows = await db.insertNotification.findMany({
    where: { expireDate: { gt: new Date() }, isActive: 1 },
    orderBy: { seq: "asc" },
  });

  // Loose (==) comparisons on purpose: the old controller compared numbers to query strings.
  // Custom lists match whole register numbers only. The old String.indexOf check let an empty
  // or partial registerno match every list, which leaked other customers' notices.
  const forCustomer = (list: string | null) =>
    !!registerno && (list ?? "").split(/[\s,;]+/).some((r) => r.trim() === registerno.trim());
  const match = rows.findLast(
    (r) =>
      (r.macsversion === MACS_VERSION_ALL || String(r.macsversion) === macsversion) &&
      (r.apptype === APP_ALL || String(r.apptype) === apptype) &&
      (r.toCustomer === SEND_TO_ALL || (r.toCustomer === SEND_TO_CUSTOM && forCustomer(r.customerId))),
  );

  if (!match) return Response.json({ success: false, found: 0 });

  return Response.json({
    success: true,
    found: 1,
    id: match.seq,
    description: match.description,
    macsversion: match.macsversion,
    apptype: match.apptype,
    to_customer: match.toCustomer,
    expire_date: toDateInput(match.expireDate) || null,
    acount: match.acount,
    filetype: match.filetype,
    news_text: match.newsText,
    pdf_file: match.pdfFile,
    is_active: match.isActive,
    // Never echo the full recipient list: it holds other customers' register numbers.
    customer_id: match.toCustomer === SEND_TO_CUSTOM ? registerno : match.customerId,
    published_at: iso(match.publishedAt),
    created_at: iso(match.createdAt),
    updated_at: iso(match.updatedAt),
    file_url: match.fileUrl,
  });
}
