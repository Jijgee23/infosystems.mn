import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { GuideSearch } from "@/components/site/guide-search";
import { ArrowRight, PlayCircle } from "@/components/site/icons";
import { getGuides } from "@/lib/data/guides";
import { GUIDE_CATEGORIES } from "@/lib/guide-categories";

export const metadata: Metadata = {
  title: "Заавар, гарын авлага | InfoSystems Mongolia",
  description: "MACS ERP-ийн цэс бүрийн видео заавар: компани мэдээлэл, эрх, лавлах, данс, валют, цалин, НДШ, үндсэн хөрөнгө, алсын тусламж.",
};

export default async function SupportGuidesPage() {
  const guides = await getGuides();
  const sections = GUIDE_CATEGORIES.map((c) => ({ ...c, guides: guides.filter((g) => g.category === c.key) })).filter((s) => s.guides.length);

  return (
    <main id="main">
      <section className="border-b border-line bg-surface">
        <div className="mx-auto w-full max-w-7xl px-4 pt-8 pb-12 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ href: "/support", label: "Тусламж" }, { label: "Заавар" }]} />
          <h1 className="mt-8 text-4xl font-extrabold text-fg sm:text-5xl">Заавар, гарын авлага</h1>
          <p className="mt-4 max-w-2xl text-lg text-fg-muted">Цэс бүрийг алхам алхмаар, видеотой тайлбарласан заавар.</p>
        </div>
      </section>
      <section className="py-12 sm:py-16">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12">
            <aside className="lg:col-span-4">
              <div className="space-y-6 lg:sticky lg:top-24">
                <label className="relative block">
                  <span className="sr-only">Заавар хайх</span>
                  <svg aria-hidden="true" className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-fg-subtle" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="m21 21-4.34-4.34" />
                    <circle cx="11" cy="11" r="8" />
                  </svg>
                  <GuideSearch />
                </label>
                <nav aria-label="Заавар, гарын авлага" className="hidden lg:block">
                  <ul className="space-y-1">
                    {sections.map((s) => (
                      <li key={s.key}>
                        <a className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-fg-muted transition-colors hover:bg-surface hover:text-fg" href={`#${s.key}`}>
                          {s.name}
                          <span className="rounded-full bg-surface px-2 py-0.5 text-xs tabular-nums text-fg-subtle">{s.guides.length}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </aside>
            <div className="space-y-12 lg:col-span-8">
              {sections.length === 0 && <p className="rounded-3xl border border-dashed border-line p-8 text-center text-fg-muted">Заавар удахгүй нэмэгдэнэ.</p>}
              {sections.map((s) => (
                <section className="scroll-mt-24" id={s.key} key={s.key}>
                  <h2 className="text-2xl font-bold text-fg">{s.name}</h2>
                  <ol className="mt-4 divide-y divide-line rounded-3xl border border-line bg-card">
                    {s.guides.map((g, i) => (
                      <li key={g.id}>
                        <Link className="group flex items-center gap-4 p-4 transition-colors hover:bg-surface/60 sm:px-6" href={`/support/guides/${g.slug}`}>
                          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface font-display text-sm font-bold text-fg-muted tabular-nums group-hover:bg-brand-soft group-hover:text-brand">
                            {i + 1}
                          </span>
                          <span className="min-w-0 flex-1 font-medium text-fg group-hover:text-brand">{g.title}</span>
                          {g.video && (
                            <span className="hidden items-center gap-1 text-xs font-semibold text-accent-ink sm:inline-flex">
                              <PlayCircle className="h-4 w-4" /> Видео
                            </span>
                          )}
                          <ArrowRight className="h-4 w-4 shrink-0 text-fg-subtle transition-all group-hover:translate-x-1 group-hover:text-brand" />
                        </Link>
                      </li>
                    ))}
                  </ol>
                </section>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
