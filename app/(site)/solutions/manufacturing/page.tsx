import type { Metadata } from "next";
import Link from "next/link";
import { SolutionProducts } from "@/components/site/product-extras";
import { HelpCard } from "@/components/site/help-card";

export const metadata: Metadata = {
  title: "Үйлдвэрлэл — Шийдэл | InfoSystems Mongolia",
  description: "Үйлдвэрлэл, нийтийн хоолны газарт: бүтээгдэхүүний өртөг, материалын орц, хорогдлын тооцоо ба санхүүгийн бүртгэл.",
};

export default function SolutionsManufacturingPage() {
  return (
    <main id="main">
      <section className="relative overflow-hidden border-b border-line">
        <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_80%_0%,black_20%,transparent_60%)]" />
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-7xl relative pt-8 pb-12 sm:pb-16">
          <nav aria-label="Breadcrumb" className="text-sm">
            <ol className="flex flex-wrap items-center gap-1.5 text-fg-subtle">
              <li className="flex items-center gap-1.5">
                <Link className="transition-colors hover:text-brand" href="/">Нүүр</Link>
                <svg aria-hidden="true" className="lucide lucide-chevron-right h-3.5 w-3.5" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </li>
              <li className="flex items-center gap-1.5">
                <Link className="transition-colors hover:text-brand" href="/solutions">Шийдэл</Link>
                <svg aria-hidden="true" className="lucide lucide-chevron-right h-3.5 w-3.5" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </li>
              <li className="flex items-center gap-1.5">
                <span aria-current="page" className="font-medium text-fg-muted">Үйлдвэрлэл</span>
              </li>
            </ol>
          </nav>
          <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-white dark:text-ink">
                  <svg aria-hidden="true" className="lucide lucide-factory h-6 w-6" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 16h.01" />
                    <path d="M16 16h.01" />
                    <path d="M3 19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5a.5.5 0 0 0-.769-.422l-4.462 2.844A.5.5 0 0 1 15 10.5v-2a.5.5 0 0 0-.769-.422L9.77 10.922A.5.5 0 0 1 9 10.5V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z" />
                    <path d="M8 16h.01" />
                  </svg>
                </span>
                <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand-strong">Салбарын шийдэл</span>
              </div>
              <h1 className="mt-5 text-4xl font-extrabold text-fg sm:text-5xl">Үйлдвэрлэл</h1>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-fg-muted">Үйлдвэрлэл, нийтийн хоолны газарт: бүтээгдэхүүний өртөг, материалын орц, хорогдлын тооцоо ба санхүүгийн бүртгэл.</p>
              <div className="mt-8">
                <Link className="inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-colors duration-200 bg-brand text-white shadow-sm shadow-brand/20 hover:bg-brand-strong dark:text-ink h-12 px-6 text-base" href="/contact">
                  Демо захиалах{" "}
                  <svg aria-hidden="true" className="lucide lucide-arrow-right h-4 w-4" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
            <div className="hidden lg:col-span-5 lg:block">
              <div aria-hidden="true" className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-3xl border border-line bg-surface">
                <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(circle_at_center,black_30%,transparent_75%)]" />
                <span className="absolute h-56 w-56 rounded-full border border-brand/15" />
                <span className="absolute h-40 w-40 rounded-full border border-brand/25" />
                <span className="relative -mt-8 inline-flex h-24 w-24 items-center justify-center rounded-[28px] bg-brand text-white shadow-2xl shadow-brand/30 dark:text-ink">
                  <svg aria-hidden="true" className="lucide lucide-factory h-11 w-11" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 16h.01" />
                    <path d="M16 16h.01" />
                    <path d="M3 19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5a.5.5 0 0 0-.769-.422l-4.462 2.844A.5.5 0 0 1 15 10.5v-2a.5.5 0 0 0-.769-.422L9.77 10.922A.5.5 0 0 1 9 10.5V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z" />
                    <path d="M8 16h.01" />
                  </svg>
                </span>
                <span className="absolute inset-x-4 bottom-5 flex flex-wrap justify-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-3 py-1.5 text-sm font-semibold text-fg">
                    <svg aria-hidden="true" className="lucide lucide-calculator h-4 w-4 text-brand" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                      <rect height="20" rx="2" width="16" x="4" y="2" />
                      <line x1="8" x2="16" y1="6" y2="6" />
                      <line x1="16" x2="16" y1="14" y2="18" />
                      <path d="M16 10h.01" />
                      <path d="M12 10h.01" />
                      <path d="M8 10h.01" />
                      <path d="M12 14h.01" />
                      <path d="M8 14h.01" />
                      <path d="M12 18h.01" />
                      <path d="M8 18h.01" />
                    </svg>
                    COST
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-3 py-1.5 text-sm font-semibold text-fg">
                    <svg aria-hidden="true" className="lucide lucide-layout-grid h-4 w-4 text-brand" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                      <rect height="7" rx="1" width="7" x="3" y="3" />
                      <rect height="7" rx="1" width="7" x="14" y="3" />
                      <rect height="7" rx="1" width="7" x="14" y="14" />
                      <rect height="7" rx="1" width="7" x="3" y="14" />
                    </svg>
                    MACS ERP
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-surface py-12 sm:py-14">
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-7xl">
          <h2 className="text-2xl font-bold text-fg">Энэ салбарт тохирох бүтээгдэхүүн</h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            <li>
              <Link className="group flex h-full items-start gap-4 rounded-3xl border border-line bg-card p-6 transition-colors hover:border-brand/40" href="/products/cost">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                  <svg aria-hidden="true" className="lucide lucide-calculator h-5 w-5" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                    <rect height="20" rx="2" width="16" x="4" y="2" />
                    <line x1="8" x2="16" y1="6" y2="6" />
                    <line x1="16" x2="16" y1="14" y2="18" />
                    <path d="M16 10h.01" />
                    <path d="M12 10h.01" />
                    <path d="M8 10h.01" />
                    <path d="M12 14h.01" />
                    <path d="M8 14h.01" />
                    <path d="M12 18h.01" />
                    <path d="M8 18h.01" />
                  </svg>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-3 font-display text-lg font-bold text-fg group-hover:text-brand">
                    COST
                    <svg aria-hidden="true" className="lucide lucide-arrow-right h-4 w-4 shrink-0 text-fg-subtle transition-all group-hover:translate-x-1 group-hover:text-brand" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-fg-muted">Бүтээгдэхүүний өртөг тооцоолол</span>
                </span>
              </Link>
            </li>
            <li>
              <Link className="group flex h-full items-start gap-4 rounded-3xl border border-line bg-card p-6 transition-colors hover:border-brand/40" href="/products/macs-erp">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                  <svg aria-hidden="true" className="lucide lucide-layout-grid h-5 w-5" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                    <rect height="7" rx="1" width="7" x="3" y="3" />
                    <rect height="7" rx="1" width="7" x="14" y="3" />
                    <rect height="7" rx="1" width="7" x="14" y="14" />
                    <rect height="7" rx="1" width="7" x="3" y="14" />
                  </svg>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-3 font-display text-lg font-bold text-fg group-hover:text-brand">
                    MACS ERP
                    <svg aria-hidden="true" className="lucide lucide-arrow-right h-4 w-4 shrink-0 text-fg-subtle transition-all group-hover:translate-x-1 group-hover:text-brand" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-fg-muted">Санхүүгийн бүртгэлийн иж бүрэн програм. Ерөнхий журналаас эхлээд бараа материал, үндсэн хөрөнгө, цалин хүртэл нэг өгөгдлийн санд.</span>
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </section>
      <section className="py-14 sm:py-16">
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-7xl grid gap-12 lg:grid-cols-12">
          <article className="lg:col-span-8">
            <nav aria-label="Бусад салбар" className="">
              <p className="mb-3 text-xs font-semibold tracking-wider text-fg-subtle uppercase">Бусад салбар</p>
              <ul className="flex flex-wrap gap-2">
                <li>
                  <Link className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-4 py-2 text-sm font-medium text-fg transition-colors hover:border-brand hover:text-brand" href="/solutions/retail">
                    <svg aria-hidden="true" className="lucide lucide-store h-4 w-4 text-fg-subtle" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 21v-5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5" />
                      <path d="M17.774 10.31a1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.451 0 1.12 1.12 0 0 0-1.548 0 2.5 2.5 0 0 1-3.452 0 1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.77-3.248l2.889-4.184A2 2 0 0 1 7 2h10a2 2 0 0 1 1.653.873l2.895 4.192a2.5 2.5 0 0 1-3.774 3.244" />
                      <path d="M4 10.95V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8.05" />
                    </svg>
                    {" "}Худалдаа
                  </Link>
                </li>
                <li>
                  <Link className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-4 py-2 text-sm font-medium text-fg transition-colors hover:border-brand hover:text-brand" href="/solutions/services">
                    <svg aria-hidden="true" className="lucide lucide-briefcase h-4 w-4 text-fg-subtle" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                      <rect height="14" rx="2" width="20" x="2" y="6" />
                    </svg>
                    {" "}Үйлчилгээ
                  </Link>
                </li>
                <li>
                  <Link className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-4 py-2 text-sm font-medium text-fg transition-colors hover:border-brand hover:text-brand" href="/solutions/pharmacy">
                    <svg aria-hidden="true" className="lucide lucide-pill h-4 w-4 text-fg-subtle" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                      <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
                      <path d="m8.5 8.5 7 7" />
                    </svg>
                    {" "}Эмийн сан
                  </Link>
                </li>
                <li>
                  <Link className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-4 py-2 text-sm font-medium text-fg transition-colors hover:border-brand hover:text-brand" href="/solutions/auto-service">
                    <svg aria-hidden="true" className="lucide lucide-wrench h-4 w-4 text-fg-subtle" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z" />
                    </svg>
                    {" "}Авто засвар
                  </Link>
                </li>
              </ul>
            </nav>
          </article>
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <HelpCard action={{ href: "/contact", label: "Демо захиалах" }} text="Мэргэжилтэн маань танай үйл ажиллагаанд тохируулан системийг танилцуулна." title="Танай салбарт хэрхэн ажиллахыг үзье" />
            </div>
          </aside>
        </div>
      </section>
      <SolutionProducts solution="manufacturing" />
    </main>
  );
}
