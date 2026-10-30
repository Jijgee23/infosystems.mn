import Link from "next/link";
import { ArrowRight } from "@/components/site/icons";
import { getProductNav } from "@/lib/data/products";
import { ProductMark } from "@/lib/product-icons";

const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </svg>
  );
}

/** Columns for the «Бусад систем» row: a count that fills whole rows where possible. */
const OTHER_COLS: Record<number, string> = { 1: "lg:grid-cols-1", 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4", 5: "lg:grid-cols-5" };
const otherCols = (n: number) => OTHER_COLS[n <= 5 ? n : n % 5 === 0 ? 5 : n % 4 === 0 ? 4 : n % 3 === 0 ? 3 : 5];

/**
 * «Бүтээгдэхүүн» on the home page, from the products in admin: the main product (with its
 * modules) beside the featured cards, then the other systems.
 */
export async function HomeProducts() {
  const nav = await getProductNav();
  const main = nav.find((p) => p.group === "main");
  const featured = nav.filter((p) => p.group === "featured");
  const other = nav.filter((p) => p.group === "other");
  const markBox = (logoUrl: string | null, fallback: string) => (logoUrl ? "border border-line bg-white p-1.5" : fallback);

  return (
    <>
      {(main || featured.length > 0) && (
        <div className={cn("mt-10 grid gap-4", main && featured.length > 0 && "lg:grid-cols-12", main && featured.length > 1 && "lg:grid-rows-2")}>
          {main && (
            <div className={cn("reveal", featured.length > 0 && "lg:col-span-7", featured.length > 1 && "lg:row-span-2")} style={{ "--reveal-delay": "0ms" }}>
              <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-brand/25 bg-gradient-to-br from-brand-soft via-card to-card p-7 sm:p-9">
                <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-brand/10 blur-2xl" />
                <div className="relative flex items-center gap-3">
                  <span className={cn("inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl", markBox(main.logoUrl, "bg-brand text-white dark:text-ink"))}>
                    <ProductMark className="h-6 w-6" icon={main.icon} logoUrl={main.logoUrl} />
                  </span>
                  {main.badge && <span className="rounded-full bg-card px-3 py-1 text-xs font-semibold text-brand ring-1 ring-brand/20">{main.badge}</span>}
                </div>
                <h3 className="relative mt-6 text-3xl font-extrabold text-fg sm:text-4xl">{main.name}</h3>
                {main.tagline && <p className="relative mt-3 max-w-lg text-lg leading-relaxed text-fg-muted">{main.tagline}</p>}
                {main.modules.length > 0 && (
                  <>
                    <p className="relative mt-8 mb-3 text-xs font-semibold tracking-wider text-fg-subtle uppercase">Модулиуд</p>
                    <ul className="relative grid grid-cols-2 gap-2">
                      {main.modules.map((m) => (
                        <li key={m.slug}>
                          <Link
                            className="group flex h-full items-center justify-between gap-2 rounded-xl border border-line bg-card/80 px-3 py-2.5 text-[13px] leading-tight font-medium text-fg transition-colors hover:border-brand/40 hover:text-brand sm:px-4 sm:py-3 sm:text-sm"
                            href={`/products/${main.slug}/${m.slug}`}
                          >
                            {m.name}
                            <ArrowUpRight className="hidden h-4 w-4 shrink-0 text-fg-subtle transition-colors group-hover:text-brand sm:block" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                <div className="relative mt-auto pt-8">
                  <Link className="inline-flex h-11 items-center gap-2 rounded-full bg-brand px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-strong dark:text-ink" href={`/products/${main.slug}`}>
                    {main.name}-ийн тухай <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}
          {featured.map((p, i) => {
            const soon = p.status === "coming_soon";
            return (
              <div className={cn("reveal", main && "lg:col-span-5")} key={p.id} style={{ "--reveal-delay": `${(i + 1) * 80}ms` }}>
                <Link
                  className={cn(
                    "group flex h-full flex-col rounded-3xl border bg-card p-7 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-ink/5",
                    soon ? "border-dashed border-line" : "border-line hover:border-brand/30",
                  )}
                  href={`/products/${p.slug}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={cn("inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl text-brand", markBox(p.logoUrl, "bg-surface"))}>
                      <ProductMark className="h-5 w-5" icon={p.icon} logoUrl={p.logoUrl} />
                    </span>
                    <h3 className="text-xl font-bold text-fg">{p.name}</h3>
                    {soon ? (
                      <span className="ml-auto rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent-ink">Тун удахгүй</span>
                    ) : (
                      p.badge && <span className="ml-auto rounded-full bg-surface px-2.5 py-1 text-xs font-semibold text-fg-muted">{p.badge}</span>
                    )}
                  </div>
                  {p.tagline && <p className="mt-4 leading-relaxed text-fg-muted">{p.tagline}</p>}
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-brand transition-all group-hover:gap-2.5">
                    {soon ? "Нээлтийн мэдээ авах" : "Дэлгэрэнгүй"} <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </div>
            );
          })}
        </div>
      )}

      {other.length > 0 && (
        <>
          <h3 className="mt-12 mb-4 text-sm font-semibold tracking-wider text-fg-subtle uppercase">Бусад систем</h3>
          <ul className={cn("grid grid-cols-1 gap-3 sm:grid-cols-2", otherCols(other.length))}>
            {other.map((p, i) => (
              <li className="reveal" key={p.id} style={{ "--reveal-delay": `${Math.min(i, 5) * 50}ms` }}>
                <Link className="group flex h-full items-start gap-4 rounded-2xl border border-line bg-card p-4 transition-colors hover:border-brand/40 sm:flex-col sm:gap-0 sm:p-5" href={`/products/${p.slug}`}>
                  <div className="flex shrink-0 items-start justify-between sm:w-full">
                    <span
                      className={cn(
                        "inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl transition-colors",
                        markBox(p.logoUrl, "bg-surface text-fg-muted group-hover:bg-brand-soft group-hover:text-brand"),
                      )}
                    >
                      <ProductMark className="h-[18px] w-[18px]" icon={p.icon} logoUrl={p.logoUrl} />
                    </span>
                    <ArrowUpRight className="hidden h-4 w-4 text-fg-subtle transition-colors group-hover:text-brand sm:block" />
                  </div>
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 font-display font-bold text-fg sm:mt-4">
                      {p.name}
                      {p.status === "coming_soon" && <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-semibold text-accent-ink">Тун удахгүй</span>}
                    </p>
                    {p.tagline && <p className="mt-1 line-clamp-3 text-sm leading-snug text-fg-muted">{p.tagline}</p>}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
