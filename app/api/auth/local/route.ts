import { db, toNum } from "@/lib/db";
import { issueLicenseToken, readBody, strapiError } from "@/lib/legacy";
import { isRateLimited } from "@/lib/rate-limit";

/**
 * POST /api/auth/local — compatibility shim for the desktop apps.
 *
 * The old Strapi override issued a JWT for any known company_register or email without
 * checking a password. To keep installed apps working we still do that, but the token is
 * a license-scope token: it is only accepted by /api/checkcustomerlicense and grants no
 * access to the customer portal or any data.
 */
export async function POST(req: Request) {
  // Each installed app asks once per start; this only slows down probing for registered customers.
  if (await isRateLimited("auth-local", 60, 60 * 60_000)) return strapiError(429, "Too many requests");
  const body = await readBody(req);
  const raw = String(body.company_register ?? "").trim();
  const register = /^\d{1,18}$/.test(raw) ? BigInt(raw) : null;
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!register && !email) return strapiError(400, "Энэ байгууллага Infosystems.mn - д бүртгэлгүй байна");

  // Register number first, then email (same order as the old controller).
  const user =
    (register ? await db.user.findUnique({ where: { companyRegister: register } }) : null) ??
    (email ? await db.user.findUnique({ where: { email } }) : null);

  if (!user || user.blocked) {
    // Strapi's ctx.badRequest(null, formatError(...)) shape.
    const detail = [{ messages: [{ message: "Энэ байгууллага Infosystems.mn - д бүртгэлгүй байна" }] }];
    return Response.json({ statusCode: 400, error: "Bad Request", message: detail, data: detail }, { status: 400 });
  }

  return Response.json({ token: await issueLicenseToken({ id: user.id, companyRegister: toNum(user.companyRegister) }) });
}
