import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@/components/site/icons";
import { getCaseStudies, getClientLogos, getStats, getTestimonials } from "@/lib/data/trust";
import { StatCards } from "./stat-cards";

const CONTAINER = "mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-7xl";

/** Ministry of Finance permit + headline figures (admin «Үзүүлэлт», or counts from the data). */
export async function TrustBar() {
  const stats = await getStats();
  return (
    <section className="border-y border-line bg-surface">
      <div className={`${CONTAINER} grid items-center gap-8 py-8 sm:py-10 lg:grid-cols-12 lg:gap-12`}>
        <div className="flex items-start gap-4 lg:col-span-5">
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand text-white dark:text-ink">
            <svg aria-hidden="true" className="h-6 w-6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </span>
          <div>
            <p className="font-display text-lg font-bold text-fg sm:text-xl">Сангийн яамны тусгай зөвшөөрөлтэй, 1998 оноос</p>
            <p className="mt-1 text-sm leading-relaxed text-fg-muted">Нягтлан бодох бүртгэлийн газраас 2 жил тутам шинэчлэн олгодог зөвшөөрлийг тасралтгүй авсаар ирсэн.</p>
          </div>
        </div>
        <StatCards className="lg:col-span-7" stats={stats} />
      </div>
    </section>
  );
}

/** «Бидэнд итгэдэг байгууллагууд»: client logos; hidden when there are none. */
export async function ClientLogos({ className = "py-12 sm:py-14" }: { className?: string }) {
  const logos = await getClientLogos();
  if (!logos.length) return null;
  return (
    <section aria-labelledby="clients-heading" className={className}>
      <div className={CONTAINER}>
        <h2 className="text-center text-sm font-semibold tracking-wide text-fg-subtle uppercase" id="clients-heading">
          Бидэнд итгэдэг байгууллагууд
        </h2>
        <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {logos.map((l) => {
            const img = (
              <Image
                alt={l.name}
                className="h-10 w-auto max-w-[9rem] object-contain transition-transform hover:scale-105 sm:h-12"
                height={l.height ?? 48}
                sizes="144px"
                src={l.logoUrl}
                title={l.name}
                width={l.width ?? 144}
              />
            );
            return (
              <li key={l.id}>
                {l.url ? (
                  <a href={l.url} rel="noopener" target="_blank">
                    {img}
                  </a>
                ) : (
                  img
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/** Customer quotes; with `productId` only that product's. Hidden when there are none. */
export async function Testimonials({ productId, title = "Хэрэглэгчийн сэтгэгдэл", className = "py-16 sm:py-20" }: { productId?: string; title?: string; className?: string }) {
  const items = await getTestimonials(productId);
  if (!items.length) return null;
  return (
    <section className={className}>
      <div className={CONTAINER}>
        <h2 className="text-3xl font-bold text-fg">{title}</h2>
        <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => (
            <li key={t.id}>
              <figure className="flex h-full flex-col rounded-3xl border border-line bg-card p-6">
              <svg aria-hidden="true" className="h-7 w-7 text-brand/40" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9.6 5C6 6.4 3.5 9.6 3.5 13.6V19h6.2v-6.2H6.6c0-2.6 1.4-4.6 4-5.6L9.6 5Zm10 0C16 6.4 13.5 9.6 13.5 13.6V19h6.2v-6.2h-3.1c0-2.6 1.4-4.6 4-5.6L19.6 5Z" />
              </svg>
              <blockquote className="mt-3 flex-1 leading-relaxed whitespace-pre-line text-fg">{t.quote}</blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-4">
                {t.photoUrl ? (
                  <Image alt="" className="h-11 w-11 shrink-0 rounded-full object-cover" height={44} src={t.photoUrl} width={44} />
                ) : (
                  <span aria-hidden="true" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-soft font-display font-bold text-brand">
                    {t.authorName.replace(/^[^\p{L}]*/u, "").charAt(0)}
                  </span>
                )}
                <span className="min-w-0">
                  <span className="block font-semibold text-fg">{t.authorName}</span>
                  <span className="block text-sm text-fg-muted">{[t.authorTitle, t.companyName].filter(Boolean).join(", ")}</span>
                </span>
                {t.productName && !productId && <span className="ml-auto shrink-0 rounded-full bg-surface px-2.5 py-1 text-xs font-semibold text-fg-muted">{t.productName}</span>}
              </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

type CaseCard = Awaited<ReturnType<typeof getCaseStudies>>[number];

export function CaseStudyCard({ c }: { c: CaseCard }) {
  return (
    <Link className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-card transition-all hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-xl hover:shadow-ink/5" href={`/customers/${c.slug}`}>
      {c.coverUrl ? (
        <Image
          alt=""
          className="aspect-[16/9] w-full object-cover"
          height={c.coverHeight ?? 450}
          sizes="(min-width: 1280px) 400px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          src={c.coverUrl}
          width={c.coverWidth ?? 800}
        />
      ) : (
        <div className="bg-grid flex aspect-[16/9] items-center justify-center bg-surface">
          {c.logoUrl ? (
            <Image alt="" className="h-16 w-auto max-w-[60%] object-contain" height={64} sizes="240px" src={c.logoUrl} width={240} />
          ) : (
            <span className="font-display text-xl font-bold text-fg-subtle">{c.clientName}</span>
          )}
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <p className="text-sm font-semibold text-brand">
          {c.clientName}
          {c.industry && <span className="font-normal text-fg-subtle"> · {c.industry}</span>}
        </p>
        <h3 className="mt-2 font-display text-xl font-bold text-fg group-hover:text-brand">{c.title}</h3>
        {c.summary && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-fg-muted">{c.summary}</p>}
        {c.highlights.length > 0 && (
          <dl className="mt-5 grid grid-cols-3 gap-2 border-t border-line pt-4">
            {c.highlights.map((h) => (
              <div key={h.label}>
                <dt className="sr-only">{h.label}</dt>
                <dd>
                  <span className="block font-display text-lg font-extrabold text-fg">{h.value}</span>
                  <span className="block text-xs leading-snug text-fg-muted">{h.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        )}
        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-brand transition-all group-hover:gap-2.5">
          Дэлгэрэнгүй <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}

/** Up to three success stories (all, or one product's); hidden when there are none. */
export async function CaseStudies({ productId, title = "Амжилтын түүх", className = "py-16 sm:py-20" }: { productId?: string; title?: string; className?: string }) {
  const all = await getCaseStudies(productId);
  if (!all.length) return null;
  return (
    <section className={className}>
      <div className={CONTAINER}>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <h2 className="text-3xl font-bold text-fg">{title}</h2>
          {all.length > 3 || !productId ? (
            <Link className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-brand transition-all hover:gap-2.5" href="/customers">
              Бүх түүх <ArrowRight className="h-4 w-4" />
            </Link>
          ) : null}
        </div>
        <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {all.slice(0, 3).map((c) => (
            <li key={c.id}>
              <CaseStudyCard c={c} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
