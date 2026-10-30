import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { ArrowRight, Mail, Phone } from "@/components/site/icons";
import { NotifyForm } from "@/components/site/notify-form";
import { ProductSolutions, ProductUpdates } from "@/components/site/product-extras";
import { CaseStudies, Testimonials } from "@/components/site/trust";
import { VideoButton } from "@/components/site/video-button";
import { formatPhone, getCompany, telHref } from "@/lib/data/company";
import { getProductNav, type ProductPageData } from "@/lib/data/products";
import { getUpdates } from "@/lib/data/updates";
import { ProductMark } from "@/lib/product-icons";
import { sanitizeHtml } from "@/lib/sanitize";
import { videoEmbedUrl } from "@/lib/video";
import { absUrl, JsonLd, SITE_URL } from "./json-ld";

const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");
const PRIMARY = "inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-colors duration-200 bg-brand text-white shadow-sm shadow-brand/20 hover:bg-brand-strong dark:text-ink";
const SECONDARY = "inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-colors duration-200 border border-line bg-card text-fg hover:border-brand/50 hover:text-brand";
const CONTAINER = "mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-7xl";

function productLd(p: ProductPageData, url: string) {
  return {
    "@type": "SoftwareApplication",
    name: p.parent ? `${p.parent.name} — ${p.name}` : p.name,
    ...(p.summary ? { description: p.summary } : {}),
    url: absUrl(url),
    applicationCategory: "BusinessApplication",
    operatingSystem: "Windows",
    ...(p.imageUrl ? { image: absUrl(p.imageUrl) } : {}),
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

/** Page of a top-level product (/products/<slug>). */
export async function ProductView({ product: p }: { product: ProductPageData }) {
  const [company, nav, updates] = await Promise.all([getCompany(), getProductNav(), getUpdates(p.versionNames, 1)]);
  // Without blocks or release notes the «Дэлгэрэнгүй» column would be empty: the side
  // cards then fill the row instead.
  const hasBody = p.blocks.length > 0 || updates.length > 0;
  const phone = company.phones[0];
  const comingSoon = p.status === "coming_soon";
  const video = videoEmbedUrl(p.videoUrl);
  return (
    <main id="main">
      <section className="relative overflow-hidden border-b border-line">
        {p.backgroundUrl ? <HeroBackground url={p.backgroundUrl} /> : <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_80%_0%,black_20%,transparent_60%)]" />}
        <div className={cn(CONTAINER, "relative pt-8 pb-12 sm:pb-16")}>
          <JsonLd data={productLd(p, `/products/${p.slug}`)} />
          <Breadcrumbs items={[{ href: "/products", label: "Бүтээгдэхүүн" }, { label: p.name }]} />
          <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3">
                <span className={cn("inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl", p.logoUrl ? "border border-line bg-white p-1.5" : "bg-brand text-white dark:text-ink")}>
                  <ProductMark className="h-6 w-6" icon={p.icon} logoUrl={p.logoUrl} name={p.name} />
                </span>
                {comingSoon ? (
                  <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent-ink">Тун удахгүй</span>
                ) : (
                  p.badge && <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand-strong">{p.badge}</span>
                )}
              </div>
              <h1 className="mt-5 text-4xl font-extrabold text-fg sm:text-5xl">{p.name}</h1>
              {p.tagline && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-fg-muted">{p.tagline}</p>}
              {(!comingSoon || video) && (
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  {!comingSoon && (
                    <Link className={cn(PRIMARY, "h-12 px-6 text-base")} href="/contact">
                      Демо захиалах <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                  {video && <VideoButton className={cn(SECONDARY, "h-12 px-6 text-base")} embedUrl={video} title={`${p.name} — танилцуулга бичлэг`} />}
                  {!comingSoon && !video && phone && (
                    <a className={cn(SECONDARY, "h-12 px-6 text-base")} href={telHref(phone.value)}>
                      <Phone className="h-4 w-4" /> {formatPhone(phone.value)}
                    </a>
                  )}
                </div>
              )}
            </div>
            <div className="hidden lg:col-span-5 lg:block">
              <HeroVisual product={p} />
            </div>
          </div>
          {comingSoon && (
            <div className="mt-10 max-w-2xl rounded-3xl border border-dashed border-accent/50 bg-accent-soft/50 p-6 sm:p-8">
              <p className="font-display text-xl font-bold text-fg">Нээлтийн мэдээг хамгийн түрүүнд аваарай</p>
              <p className="mt-2 text-fg-muted">{p.name} гарахад бид танд и-мэйлээр мэдэгдэнэ. Өөр зорилгоор ашиглахгүй.</p>
              <NotifyForm product={p.name} />
            </div>
          )}
        </div>
      </section>

      {p.modules.length > 0 && (
        <section className="bg-surface py-14 sm:py-16">
          <div className={CONTAINER}>
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold text-fg">{p.name}-ийн модулиуд</h2>
              <p className="mt-3 text-fg-muted">Хэрэгтэй модулиа сонгон нэвтрүүлж, дараа нь өргөтгөх боломжтой.</p>
            </div>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {p.modules.map((m) => (
                <li key={m.slug}>
                  <Link className="group flex h-full flex-col rounded-2xl border border-line bg-card p-5 transition-colors hover:border-brand/40" href={`/products/${p.slug}/${m.slug}`}>
                    <span className="flex items-start justify-between gap-2 font-display font-bold text-fg group-hover:text-brand">{m.name}</span>
                    {m.tagline && <span className="mt-2 text-sm leading-snug text-fg-muted">{m.tagline}</span>}
                    <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-brand">
                      Дэлгэрэнгүй <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="py-14 sm:py-16">
        <div className={cn(CONTAINER, "grid gap-12 lg:grid-cols-12")}>
          {hasBody && (
            <article className="lg:col-span-8">
              {p.blocks.length > 0 && <ProductBlocks blocks={p.blocks} heading="Дэлгэрэнгүй" />}
              <ProductUpdates slug={p.slug} versionNames={p.versionNames} />
            </article>
          )}
          <aside className={hasBody ? "space-y-6 lg:col-span-4" : "lg:col-span-12"}>
            <div className={hasBody ? "space-y-6 lg:sticky lg:top-24" : "grid items-start gap-6 md:grid-cols-2 lg:grid-cols-3"}>
              {!comingSoon && <ContactCard company={company} />}
              <ProductSolutions solutions={p.solutions} />
              {p.inComparison && (
                <Link className="flex items-center justify-between gap-3 rounded-3xl border border-line p-5 text-sm font-semibold text-fg transition-colors hover:border-brand/40 hover:text-brand" href="/products#compare">
                  Бусад бүтээгдэхүүнтэй харьцуулах <ArrowRight className="h-4 w-4 shrink-0" />
                </Link>
              )}
              <OtherProducts current={p.slug} nav={nav} />
            </div>
          </aside>
        </div>
      </section>
      <Testimonials className="border-t border-line bg-surface py-14 sm:py-16" productId={p.id} title={`${p.name}-ийн хэрэглэгчид`} />
      <CaseStudies className="py-14 sm:py-16" productId={p.id} title="Амжилтын түүх" />
    </main>
  );
}

/** Page of a module (/products/<parent>/<slug>). */
export async function ModuleView({ product: p }: { product: ProductPageData }) {
  const company = await getCompany();
  const parent = p.parent!;
  const i = p.siblings.findIndex((s) => s.slug === p.slug);
  const prev = p.siblings[i - 1];
  const next = p.siblings[i + 1];
  const href = (slug: string) => `/products/${parent.slug}/${slug}`;
  return (
    <main id="main">
      <section className="relative overflow-hidden border-b border-line bg-surface">
        {p.backgroundUrl && <HeroBackground url={p.backgroundUrl} />}
        <div className={cn(CONTAINER, "relative pt-8 pb-10 sm:pb-12")}>
          <JsonLd data={productLd(p, href(p.slug))} />
          <Breadcrumbs items={[{ href: "/products", label: "Бүтээгдэхүүн" }, { href: `/products/${parent.slug}`, label: parent.name }, { label: p.name }]} />
          <p className="mt-8 text-sm font-semibold text-brand">{parent.name} · Модулиуд</p>
          <h1 className="mt-2 text-4xl font-extrabold text-fg sm:text-5xl">{p.name}</h1>
          {p.tagline && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-fg-muted">{p.tagline}</p>}
        </div>
      </section>
      <section className="py-14 sm:py-16">
        <div className={cn(CONTAINER, "grid gap-12 lg:grid-cols-12")}>
          <nav aria-label="Бусад модулиуд" className="order-last lg:order-first lg:col-span-3">
            <div className="lg:sticky lg:top-24">
              <p className="mb-3 text-xs font-semibold tracking-wider text-fg-subtle uppercase">Модулиуд</p>
              <ul className="space-y-1 border-l border-line">
                {p.siblings.map((s) => (
                  <li key={s.slug}>
                    <Link
                      aria-current={s.slug === p.slug ? "page" : undefined}
                      className={cn(
                        "-ml-px block border-l-2 py-1.5 pl-4 text-sm transition-colors",
                        s.slug === p.slug ? "border-brand font-semibold text-brand" : "border-transparent text-fg-muted hover:border-line hover:text-fg",
                      )}
                      href={href(s.slug)}
                    >
                      {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
          <article className="lg:col-span-6">
            {p.blocks.length > 0 && <ProductBlocks blocks={p.blocks} />}
            <ProductUpdates slug={p.slug} versionNames={p.versionNames} />
            <div className={cn("grid gap-3 sm:grid-cols-2", p.blocks.length > 0 && "mt-12")}>
              {prev ? (
                <Link className="group rounded-2xl border border-line p-4 hover:border-brand/40" href={href(prev.slug)}>
                  <span className="text-xs text-fg-subtle">← Өмнөх</span>
                  <span className="mt-1 block font-semibold text-fg group-hover:text-brand">{prev.name}</span>
                </Link>
              ) : (
                <span />
              )}
              {next && (
                <Link className="group rounded-2xl border border-line p-4 text-right hover:border-brand/40" href={href(next.slug)}>
                  <span className="text-xs text-fg-subtle">Дараах →</span>
                  <span className="mt-1 block font-semibold text-fg group-hover:text-brand">{next.name}</span>
                </Link>
              )}
            </div>
          </article>
          <aside className="lg:col-span-3">
            <div className="space-y-6 lg:sticky lg:top-24">
              <ContactCard company={company} />
              <ProductSolutions solutions={p.solutions} />
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

/**
 * Product background photo behind the hero, faded into the page colour on the text side
 * so the heading stays readable in both themes.
 */
function HeroBackground({ url }: { url: string }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <Image alt="" className="object-cover" fetchPriority="high" fill loading="eager" sizes="100vw" src={url} />
      <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/90 to-bg/40" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-bg/80 to-transparent" />
    </div>
  );
}

function HeroVisual({ product: p }: { product: ProductPageData }) {
  if (p.imageUrl)
    return (
      <div className="aspect-[4/3] overflow-hidden rounded-3xl border border-line bg-surface p-6">
        {/* Lazy, so phones (where this column is hidden) never download it. */}
        <div className="relative h-full w-full">
          <Image alt={p.name} className="object-contain" fill sizes="(min-width: 1280px) 480px, 40vw" src={p.imageUrl} />
        </div>
      </div>
    );
  if (p.modules.length >= 4) {
    // The product in the middle of a 3×3 grid of its modules.
    const cells: ReactNode[] = p.modules.slice(0, 8).map((m) => (
      <div className="flex min-h-[72px] items-end rounded-2xl border border-line bg-surface p-3 text-[13px] leading-tight font-semibold text-fg-muted" key={m.slug}>
        {m.name}
      </div>
    ));
    cells.splice(
      Math.min(4, cells.length),
      0,
      <div className="flex min-h-[72px] flex-col items-center justify-center gap-2 rounded-2xl bg-brand p-3 text-center text-white shadow-lg shadow-brand/30 dark:text-ink" key="self">
        <span className={cn("inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg", p.logoUrl && "bg-white p-1")}>
          <ProductMark className="h-6 w-6" icon={p.icon} logoUrl={p.logoUrl} name={p.name} />
        </span>
        <span className="font-display text-sm leading-tight font-bold">{p.name}</span>
      </div>,
    );
    return (
      <div aria-hidden="true" className="relative rounded-3xl border border-line bg-card/80 p-4 shadow-2xl shadow-ink/10 backdrop-blur sm:p-5">
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3">{cells}</div>
      </div>
    );
  }
  return (
    <div aria-hidden="true" className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-3xl border border-line bg-surface">
      <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(circle_at_center,black_30%,transparent_75%)]" />
      <span className="absolute h-56 w-56 rounded-full border border-brand/15" />
      <span className="absolute h-40 w-40 rounded-full border border-brand/25" />
      <span className={cn("relative inline-flex h-24 w-24 items-center justify-center overflow-hidden rounded-[28px] shadow-2xl shadow-brand/30", p.logoUrl ? "border border-line bg-white p-3" : "bg-brand text-white dark:text-ink")}>
        <ProductMark className="h-11 w-11" icon={p.icon} logoUrl={p.logoUrl} name={p.name} />
      </span>
      <span className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full border border-line bg-card px-4 py-1.5 font-display text-sm font-bold text-fg">{p.name}</span>
    </div>
  );
}

/** The page body: rich text, feature cards and link lists, in admin order. */
export function ProductBlocks({ blocks, heading }: { blocks: ProductPageData["blocks"]; heading?: string }) {
  const links = blocks.filter((b) => b.kind === "links");
  const content = blocks.filter((b) => b.kind !== "links");
  return (
    <>
      {heading && content.length > 0 && <h2 className="mb-6 text-2xl font-bold text-fg">{heading}</h2>}
      {content.length > 0 && (
        <div className="space-y-8">
          {content.map((b) =>
            b.kind === "text" ? (
              <div key={b.id}>
                {b.heading && <h3 className="mb-3 text-xl font-bold text-fg">{b.heading}</h3>}
                <div
                  className={cn("md-content", b.style === "lead" && "md-lead", b.style === "checklist" && "md-checklist")}
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(b.body ?? "") }}
                />
              </div>
            ) : (
              <div key={b.id}>
                {b.heading && <h3 className="mb-4 text-xl font-bold text-fg">{b.heading}</h3>}
                <ul className={cn("grid gap-3", b.columns === 2 && "sm:grid-cols-2")}>
                  {b.items.map((it) => (
                    <li className="rounded-2xl border border-line bg-card p-5" key={it.id}>
                      <p className="flex items-start gap-2.5 font-display font-bold text-fg">
                        <svg aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-accent-ink" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" />
                          <path d="m9 12 2 2 4-4" />
                        </svg>
                        {it.title}
                      </p>
                      {it.body && <div className="md-content md-compact mt-2 pl-[30px]" dangerouslySetInnerHTML={{ __html: sanitizeHtml(it.body) }} />}
                    </li>
                  ))}
                </ul>
              </div>
            ),
          )}
        </div>
      )}
      {links.map((b) => (
        <div className={cn("rounded-3xl border border-line p-6", content.length > 0 && "mt-14")} key={b.id}>
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-fg">{b.heading ?? "Холбоосууд"}</h2>
            {b.items.some((it) => it.href?.startsWith("/support/guides/")) && (
              <Link className="text-sm font-semibold text-brand" href="/support/guides">
                Бүх заавар
              </Link>
            )}
          </div>
          <ul className="mt-4 divide-y divide-line">
            {b.items.map((it) => (
              <li key={it.id}>
                <Link className="group flex items-center justify-between gap-4 py-3 text-fg hover:text-brand" href={it.href ?? "#"}>
                  <span>
                    {it.title}
                    {it.body && <span className="mt-0.5 block text-sm text-fg-muted">{it.body}</span>}
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-fg-subtle group-hover:text-brand" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}

function ContactCard({ company }: { company: Awaited<ReturnType<typeof getCompany>> }) {
  return (
    <div className="rounded-3xl border border-line bg-surface p-6">
      <p className="font-display text-lg font-bold text-fg">Танай байгууллагад тохирох эсэхийг үзье</p>
      <p className="mt-2 text-sm leading-relaxed text-fg-muted">Мэргэжилтэн маань үйл ажиллагаанд тань тохируулан системийг танилцуулна.</p>
      <Link className={cn(PRIMARY, "mt-5 h-10 w-full px-4 text-sm")} href="/contact">
        Демо захиалах <ArrowRight className="h-4 w-4" />
      </Link>
      <div className="mt-5 space-y-2 border-t border-line pt-5 text-sm">
        {company.phones.slice(0, 2).map((ph) => (
          <a className="flex items-center gap-2 font-medium text-fg hover:text-brand" href={telHref(ph.value)} key={ph.id}>
            <Phone className="h-4 w-4 text-fg-subtle" /> {formatPhone(ph.value)}
          </a>
        ))}
        {company.emails.slice(0, 1).map((e) => (
          <a className="flex items-center gap-2 font-medium text-fg hover:text-brand" href={`mailto:${e.value}`} key={e.id}>
            <Mail className="h-4 w-4 text-fg-subtle" /> {e.value}
          </a>
        ))}
      </div>
    </div>
  );
}

function OtherProducts({ current, nav }: { current: string; nav: Awaited<ReturnType<typeof getProductNav>> }) {
  const others = nav.filter((n) => n.slug !== current);
  if (!others.length) return null;
  return (
    <nav aria-label="Бусад бүтээгдэхүүн" className="rounded-3xl border border-line p-6">
      <p className="mb-3 text-xs font-semibold tracking-wider text-fg-subtle uppercase">Бусад бүтээгдэхүүн</p>
      <ul className="space-y-1">
        {others.map((o) => (
          <li key={o.slug}>
            <Link className="-mx-2 flex items-center gap-3 rounded-xl px-2 py-2 text-sm text-fg-muted transition-colors hover:bg-surface hover:text-fg" href={`/products/${o.slug}`}>
              <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center text-fg-subtle">
                <ProductMark className="h-4 w-4" icon={o.icon} logoUrl={o.logoUrl} name={o.name} />
              </span>
              <span className="font-medium">{o.name}</span>
              {o.status === "coming_soon" && <span className="ml-auto text-xs text-accent-ink">Тун удахгүй</span>}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Loading state of the product and module pages. */
export function ProductSkeleton() {
  return (
    <main aria-hidden="true" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8" id="main">
      <div className="h-5 w-48 animate-pulse rounded bg-surface" />
      <div className="mt-10 h-12 w-12 animate-pulse rounded-2xl bg-surface" />
      <div className="mt-6 h-12 w-80 max-w-full animate-pulse rounded bg-surface" />
      <div className="mt-4 h-6 w-[32rem] max-w-full animate-pulse rounded bg-surface" />
      <div className="mt-16 h-64 animate-pulse rounded-3xl bg-surface" />
    </main>
  );
}
