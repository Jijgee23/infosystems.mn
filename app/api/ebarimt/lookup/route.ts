import type { NextRequest } from "next/server";
import { lookupTaxpayer } from "@/lib/ebarimt";
import { isRateLimited } from "@/lib/rate-limit";
import { COMPANY_REGISTER, normalizePersonalRegister, PERSONAL_REGISTER } from "@/lib/register-number";

/**
 * GET /api/ebarimt/lookup?regno=1234567|УБ12345678 → { found, name, vatPayer, isGovernment }
 * Public: used by the sign-up form to fill in the company or person name. Only returns
 * public tax-office data, and is throttled per IP so it can't be used to hammer ebarimt
 * or to harvest citizens' names (personal numbers get a tighter limit).
 */
export async function GET(req: NextRequest) {
  if (await isRateLimited("ebarimt", 20, 60_000))
    return Response.json({ error: "Хэт олон хүсэлт илгээлээ. Түр хүлээгээд дахин оролдоно уу." }, { status: 429 });

  const regno = normalizePersonalRegister(req.nextUrl.searchParams.get("regno") ?? "");
  const personal = PERSONAL_REGISTER.test(regno);
  if (!personal && !COMPANY_REGISTER.test(regno))
    return Response.json({ error: "Регистрийн дугаар буруу байна (1234567 эсвэл УБ12345678)." }, { status: 400 });
  if (personal && (await isRateLimited("ebarimt-person", 15, 10 * 60_000)))
    return Response.json({ error: "Хэт олон хүсэлт илгээлээ. Нэрээ гараар оруулна уу." }, { status: 429 });

  try {
    return Response.json(await lookupTaxpayer(regno));
  } catch (e) {
    console.error("ebarimt lookup failed", e);
    return Response.json({ error: "Татварын системээс мэдээлэл авч чадсангүй. Нэрийг гараар оруулна уу." }, { status: 502 });
  }
}
