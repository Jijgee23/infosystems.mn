"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Logo, Menu, X } from "@/components/site/icons";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { staffLogout } from "@/lib/actions/auth";

type Item = { href: string; label: string; icon: ReactNode; exact?: boolean; badge?: "contacts" | "issues" | "users" };
type Group = { title: string; adminOnly?: boolean; items: Item[] };

const I = ({ d }: { d: string[] }) => (
  <svg aria-hidden="true" className="h-[18px] w-[18px] shrink-0" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" viewBox="0 0 24 24">
    {d.map((p) => (
      <path d={p} key={p} />
    ))}
  </svg>
);

const GROUPS: Group[] = [
  { title: "", items: [{ href: "/admin", label: "Хянах самбар", exact: true, icon: <I d={["M3 13h8V3H3z", "M13 21h8V11h-8z", "M13 3v6h8V3z", "M3 21h8v-6H3z"]} /> }] },
  {
    title: "Харилцагч",
    items: [
      { href: "/admin/contacts", label: "Хүсэлтүүд", badge: "contacts", icon: <I d={["m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7", "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"]} /> },
      { href: "/admin/issues", label: "Харилцагчийн асуудал", badge: "issues", icon: <I d={["M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"]} /> },
      { href: "/admin/core-issues", label: "Төслийн асуудал", icon: <I d={["M12 9v4", "M12 17h.01", "M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"]} /> },
      { href: "/admin/users", label: "Хэрэглэгчид", badge: "users", icon: <I d={["M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", "M9 7a4 4 0 1 0 0 .01", "M22 21v-2a4 4 0 0 0-3-3.87", "M16 3.13a4 4 0 0 1 0 7.75"]} /> },
      { href: "/admin/case-studies", label: "Амжилтын түүх", icon: <I d={["M12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26z"]} /> },
      { href: "/admin/products", label: "Бүтээгдэхүүн", icon: <I d={["m7.5 4.27 9 5.15", "M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z", "M3.3 7 12 12l8.7-5", "M12 22V12"]} /> },
      { href: "/admin/comparison", label: "Харьцуулах хүснэгт", icon: <I d={["M3 3h18v18H3z", "M3 9h18", "M9 21V9", "M15 21V9"]} /> },
    ],
  },
  {
    title: "Контент",
    items: [
      { href: "/admin/posts", label: "Мэдээ", icon: <I d={["M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2", "M18 14h-8", "M15 18h-5", "M10 6h8v4h-8z"]} /> },
      { href: "/admin/guides", label: "Заавар", icon: <I d={["M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z", "M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"]} /> },
      { href: "/admin/downloads", label: "Програм татах", icon: <I d={["M12 15V3", "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", "m7 10 5 5 5-5"]} /> },
    ],
  },
  {
    title: "MACS / POS програм",
    items: [
      { href: "/admin/notifications", label: "Програмын мэдэгдэл", icon: <I d={["M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9", "M10.3 21a1.94 1.94 0 0 0 3.4 0"]} /> },
      { href: "/admin/versions", label: "Хувилбарын түүх", icon: <I d={["M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", "M3 3v5h5", "M12 7v5l4 2"]} /> },
    ],
  },
  {
    title: "Байгууллага",
    adminOnly: true,
    items: [
      { href: "/admin/company", label: "Компанийн мэдээлэл", icon: <I d={["M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z", "M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2", "M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2", "M10 6h4", "M10 10h4", "M10 14h4", "M10 18h4"]} /> },
      { href: "/admin/departments", label: "Хэлтэс, албан тушаал", icon: <I d={["M12 3v6", "M5 21v-4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4", "M12 15v6", "M9 3h6v6H9z"]} /> },
      { href: "/admin/employees", label: "Ажилтнууд", icon: <I d={["M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", "M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"]} /> },
      { href: "/admin/milestones", label: "Он цагийн хэлхээс", icon: <I d={["M3 12h18", "M7 8v8", "M12 6v12", "M17 9v6"]} /> },
      { href: "/admin/awards", label: "Шагнал урамшуулал", icon: <I d={["M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12z", "M8.21 13.89 7 23l5-3 5 3-1.21-9.12"]} /> },
      { href: "/admin/testimonials", label: "Хэрэглэгчийн сэтгэгдэл", icon: <I d={["M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z", "M8 9h8", "M8 13h5"]} /> },
      { href: "/admin/clients", label: "Харилцагчийн лого", icon: <I d={["M3 3h7v7H3z", "M14 3h7v7h-7z", "M14 14h7v7h-7z", "M3 14h7v7H3z"]} /> },
    ],
  },
];

