"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { logout } from "@/lib/actions/auth";
import { ChevronDown } from "./icons";

export type AccountUser = { name: string; email: string; initials: string };

const ITEM = "flex w-full items-center rounded-xl px-3 py-2 text-left text-sm font-medium text-fg-muted transition-colors hover:bg-surface hover:text-fg";

/** Signed-in customer in the site header: avatar + name, opening a small account menu. */
export function AccountMenu({ user }: { user: AccountUser }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        aria-controls={menuId}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Миний бүртгэл: ${user.name}`}
        className="inline-flex h-10 items-center gap-2 rounded-full py-1 pr-2 pl-1 text-sm font-medium text-fg transition-colors hover:bg-surface"
        onClick={() => setOpen((o) => !o)}
        type="button"
      >
        <span aria-hidden="true" className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand text-xs font-bold text-white dark:text-ink">
          {user.initials}
        </span>
        <span className="hidden max-w-[9rem] truncate xl:inline">{user.name}</span>
        <ChevronDown className={`h-4 w-4 text-fg-subtle transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-line bg-card p-2 shadow-xl shadow-ink/10" id={menuId} role="menu">
          <div className="border-b border-line px-3 pt-1 pb-3">
            <p className="truncate font-semibold text-fg">{user.name}</p>
            <p className="truncate text-xs text-fg-subtle">{user.email}</p>
          </div>
          <div className="pt-2">
            <Link className={ITEM} href="/portal" onClick={() => setOpen(false)} role="menuitem">
              Миний булан
            </Link>
            <Link className={ITEM} href="/portal/issues/new" onClick={() => setOpen(false)} role="menuitem">
              Асуудал илгээх
            </Link>
            <form action={logout}>
              <button className={`${ITEM} text-red-600 hover:text-red-700 dark:text-red-400`} role="menuitem" type="submit">
                Гарах
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
