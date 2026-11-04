import Link from "next/link";
import { Suspense } from "react";
import { logout } from "@/lib/actions/auth";
import { getSessionUser } from "@/lib/auth/session";
import { AccountMenu, type AccountUser } from "./account-menu";

type Variant = "desktop" | "mobile";

const DESKTOP_LINK = "hidden h-10 items-center rounded-full px-3 text-sm font-medium text-fg-muted transition-colors hover:bg-surface hover:text-fg md:inline-flex";
const MOBILE_LINK = "block py-4 font-display text-lg font-semibold text-fg";

/** Up to two initials for the avatar: «Инфо Системс» → «ИС», «Bat» → «B». */
function initials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  return (words.length > 1 ? words[0][0] + words[1][0] : (words[0]?.[0] ?? "?")).toUpperCase();
}

/**
 * Who is signed in, for the site header. Reads the session cookie, so it is only rendered
 * inside <Suspense> (see HeaderAccountSlot): the rest of every page stays static.
 */
async function HeaderAccount({ variant }: { variant: Variant }) {
  const customer = await getSessionUser("customer");
  if (customer) {
    const user: AccountUser = { name: customer.companyName || customer.username, email: customer.email, initials: initials(customer.companyName || customer.username) };
    if (variant === "desktop") return <AccountMenu user={user} />;
    return (
      <li className="py-3">
        <p className="text-xs font-semibold tracking-wider text-fg-subtle uppercase">Нэвтэрсэн</p>
        <p className="mt-1 truncate font-display text-lg font-semibold text-fg">{user.name}</p>
        <div className="mt-3 flex gap-2">
          <Link className="inline-flex h-10 items-center rounded-full border border-line px-4 text-sm font-semibold text-fg" href="/portal">
            Миний булан
          </Link>
          <form action={logout}>
            <button className="inline-flex h-10 items-center rounded-full px-4 text-sm font-semibold text-red-600 dark:text-red-400" type="submit">
              Гарах
            </button>
          </form>
        </div>
      </li>
    );
  }

  // Staff use their own sign-in (/admin/login); show them the way back to the admin.
  const staff = await getSessionUser("staff");
  if (staff)
    return variant === "desktop" ? (
      <Link className={DESKTOP_LINK} href="/admin">
        Админ
      </Link>
    ) : (
      <li>
        <Link className={MOBILE_LINK} href="/admin">
          Админ
        </Link>
      </li>
    );

  return variant === "desktop" ? (
    <Link className={DESKTOP_LINK} href="/portal/login">
      Нэвтрэх
    </Link>
  ) : (
    <li>
      <Link className={MOBILE_LINK} href="/portal/login">
        Нэвтрэх
      </Link>
    </li>
  );
}

/** The header's account slot. Its fallback only reserves the space, so «Нэвтрэх» never flashes for a signed-in visitor. */
export function HeaderAccountSlot({ variant }: { variant: Variant }) {
  return (
    <Suspense fallback={variant === "desktop" ? <span aria-hidden="true" className="hidden h-10 w-24 md:inline-block" /> : <li aria-hidden="true" className="h-[60px]" />}>
      <HeaderAccount variant={variant} />
    </Suspense>
  );
}