export type NavCounts = Partial<Record<NonNullable<Item["badge"]>, number>>;

/** Admin side navigation: fixed sidebar on desktop, slide-in drawer on mobile. */
export function AdminSidebar({ userName, role, counts }: { userName: string; role: "admin" | "employee"; counts: NavCounts }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const groups = GROUPS.filter((g) => role === "admin" || !g.adminOnly);

  const nav = (
    <nav aria-label="Админ цэс" className="flex-1 overflow-y-auto px-3 py-4">
      {groups.map((g) => (
        <div className="mb-5" key={g.title || "main"}>
          {g.title && <p className="mb-1.5 px-3 text-[11px] font-semibold tracking-wider text-fg-subtle uppercase">{g.title}</p>}
          <ul className="space-y-0.5">
            {g.items.map((item) => {
              const active = item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
              const n = item.badge ? counts[item.badge] : 0;
              return (
                <li key={item.href}>
                  <Link
                    aria-current={active ? "page" : undefined}
                    className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-fg-muted transition-colors hover:bg-surface hover:text-fg aria-[current=page]:bg-brand-soft aria-[current=page]:text-brand"
                    href={item.href}
                  >
                    {item.icon}
                    <span className="flex-1 truncate">{item.label}</span>
                    {!!n && <span className="min-w-5 rounded-full bg-brand px-1.5 text-center text-[11px] leading-5 font-bold text-white tabular-nums dark:text-ink">{n > 99 ? "99+" : n}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  const footer = (
    <div className="border-t border-line p-3">
      <div className="flex items-center gap-3 rounded-xl px-2 py-2">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-soft font-display font-bold text-brand">{userName.slice(0, 1).toUpperCase()}</span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-fg">{userName}</span>
          <span className="block text-xs text-fg-subtle">{role === "admin" ? "Админ" : "Ажилтан"}</span>
        </span>
        <ThemeToggle />
      </div>
      <div className="mt-1 flex gap-1">
        <Link className="flex-1 rounded-xl px-3 py-2 text-center text-sm font-medium text-fg-muted hover:bg-surface hover:text-fg" href="/" target="_blank">
          Сайт харах ↗
        </Link>
        <form action={staffLogout} className="flex-1">
          <button className="w-full rounded-xl px-3 py-2 text-sm font-medium text-fg-muted hover:bg-surface hover:text-red-600" type="submit">
            Гарах
          </button>
        </form>
      </div>
    </div>
  );

  const brand = (
    <Link className="flex items-center gap-2.5" href="/admin">
      <Logo />
      <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[11px] font-semibold text-brand">Админ</span>
    </Link>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-line bg-bg lg:flex">
        <div className="flex h-16 items-center border-b border-line px-5">{brand}</div>
        {nav}
        {footer}
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-bg/90 px-4 backdrop-blur-xl lg:hidden">
        {brand}
        <button aria-expanded={open} aria-label="Цэс" className="inline-flex h-10 w-10 items-center justify-center rounded-full text-fg hover:bg-surface" onClick={() => setOpen(true)} type="button">
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* Mobile drawer */}
      <div aria-hidden={!open} className={`fixed inset-0 z-40 lg:hidden ${open ? "" : "pointer-events-none"}`}>
        <div className={`absolute inset-0 bg-ink/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`} onClick={() => setOpen(false)} />
        <aside className={`absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-bg shadow-2xl transition-transform duration-200 ${open ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex h-14 items-center justify-between border-b border-line px-4">
            {brand}
            <button aria-label="Хаах" className="inline-flex h-10 w-10 items-center justify-center rounded-full text-fg hover:bg-surface" onClick={() => setOpen(false)} type="button">
              <X className="h-5 w-5" />
            </button>
          </div>
          {nav}
          {footer}
        </aside>
      </div>
    </>
  );
}
