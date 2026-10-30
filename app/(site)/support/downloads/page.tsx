import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { Download, ExternalLink } from "@/components/site/icons";
import { formatSize, getDownloads } from "@/lib/data/downloads";

export const metadata: Metadata = {
  title: "Програм татах | InfoSystems Mongolia",
  description: "AnyDesk, TeamViewer, UltraViewer зэрэг алсын тусламжийн програмууд.",
};

const PRIMARY = "inline-flex h-10 items-center gap-2 rounded-full bg-brand px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-strong dark:text-ink";

export default async function SupportDownloadsPage() {
  const items = await getDownloads();
  return (
    <main id="main">
      <section className="border-b border-line bg-surface">
        <div className="mx-auto w-full max-w-7xl px-4 pt-8 pb-12 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ href: "/support", label: "Тусламж" }, { label: "Програм татах" }]} />
          <h1 className="mt-8 text-4xl font-extrabold text-fg sm:text-5xl">Програм татах</h1>
          <p className="mt-4 max-w-2xl text-lg text-fg-muted">Манай инженер алсаас холбогдоход шаардлагатай програмууд.</p>
        </div>
      </section>
      <section className="py-12 sm:py-16">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {items.length === 0 ? (
            <p className="rounded-3xl border border-dashed border-line p-8 text-center text-fg-muted">Татах файл удахгүй нэмэгдэнэ.</p>
          ) : (
            <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {items.map((d) => (
                <li className="flex flex-col rounded-3xl border border-line bg-card p-6" key={d.id}>
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-surface text-brand">
                    <Download className="h-5 w-5" />
                  </span>
                  <p className="mt-4 font-display text-lg font-bold text-fg">{d.title}</p>
                  {d.description && <p className="mt-1 text-sm text-fg-muted">{d.description}</p>}
                  <div className="mt-auto flex flex-wrap items-center gap-3 pt-6">
                    {d.fileUrl && (
                      <a className={PRIMARY} download={d.fileName ?? true} href={d.fileUrl}>
                        <Download className="h-4 w-4" /> Татах{d.fileSizeKb ? ` (${formatSize(d.fileSizeKb)})` : ""}
                      </a>
                    )}
                    {d.externalUrl &&
                      (d.fileUrl ? (
                        <a className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline" href={d.externalUrl} rel="noopener" target="_blank">
                          Албан ёсны сайтаас <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      ) : (
                        <a className={PRIMARY} href={d.externalUrl} rel="noopener" target="_blank">
                          <ExternalLink className="h-4 w-4" /> Албан ёсны сайтаас
                        </a>
                      ))}
                    {d.guideSlug && (
                      <Link className="text-sm font-semibold text-brand hover:underline" href={`/support/guides/${d.guideSlug}`}>
                        Заавар
                      </Link>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
