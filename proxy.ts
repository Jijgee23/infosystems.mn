import { NextResponse, type NextRequest } from "next/server";

// Keep in sync with SESSION_COOKIES in lib/auth/session.ts (proxy can't import server-only code).
const CUSTOMER_COOKIE = "is_session";
const STAFF_COOKIE = "is_admin_session";
const PUBLIC_PORTAL = ["/portal/login", "/portal/register", "/portal/forgot-password", "/portal/reset-password"];

/**
 * Optimistic auth redirect: no session cookie for the area -> its login page.
 * The real check (signature, user status, role) happens in requireUser / requireStaff.
 */
export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const staffArea = pathname === "/admin" || pathname.startsWith("/admin/");
  if (staffArea) {
    if (pathname === "/admin/login" || req.cookies.has(STAFF_COOKIE)) return NextResponse.next();
    return redirect(req, `/admin/login?next=${encodeURIComponent(pathname + search)}`);
  }
  if (PUBLIC_PORTAL.some((p) => pathname.startsWith(p)) || req.cookies.has(CUSTOMER_COOKIE)) return NextResponse.next();
  return redirect(req, `/portal/login?next=${encodeURIComponent(pathname + search)}`);
}

function redirect(req: NextRequest, to: string) {
  return NextResponse.redirect(new URL(to, req.url));
}

export const config = { matcher: ["/portal/:path*", "/admin/:path*", "/admin"] };
