import Link from "next/link";
import type { ReactNode } from "react";
import { buttonClass } from "@/components/ui/form";
import { ArrowRight } from "./icons";

/** Popular destinations offered on the 404 and error pages. */
const SUGGESTIONS = [
  { href: "/products", label: "Бүтээгдэхүүн", text: "MACS ERP, POS болон бусад систем" },
  { href: "/support", label: "Тусламж", text: "Заавар, татах файл, түгээмэл асуулт" },
  { href: "/news", label: "Мэдээ", text: "Шинэчлэл, зөвлөгөө" },
  { href: "/contact", label: "Холбоо барих", text: "Демо, үнийн санал, дэмжлэг" },
];

/** Full-width status message (404 / error) in the site's style. Has no hooks, so error boundaries can use it too. */
export function StatusPage({ code, title, children, actions }: { code: string; title: string; children: ReactNode; actions?: ReactNode }) {
  return (
    <main className="relative overflow-hidden" id="main">
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[760px] -translate-x-1/2 rounded-full bg-brand/10 blur-3xl" />
      <div className="relative mx-auto w-full max-w-3xl px-4 pt-16 pb-20 text-center sm:px-6 sm:pt-24 lg:px-8">
        <p className="font-display text-sm font-bold tracking-[0.2em] text-brand uppercase">{code}</p>
        <h1 className="mt-4 font-display text-3xl font-extrabold text-balance text-fg sm:text-5xl">{title}</h1>
        <div className="mx-auto mt-5 max-w-xl text-base text-pretty text-fg-muted sm:text-lg">{children}</div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {actions ?? (
            <>
              <Link className={buttonClass()} href="/">
                Нүүр хуудас
              </Link>
              <Link className={buttonClass("secondary")} href="/contact">
                Бидэнтэй холбогдох
              </Link>
            </>
          )}
        </div>
        <ul className="mt-14 grid gap-3 text-left sm:grid-cols-2">
          {SUGGESTIONS.map((s) => (
            <li key={s.href}>
              <Link className="group flex items-center justify-between gap-4 rounded-2xl border border-line bg-card p-4 transition-colors hover:border-brand/50" href={s.href}>
                <span>
                  <span className="block font-semibold text-fg group-hover:text-brand">{s.label}</span>
                  <span className="block text-sm text-fg-subtle">{s.text}</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-fg-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-brand" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

export const NOT_FOUND_TITLE = "Хуудас олдсонгүй";

export function NotFoundContent() {
  return (
    <StatusPage code="404" title={NOT_FOUND_TITLE}>
      Таны хайсан хуудас устсан, нэр нь өөрчлөгдсөн эсвэл хаяг буруу байж магадгүй. Доорх холбоосуудаас эхлээрэй.
    </StatusPage>
  );
}
