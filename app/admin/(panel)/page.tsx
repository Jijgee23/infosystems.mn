import Link from "next/link";
import type { ReactNode } from "react";
import { fmtDateTime } from "@/components/admin/ui";
import { Badge } from "@/components/ui/form";
import { requireStaff } from "@/lib/auth/session";
import { db } from "@/lib/db";

const KIND: Record<string, string> = { demo: "Демо", quote: "Үнийн санал", feedback: "Санал хүсэлт", notify: "Мэдэгдэл" };

const icon = (paths: string[]) => (
  <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" viewBox="0 0 24 24">
    {paths.map((d) => (
      <path d={d} key={d} />
    ))}
  </svg>
);
const MAIL = icon(["m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7", "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"]);
const CHAT = icon(["M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"]);
const CLOCK = icon(["M12 6v6l4 2", "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"]);
const USER = icon(["M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", "M9 7a4 4 0 1 0 0 .01", "M19 8v6", "M22 11h-6"]);
const ALERT = icon(["M12 9v4", "M12 17h.01", "M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"]);

const TONE = {
  brand: "bg-brand-soft text-brand",
  accent: "bg-accent-soft text-accent-ink",
  warn: "bg-amber-400/15 text-amber-600 dark:text-amber-400",
  violet: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
} as const;

const CARD = "rounded-2xl border border-line/80 bg-card shadow-[0_1px_2px_rgb(16_24_40/0.04)]";

/** Morning / afternoon / evening greeting in Ulaanbaatar time. */
function greeting() {
  const h = Number(new Intl.DateTimeFormat("en-GB", { hour: "numeric", hour12: false, timeZone: "Asia/Ulaanbaatar" }).format(new Date()));
  return h < 12 ? "Өглөөний мэнд" : h < 18 ? "Өдрийн мэнд" : "Оройн мэнд";
}

export default async function AdminHome() {
  const me = await requireStaff();
  const [contacts, issues, openIssues, pendingUsers, coreIssues, recentContacts, recentIssues] = await Promise.all([
    db.contactRequest.count({ where: { seen: false } }),
    db.productIssue.count({ where: { seen: false } }),
    db.productIssue.count({ where: { resolved: false } }),
    db.user.count({ where: { adminConfirmed: false, blocked: false } }),
    db.coreIssue.count({ where: { status: false } }),
    db.contactRequest.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, kind: true, name: true, company: true, seen: true, createdAt: true } }),
    db.productIssue.findMany({
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: { id: true, title: true, seen: true, resolved: true, updatedAt: true, user: { select: { companyName: true, username: true } } },
    }),
  ]);

  const stats: { href: string; label: string; value: number; icon: ReactNode; tone: keyof typeof TONE }[] = [
    { href: "/admin/contacts?filter=new", label: "Шинэ хүсэлт", value: contacts, icon: MAIL, tone: "brand" },
    { href: "/admin/issues?filter=new", label: "Шинэ асуудал", value: issues, icon: CHAT, tone: "accent" },
    { href: "/admin/issues?filter=open", label: "Нээлттэй асуудал", value: openIssues, icon: CLOCK, tone: "warn" },
    { href: "/admin/users?filter=pending", label: "Баталгаажуулах хэрэглэгч", value: pendingUsers, icon: USER, tone: "violet" },
    { href: "/admin/core-issues?filter=open", label: "Төслийн шийдээгүй асуудал", value: coreIssues, icon: ALERT, tone: "rose" },
  ];
  const actions = [
    { href: "/admin/posts/new", label: "Мэдээ бичих" },
    { href: "/admin/guides/new", label: "Заавар нэмэх" },
    { href: "/admin/notifications/new", label: "Програмын мэдэгдэл" },
    { href: "/admin/versions", label: "Хувилбарын тэмдэглэл" },
  ];

  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-fg-subtle">{greeting()},</p>
          <h1 className="font-display text-[1.9rem] leading-tight font-bold tracking-tight text-fg">{me.username}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {actions.map((a) => (
            <Link
              className="rounded-full border border-line bg-card px-3.5 py-1.5 text-sm font-medium text-fg-muted shadow-[0_1px_2px_rgb(16_24_40/0.04)] transition-colors hover:border-brand/40 hover:text-brand"
              href={a.href}
              key={a.href}
            >
              + {a.label}
            </Link>
          ))}
        </div>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map((s) => (
          <li key={s.href}>
            <Link className={`group flex h-full flex-col p-5 transition-all hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-md ${CARD}`} href={s.href}>
              <span className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${TONE[s.tone]}`}>{s.icon}</span>
              <span className="mt-4 font-display text-3xl font-bold text-fg tabular-nums">{s.value}</span>
              <span className="mt-0.5 text-sm text-fg-muted">{s.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className={CARD}>
          <header className="flex items-center justify-between border-b border-line px-5 py-3.5">
            <h2 className="text-sm font-semibold text-fg">Сүүлийн хүсэлтүүд</h2>
            <Link className="text-xs font-semibold text-brand hover:underline" href="/admin/contacts">
              Бүгд →
            </Link>
          </header>
          <ul className="divide-y divide-line">
            {recentContacts.map((c) => (
              <li className="flex items-center gap-3 px-5 py-3" key={c.id}>
                <span className={`h-2 w-2 shrink-0 rounded-full ${c.seen ? "bg-line" : "bg-brand"}`} title={c.seen ? "Үзсэн" : "Шинэ"} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-fg">{c.company || c.name || "—"}</span>
                  <span className="block text-xs text-fg-subtle">{fmtDateTime(c.createdAt)}</span>
                </span>
                <Badge>{KIND[c.kind] ?? c.kind}</Badge>
              </li>
            ))}
            {!recentContacts.length && <li className="px-5 py-6 text-center text-sm text-fg-subtle">Хүсэлт алга.</li>}
          </ul>
        </section>

        <section className={CARD}>
          <header className="flex items-center justify-between border-b border-line px-5 py-3.5">
            <h2 className="text-sm font-semibold text-fg">Харилцагчийн асуудал</h2>
            <Link className="text-xs font-semibold text-brand hover:underline" href="/admin/issues">
              Бүгд →
            </Link>
          </header>
          <ul className="divide-y divide-line">
            {recentIssues.map((i) => (
              <li key={i.id}>
                <Link className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-surface/50" href={`/admin/issues/${i.id}`}>
                  <span className={`h-2 w-2 shrink-0 rounded-full ${i.seen ? "bg-line" : "bg-brand"}`} title={i.seen ? "Үзсэн" : "Шинэ"} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-fg">{i.title}</span>
                    <span className="block truncate text-xs text-fg-subtle">
                      {i.user?.companyName ?? i.user?.username ?? "—"} · {fmtDateTime(i.updatedAt)}
                    </span>
                  </span>
                  {i.resolved ? <Badge tone="accent">Шийдэгдсэн</Badge> : <Badge tone="warn">Нээлттэй</Badge>}
                </Link>
              </li>
            ))}
            {!recentIssues.length && <li className="px-5 py-6 text-center text-sm text-fg-subtle">Асуудал алга.</li>}
          </ul>
        </section>
      </div>
    </>
  );
}
