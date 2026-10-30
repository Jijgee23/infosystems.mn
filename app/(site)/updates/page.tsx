import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { UpdateList } from "@/components/site/product-extras";
import { getUpdateProducts, getUpdates } from "@/lib/data/updates";

export const metadata: Metadata = {
  title: "Шинэчлэлтүүд | InfoSystems Mongolia",
  description: "MACS ERP, MACS POS програмын шинэ хувилбаруудад нэмэгдсэн боломж, засварууд.",
  alternates: { canonical: "/updates" },
};

/** Release notes from admin › Хувилбарын түүх (the same rows the desktop apps read). */
export default function UpdatesPage(props: PageProps<"/updates">) {
  return (
    <main id="main">
      <section className="border-b border-line bg-surface">
        <div className="mx-auto w-full max-w-4xl px-4 pt-8 pb-10 sm:px-6 sm:pb-12 lg:px-8">
          <Breadcrumbs items={[{ href: "/support", label: "Тусламж" }, { label: "Шинэчлэлтүүд" }]} />
          <h1 className="mt-8 text-4xl font-extrabold text-fg sm:text-5xl">Шинэчлэлтүүд</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-fg-muted">Хууль, зах зээлийн өөрчлөлт, харилцагчдынхаа хэрэгцээг тусган програмаа тасралтгүй сайжруулдаг.</p>
        </div>
      </section>
      <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Suspense fallback={<div aria-hidden="true" className="h-96 animate-pulse rounded-3xl bg-surface" />}>
          <Updates searchParams={props.searchParams} />
        </Suspense>
      </div>
    </main>
  );
}

async function Updates({ searchParams }: Pick<PageProps<"/updates">, "searchParams">) {
  const sp = await searchParams;
  const products = await getUpdateProducts();
  const current = products.find((p) => p.slug === sp.product) ?? null;
  const updates = await getUpdates(current ? current.versionNames : products.flatMap((p) => p.versionNames), 200);
  const productOf = (name: string | null) => products.find((p) => name && p.versionNames.includes(name))?.name;
  const tab = (active: boolean) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition-colors ${active ? "bg-brand text-white dark:text-ink" : "border border-line bg-card text-fg-muted hover:border-brand/40 hover:text-fg"}`;
  return (
    <>
      {products.length > 1 && (
        <nav aria-label="Бүтээгдэхүүнээр шүүх" className="mb-8 flex flex-wrap gap-2">
          <Link aria-current={!current ? "page" : undefined} className={tab(!current)} href="/updates">
            Бүгд
          </Link>
          {products.map((p) => (
            <Link aria-current={current?.slug === p.slug ? "page" : undefined} className={tab(current?.slug === p.slug)} href={`/updates?product=${p.slug}`} key={p.slug}>
              {p.name}
            </Link>
          ))}
        </nav>
      )}
      {updates.length ? (
        // Group by year so a long history stays scannable.
        Object.entries(Object.groupBy(updates, (u) => String(u.changedDate.getUTCFullYear())))
          .sort(([a], [b]) => Number(b) - Number(a))
          .map(([year, list]) => (
            <section className="mb-10" key={year}>
              <h2 className="text-2xl font-bold text-fg">{year}</h2>
              <UpdateList labelOf={current ? undefined : productOf} updates={list ?? []} />
            </section>
          ))
      ) : (
        <p className="text-fg-muted">Шинэчлэлт алга.</p>
      )}
      {current && (
        <p className="mt-6 text-sm">
          <Link className="font-semibold text-brand hover:underline" href={`/products/${current.slug}`}>
            ← {current.name}-ийн тухай
          </Link>
        </p>
      )}
    </>
  );
}
