import "server-only";
import { jwtVerify, SignJWT } from "jose";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { db, toNum } from "@/lib/db";
import type { User, UserRole } from "@/lib/generated/prisma/client";

/**
 * Two separate sign-ins: customers use /portal/login, staff (admin, employee) use
 * /admin/login. Each has its own cookie, and a token is only accepted in its own realm.
 */
export type Realm = "customer" | "staff";
export const SESSION_COOKIES = { customer: "is_session", staff: "is_admin_session" } as const;
const MAX_AGE: Record<Realm, number> = { customer: 60 * 60 * 24 * 14, staff: 60 * 60 * 12 };
export const LOGIN_PATH: Record<Realm, string> = { customer: "/portal/login", staff: "/admin/login" };

export type Role = UserRole;
export type SessionUser = Pick<User, "id" | "email" | "username" | "companyName" | "role" | "customerType" | "personalRegister"> & { companyRegister: number | null };

export const isStaffRole = (role: Role) => role === "admin" || role === "employee";
export const isStaff = (u: SessionUser | null) => !!u && isStaffRole(u.role);
export const realmOf = (role: Role): Realm => (isStaffRole(role) ? "staff" : "customer");

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 32) throw new Error("AUTH_SECRET must be set (32+ characters)");
  return new TextEncoder().encode(s);
}

export async function createSession(userId: string, realm: Realm) {
  const token = await new SignJWT({ scope: `session:${realm}` })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(userId))
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE[realm]}s`)
    .sign(secret());
  (await cookies()).set(SESSION_COOKIES[realm], token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE[realm],
  });
}

export async function destroySession(realm: Realm) {
  (await cookies()).delete(SESSION_COOKIES[realm]);
}

/**
 * Reads a cookie from the request's Cookie header.
 * We avoid `cookies()` for reads: in `next dev` (16.4) calling it while a server action
 * re-renders the layout throws "Received an underlying cookies object that does not match
 * either `cookies` or `mutableCookies`". Session cookies are only written by login/logout,
 * which always redirect, so the incoming header is always current.
 */
async function readCookie(name: string) {
  const header = (await headers()).get("cookie") ?? "";
  for (const part of header.split(";")) {
    const i = part.indexOf("=");
    if (i > 0 && part.slice(0, i).trim() === name) {
      const raw = part.slice(i + 1).trim();
      try {
        return decodeURIComponent(raw);
      } catch {
        return raw;
      }
    }
  }
  return undefined;
}

async function userIdFromCookie(realm: Realm) {
  const token = await readCookie(SESSION_COOKIES[realm]);
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret(), { algorithms: ["HS256"] });
    if (payload.scope !== `session:${realm}` || !payload.sub) return null;
    return { id: String(payload.sub), iat: payload.iat ?? 0 };
  } catch {
    return null;
  }
}

/** Signed-in user for a realm, re-checked against the DB once per request. */
export const getSessionUser = cache(async (realm: Realm = "customer"): Promise<SessionUser | null> => {
  const s = await userIdFromCookie(realm);
  if (!s) return null;
  const u = await db.user.findUnique({ where: { id: s.id } });
  if (!u || u.blocked || !u.adminConfirmed) return null;
  // The role must still match the realm (e.g. a demoted employee loses admin access).
  if (realmOf(u.role) !== realm) return null;
  // Sessions issued before the user's last password change are no longer valid.
  if (u.passwordChangedAt && s.iat * 1000 < u.passwordChangedAt.getTime() - 1000) return null;
  return { id: u.id, email: u.email, username: u.username, companyName: u.companyName, companyRegister: toNum(u.companyRegister), customerType: u.customerType, personalRegister: u.personalRegister, role: u.role };
});

export async function requireUser(next = "/portal") {
  const u = await getSessionUser("customer");
  if (!u) redirect(`${LOGIN_PATH.customer}?next=${encodeURIComponent(next)}`);
  return u;
}

export async function requireStaff(opts: { admin?: boolean } = {}) {
  const u = await getSessionUser("staff");
  if (!u) redirect(LOGIN_PATH.staff);
  if (opts.admin && u.role !== "admin") redirect("/admin");
  return u;
}
