import "server-only";
import { jwtVerify, SignJWT } from "jose";

/**
 * Helpers for the endpoints the MACS / POS desktop apps call. They keep the
 * Strapi v3 request and response shapes so the installed apps need no update.
 */

export function strapiError(status: number, message: string, data: unknown = null) {
  const error = status === 400 ? "Bad Request" : status === 404 ? "Not Found" : status === 401 ? "Unauthorized" : "Error";
  return Response.json({ statusCode: status, error, message, data }, { status });
}

/** Postgres `date` column (YYYY-MM-DD string) and timestamps as Strapi serialised them. */
export const iso = (d: Date | null) => (d ? d.toISOString() : null);

function licenseSecret() {
  const s = process.env.LICENSE_JWT_SECRET ?? process.env.AUTH_SECRET;
  if (!s) throw new Error("LICENSE_JWT_SECRET (or AUTH_SECRET) is not set");
  return new TextEncoder().encode(s);
}

/**
 * Token for /checkcustomerlicense only. It carries scope "license" and is never accepted
 * by the customer portal, which uses its own password-checked session.
 */
export async function issueLicenseToken(user: { id: string; companyRegister: number | null }) {
  return new SignJWT({ id: user.id, company_register: user.companyRegister, scope: "license" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(licenseSecret());
}

export async function verifyLicenseToken(token: string) {
  const { payload } = await jwtVerify(token, licenseSecret(), { algorithms: ["HS256"] });
  if (payload.scope !== "license") throw new Error("wrong scope");
  return payload as { id: string; company_register: number | null };
}

/** Reads a JSON or urlencoded body; returns {} when it can't be parsed. */
export async function readBody(req: Request): Promise<Record<string, unknown>> {
  const type = req.headers.get("content-type") ?? "";
  try {
    if (type.includes("application/json")) return (await req.json()) ?? {};
    if (type.includes("form")) return Object.fromEntries(await req.formData());
    const text = await req.text();
    return text ? JSON.parse(text) : {};
  } catch {
    return {};
  }
}
