import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { absUrl, JsonLd, SITE_URL } from "@/components/site/json-ld";
import { ViewCounter } from "@/components/site/view-counter";
import { HelpCard } from "@/components/site/help-card";
import { ArrowLeft, ArrowRight } from "@/components/site/icons";
import { getGuide, getGuides } from "@/lib/data/guides";
import { summary } from "@/lib/data/products";
import { guideCategoryName } from "@/lib/guide-categories";
import { renderRichBody } from "@/lib/rich-body";
import { DEFAULT_OG_IMAGE } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/support/guides/[slug]">): Promise<Metadata> {
  const guide = await getGuide(decodeURIComponent((await params).slug));
  if (!guide) return { title: "Заавар олдсонгүй | InfoSystems Mongolia" };
  return {
    title: `${guide.title} — ${guideCategoryName(guide.category)} | InfoSystems Mongolia`,
    description: summary(guide.body, 160) || undefined,
    alternates: { canonical: `/support/guides/${guide.slug}` },
    openGraph: { type: "article", title: guide.title, images: [DEFAULT_OG_IMAGE] },
  };
}

export default function GuidePage(props: PageProps<"/support/guides/[slug]">) {
  return (
    <main id="main">
      <Suspense fallback={<GuideSkeleton />}>
        <GuideDetails params={props.params} />
      </Suspense>
    </main>
  );
}

/** 2025-03-26 -> 2025.03.26 (the date is stored without a time zone). */
const dotDate = (d: Date) => d.toISOString().slice(0, 10).replaceAll("-", ".");

async function GuideDetails({ params }: Pick<PageProps<"/support/guides/[slug]">, "params">) {
  const slug = decodeURIComponent((await params).slug);
  const [guide, all] = await Promise.all([getGuide(slug), getGuides()]);
  if (!guide) notFound();
  const category = guideCategoryName(guide.category);
  // Steps of the same section, for the side menu and previous / next links.
  const steps = all.filter((g) => g.category === guide.category);
  const at = steps.findIndex((g) => g.id === guide.id);
  const prev = at > 0 ? steps[at - 1] : null;
  const next = at >= 0 && at < steps.length - 1 ? steps[at + 1] : null;

  return (
    <>
      <JsonLd
        data={{
          "@type": "TechArticle",
          headline: guide.title,
          articleSection: category,
          description: summary(guide.body, 160),
          ...(guide.contentDate ? { dateModified: guide.contentDate.toISOString().slice(0, 10) } : {}),
          ...(guide.publishedAt ? { datePublished: guide.publishedAt.toISOString() } : {}),
          mainEntityOfPage: absUrl(`/support/guides/${guide.slug}`),
          publisher: { "@id": `${SITE_URL}/#organization` },
        }}
      />
      <section className="border-b border-line bg-surface">
        <div className="mx-auto w-full max-w-7xl px-4 pt-8 pb-10 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ href: "/support", label: "Тусламж" }, { href: "/support/guides", label: "Заавар" }, { label: guide.title }]} />
          <Link className="mt-8 inline-block text-sm font-semibold text-brand" href={`/support/guides#${guide.category}`}>
            {category}
          </Link>
          <h1 className="mt-2 max-w-3xl text-3xl font-extrabold text-fg sm:text-4xl">{guide.title}</h1>
          {guide.contentDate && (
            <p className="mt-3 text-sm text-fg-subtle">
              Шинэчилсэн: <time dateTime={guide.contentDate.toISOString().slice(0, 10)}>{dotDate(guide.contentDate)}</time>
            </p>
          )}
        </div>
      </section>
      <section className="py-12 sm:py-14">
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <article className="min-w-0 lg:col-span-8">
            <div className="md-content" dangerouslySetInnerHTML={{ __html: renderRichBody(guide.body, "guide") }} />
            {(prev || next) && (
              <div className="mt-12 grid gap-3 sm:grid-cols-2">
                {prev ? (
                  <Link className="group rounded-2xl border border-line p-4 hover:border-brand/40" href={`/support/guides/${prev.slug}`}>
                    <span className="flex items-center gap-1 text-xs text-fg-subtle">
                      <ArrowLeft className="h-3.5 w-3.5" /> Өмнөх
                    </span>
                    <span className="mt-1 block font-semibold text-fg group-hover:text-brand">{prev.title}</span>
                  </Link>
                ) : (
                  <span className="hidden sm:block" />
                )}
                {next && (
                  <Link className="group rounded-2xl border border-line p-4 text-right hover:border-brand/40" href={`/support/guides/${next.slug}`}>
                    <span className="flex items-center justify-end gap-1 text-xs text-fg-subtle">
                      Дараах <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                    <span className="mt-1 block font-semibold text-fg group-hover:text-brand">{next.title}</span>
                  </Link>
                )}
              </div>
            )}
          </article>
          <aside className="space-y-6 lg:col-span-4">
            <div className="space-y-6 lg:sticky lg:top-24">
              {steps.length > 1 && (
                <nav aria-label="Энэ бүлгийн заавар" className="rounded-3xl border border-line p-5">
                  <p className="mb-3 px-1 text-xs font-semibold tracking-wider text-fg-subtle uppercase">Энэ бүлгийн заавар</p>
                  <ol className="space-y-0.5">
                    {steps.map((g, i) => {
                      const current = g.id === guide.id;
                      return (
                        <li key={g.id}>
                          <Link
                            aria-current={current ? "page" : undefined}
                            className={`flex gap-3 rounded-xl px-2 py-2 text-sm transition-colors ${current ? "bg-brand-soft font-semibold text-brand-strong" : "text-fg-muted hover:bg-surface hover:text-fg"}`}
                            href={`/support/guides/${g.slug}`}
                          >
                            <span className="w-4 shrink-0 text-right tabular-nums">{i + 1}</span>
                            {g.title}
                          </Link>
                        </li>
                      );
                    })}
                  </ol>
                </nav>
              )}
              <HelpCard />
            </div>
          </aside>
        </div>
      </section>
      <ViewCounter id={guide.id} kind="guide" />
    </>
  );
}

function GuideSkeleton() {
  return (
    <div aria-hidden="true" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="h-6 w-40 animate-pulse rounded bg-surface" />
      <div className="mt-6 h-10 w-2/3 animate-pulse rounded bg-surface" />
      <div className="mt-10 h-64 animate-pulse rounded-3xl bg-surface lg:w-2/3" />
    </div>
  );
}
