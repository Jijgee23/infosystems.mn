import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { ArrowRight } from "@/components/site/icons";
import { getCaseStudy } from "@/lib/data/trust";
import { sanitizeHtml } from "@/lib/sanitize";
import { DEFAULT_OG_IMAGE } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/customers/[slug]">): Promise<Metadata> {
  const c = await getCaseStudy(decodeURIComponent((await params).slug));
  if (!c) return { title: "Олдсонгүй | InfoSystems Mongolia" };
  return {
    title: `${c.title} — ${c.clientName} | InfoSystems Mongolia`,
    description: c.summary ?? undefined,
    alternates: { canonical: `/customers/${c.slug}` },
    openGraph: { type: "article", title: c.title, images: c.coverUrl ? [c.coverUrl] : [DEFAULT_OG_IMAGE] },
  };
}

export default function CaseStudyPage(props: PageProps<"/customers/[slug]">) {
  return (
    <main id="main">
      <Suspense fallback={<div aria-hidden="true" className="mx-auto my-16 h-96 w-full max-w-4xl animate-pulse rounded-3xl bg-surface" />}>
        <CaseStudy params={props.params} />
      </Suspense>
    </main>
  );
}

async function CaseStudy({ params }: Pick<PageProps<"/customers/[slug]">, "params">) {
  const c = await getCaseStudy(decodeURIComponent((await params).slug));
  if (!c) notFound();
  return (
    <article>
      <header className="border-b border-line bg-surface">
        <div className="mx-auto w-full max-w-4xl px-4 pt-8 pb-12 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ href: "/customers", label: "Амжилтын түүх" }, { label: c.clientName }]} />
          <div className="mt-8 flex items-center gap-4">
            {c.logoUrl && (
              <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-line bg-white p-1.5">
                <Image alt="" className="h-full w-full object-contain" height={44} src={c.logoUrl} width={44} />
              </span>
            )}
            <p className="text-sm font-semibold text-brand">
              {c.clientName}
              {c.industry && <span className="font-normal text-fg-subtle"> · {c.industry}</span>}
            </p>
          </div>
          <h1 className="mt-4 text-3xl font-extrabold text-fg sm:text-4xl">{c.title}</h1>
          {c.summary && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-fg-muted">{c.summary}</p>}
          {c.highlights.length > 0 && (
            <dl className="mt-8 grid gap-3 sm:grid-cols-3">
              {c.highlights.map((h) => (
                <div className="rounded-2xl border border-line bg-card px-5 py-4" key={h.label}>
                  <dt className="sr-only">{h.label}</dt>
                  <dd>
                    <span className="block font-display text-3xl font-extrabold text-fg">{h.value}</span>
                    <span className="mt-0.5 block text-sm text-fg-muted">{h.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </header>
      <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {c.coverUrl && (
          <figure className="md-figure mt-0">
            <Image
              alt=""
              className="h-auto w-full"
              fetchPriority="high"
              height={c.coverHeight ?? 900}
              loading="eager"
              sizes="(min-width: 896px) 832px, calc(100vw - 32px)"
              src={c.coverUrl}
              width={c.coverWidth ?? 1600}
            />
          </figure>
        )}
        <div className="md-content" dangerouslySetInnerHTML={{ __html: sanitizeHtml(c.body) }} />
        {c.products.length > 0 && (
          <div className="mt-12 rounded-3xl border border-line p-6">
            <h2 className="text-lg font-bold text-fg">Ашигласан бүтээгдэхүүн</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {c.products.map((p) => (
                <li key={p.slug}>
                  <Link className="inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-3.5 py-1.5 text-sm font-semibold text-fg hover:border-brand/40 hover:text-brand" href={p.parent ? `/products/${p.parent.slug}/${p.slug}` : `/products/${p.slug}`}>
                    {p.name} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-ink p-6 text-white sm:p-8 dark:border dark:border-line dark:bg-surface">
          <p className="font-display text-xl font-bold">Танай байгууллагад ч ийм үр дүн гаргая</p>
          <Link className="inline-flex h-11 items-center gap-2 rounded-full bg-brand px-5 text-sm font-semibold text-white hover:bg-brand-strong dark:text-ink" href="/contact">
            Демо захиалах <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <Link className="mt-10 inline-flex items-center gap-1.5 text-sm font-semibold text-brand" href="/customers">
          ← Бүх амжилтын түүх
        </Link>
      </div>
    </article>
  );
}
