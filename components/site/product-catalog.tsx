import Link from "next/link";
import { ArrowRight } from "@/components/site/icons";
import { getProductNav } from "@/lib/data/products";
import { ProductMark } from "@/lib/product-icons";

const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

/** The product sections of /products, grouped as set in admin (main / featured / other). */
export async function ProductCatalog() {
  const nav = await getProductNav();
  const main = nav.filter((p) => p.group === "main");
  const featured = nav.filter((p) => p.group === "featured");
  const other = nav.filter((p) => p.group === "other");
  return (
    <>
      {main.map((p) => (
        <section className="py-14 sm:py-16" key={p.id}>
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 rounded-[2rem] border border-brand/20 bg-gradient-to-br from-brand-soft via-card to-card p-7 sm:p-10 lg:grid-cols-12 lg:gap-12">
              <div className={p.modules.length ? "lg:col-span-5" : "lg:col-span-12"}>
                <span className={cn("inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl", p.logoUrl ? "border border-line bg-white p-1.5" : "bg-brand text-white dark:text-ink")}>
                  <ProductMark className="h-6 w-6" icon={p.icon} logoUrl={p.logoUrl} name={p.name} />
                </span>
                {p.badge && <p className="mt-6 text-sm font-semibold text-brand">{p.badge}</p>}
                <h2 className={`${p.badge ? "mt-1" : "mt-6"} text-3xl font-extrabold text-fg sm:text-4xl`}>{p.name}</h2>
                {p.tagline && <p className="mt-4 text-lg leading-relaxed text-fg-muted">{p.tagline}</p>}
                <Link className="mt-8 inline-flex h-11 items-center gap-2 rounded-full bg-brand px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-strong dark:text-ink" href={`/products/${p.slug}`}>
                  {p.name}-ийн тухай <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              {p.modules.length > 0 && (
                <div className="lg:col-span-7">
                  <p className="mb-3 text-xs font-semibold tracking-wider text-fg-subtle uppercase">Модулиуд</p>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {p.modules.map((m) => (
                      <li key={m.slug}>
                        <Link className="group flex h-full flex-col rounded-2xl border border-line bg-card/90 p-4 transition-colors hover:border-brand/40" href={`/products/${p.slug}/${m.slug}`}>
                          <span className="flex items-center justify-between gap-2 font-semibold text-fg group-hover:text-brand">
                            {m.name}
                            <svg aria-hidden="true" className="h-4 w-4 shrink-0 text-fg-subtle group-hover:text-brand" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M7 7h10v10" />
                              <path d="M7 17 17 7" />
                            </svg>
                          </span>
                          {m.tagline && <span className="mt-1 line-clamp-2 text-sm text-fg-muted">{m.tagline}</span>}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      ))}

      {featured.length > 0 && (
        <section className={main.length ? "pb-14 sm:pb-16" : "py-14 sm:py-16"}>
          <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
            {featured.map((p, i) => {
              const soon = p.status === "coming_soon";
              return (
                <div className="reveal" key={p.id} style={{ "--reveal-delay": `${Math.min(i, 5) * 80}ms` }}>
                  <Link
                    className={cn(
                      "group flex h-full flex-col rounded-3xl border bg-card p-7 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-ink/5",
                      soon ? "border-dashed border-line" : "border-line hover:border-brand/30",
                    )}
                    href={`/products/${p.slug}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={cn("inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl text-brand", p.logoUrl ? "border border-line bg-white p-1.5" : "bg-surface")}>
                        <ProductMark className="h-5 w-5" icon={p.icon} logoUrl={p.logoUrl} name={p.name} />
                      </span>
                      <h2 className="text-2xl font-bold text-fg">{p.name}</h2>
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
        </section>
      )}

      {other.length > 0 && (
        <section className="border-t border-line bg-surface py-14 sm:py-16">
          <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
            <div className="lg:col-span-4">
              <h2 className="text-3xl font-bold text-fg">Бусад систем</h2>
              <p className="mt-3 text-fg-muted">Тодорхой салбар, үйл ажиллагаанд зориулсан системүүд.</p>
            </div>
            <ul className="divide-y divide-line rounded-3xl border border-line bg-card lg:col-span-8">
              {other.map((p) => (
                <li key={p.id}>
                  <Link className="group flex items-start gap-4 p-5 transition-colors hover:bg-surface/60 sm:p-6" href={`/products/${p.slug}`}>
                    <span
                      className={cn(
                        "inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl",
                        p.logoUrl ? "border border-line bg-white p-1" : "bg-surface text-fg-muted group-hover:bg-brand-soft group-hover:text-brand",
                      )}
                    >
                      <ProductMark className="h-5 w-5" icon={p.icon} logoUrl={p.logoUrl} name={p.name} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2 font-display text-lg font-bold text-fg group-hover:text-brand">
                        {p.name}
                        {p.status === "coming_soon" && <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-semibold text-accent-ink">Тун удахгүй</span>}
                      </span>
                      {p.tagline && <span className="mt-0.5 line-clamp-2 block text-sm text-fg-muted">{p.tagline}</span>}
                    </span>
                    <ArrowRight className="mt-2 h-5 w-5 shrink-0 text-fg-subtle transition-all group-hover:translate-x-1 group-hover:text-brand" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
