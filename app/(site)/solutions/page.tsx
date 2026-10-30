import type { Metadata } from "next";
import Link from "next/link";
import { CtaContacts } from "@/components/site/cta-contacts";

export const metadata: Metadata = {
  title: "Салбарын шийдэл | InfoSystems Mongolia",
  description: "Худалдаа, үйлдвэрлэл, үйлчилгээ, эмийн сан, авто засварын газарт зориулсан MACS шийдлүүд.",
};

export default function SolutionsPage() {
  return (
    <main id="main">
      <section className="border-b border-line bg-surface">
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-7xl pt-8 pb-12 sm:pb-16">
          <nav aria-label="Breadcrumb" className="text-sm">
            <ol className="flex flex-wrap items-center gap-1.5 text-fg-subtle">
              <li className="flex items-center gap-1.5">
                <Link className="transition-colors hover:text-brand" href="/">Нүүр</Link>
                <svg aria-hidden="true" className="lucide lucide-chevron-right h-3.5 w-3.5" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </li>
              <li className="flex items-center gap-1.5">
                <span aria-current="page" className="font-medium text-fg-muted">Шийдэл</span>
              </li>
            </ol>
          </nav>
          <div className="mt-8 max-w-3xl">
            <p className="mb-3 text-sm font-semibold tracking-wide text-brand uppercase">Салбарын шийдэл</p>
            <h1 className="text-4xl font-extrabold text-fg sm:text-5xl">Танай салбарт тохируулсан шийдэл</h1>
            <p className="mt-5 text-lg leading-relaxed text-fg-muted">Салбар бүрийн онцлогт тохирсон бүтээгдэхүүнүүдийг хослуулан, бүртгэлээ нэг системд төвлөрүүлээрэй.</p>
          </div>
        </div>
      </section>
      <section className="py-14 sm:py-16">
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-7xl">
          <ul className="space-y-4">
            <li className="reveal" style={{ "--reveal-delay": "0ms" }}>
              <Link className="group grid items-center gap-5 rounded-3xl border border-line bg-card p-6 transition-all hover:border-brand/40 hover:shadow-xl hover:shadow-ink/5 sm:grid-cols-[auto_1fr_auto] sm:gap-8 sm:p-8" href="/solutions/retail">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft text-brand transition-colors group-hover:bg-brand group-hover:text-white dark:group-hover:text-ink">
                  <svg aria-hidden="true" className="lucide lucide-store h-7 w-7" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 21v-5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5" />
                    <path d="M17.774 10.31a1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.451 0 1.12 1.12 0 0 0-1.548 0 2.5 2.5 0 0 1-3.452 0 1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.77-3.248l2.889-4.184A2 2 0 0 1 7 2h10a2 2 0 0 1 1.653.873l2.895 4.192a2.5 2.5 0 0 1-3.774 3.244" />
                    <path d="M4 10.95V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8.05" />
                  </svg>
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-2xl font-bold text-fg group-hover:text-brand">Худалдаа</span>
                  <span className="mt-1.5 block max-w-2xl leading-relaxed text-fg-muted">Дэлгүүр, худалдааны байгууллагад: кассын систем, баркодтой бараа материалын бүртгэл, санхүүгийн тайлан нэг дор.</span>
                  <span className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-fg-muted">MACS POS</span>
                    <span className="rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-fg-muted">MACS ERP</span>
                  </span>
                </span>
                <span className="hidden items-center gap-1.5 text-sm font-semibold text-brand transition-all group-hover:gap-2.5 sm:inline-flex">
                  Дэлгэрэнгүй{" "}
                  <svg aria-hidden="true" className="lucide lucide-arrow-right h-4 w-4" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </li>
            <li className="reveal" style={{ "--reveal-delay": "60ms" }}>
              <Link className="group grid items-center gap-5 rounded-3xl border border-line bg-card p-6 transition-all hover:border-brand/40 hover:shadow-xl hover:shadow-ink/5 sm:grid-cols-[auto_1fr_auto] sm:gap-8 sm:p-8" href="/solutions/manufacturing">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft text-brand transition-colors group-hover:bg-brand group-hover:text-white dark:group-hover:text-ink">
                  <svg aria-hidden="true" className="lucide lucide-factory h-7 w-7" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 16h.01" />
                    <path d="M16 16h.01" />
                    <path d="M3 19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5a.5.5 0 0 0-.769-.422l-4.462 2.844A.5.5 0 0 1 15 10.5v-2a.5.5 0 0 0-.769-.422L9.77 10.922A.5.5 0 0 1 9 10.5V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z" />
                    <path d="M8 16h.01" />
                  </svg>
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-2xl font-bold text-fg group-hover:text-brand">Үйлдвэрлэл</span>
                  <span className="mt-1.5 block max-w-2xl leading-relaxed text-fg-muted">Үйлдвэрлэл, нийтийн хоолны газарт: бүтээгдэхүүний өртөг, материалын орц, хорогдлын тооцоо ба санхүүгийн бүртгэл.</span>
                  <span className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-fg-muted">COST</span>
                    <span className="rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-fg-muted">MACS ERP</span>
                  </span>
                </span>
                <span className="hidden items-center gap-1.5 text-sm font-semibold text-brand transition-all group-hover:gap-2.5 sm:inline-flex">
                  Дэлгэрэнгүй{" "}
                  <svg aria-hidden="true" className="lucide lucide-arrow-right h-4 w-4" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </li>
            <li className="reveal" style={{ "--reveal-delay": "120ms" }}>
              <Link className="group grid items-center gap-5 rounded-3xl border border-line bg-card p-6 transition-all hover:border-brand/40 hover:shadow-xl hover:shadow-ink/5 sm:grid-cols-[auto_1fr_auto] sm:gap-8 sm:p-8" href="/solutions/services">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft text-brand transition-colors group-hover:bg-brand group-hover:text-white dark:group-hover:text-ink">
                  <svg aria-hidden="true" className="lucide lucide-briefcase h-7 w-7" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    <rect height="14" rx="2" width="20" x="2" y="6" />
                  </svg>
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-2xl font-bold text-fg group-hover:text-brand">Үйлчилгээ</span>
                  <span className="mt-1.5 block max-w-2xl leading-relaxed text-fg-muted">Үйлчилгээний байгууллагад: MACS POS кассын програм ба MACS ERP санхүүгийн бүртгэл.</span>
                  <span className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-fg-muted">MACS POS</span>
                    <span className="rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-fg-muted">MACS ERP</span>
                  </span>
                </span>
                <span className="hidden items-center gap-1.5 text-sm font-semibold text-brand transition-all group-hover:gap-2.5 sm:inline-flex">
                  Дэлгэрэнгүй{" "}
                  <svg aria-hidden="true" className="lucide lucide-arrow-right h-4 w-4" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </li>
            <li className="reveal" style={{ "--reveal-delay": "180ms" }}>
              <Link className="group grid items-center gap-5 rounded-3xl border border-line bg-card p-6 transition-all hover:border-brand/40 hover:shadow-xl hover:shadow-ink/5 sm:grid-cols-[auto_1fr_auto] sm:gap-8 sm:p-8" href="/solutions/pharmacy">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft text-brand transition-colors group-hover:bg-brand group-hover:text-white dark:group-hover:text-ink">
                  <svg aria-hidden="true" className="lucide lucide-pill h-7 w-7" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
                    <path d="m8.5 8.5 7 7" />
                  </svg>
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-2xl font-bold text-fg group-hover:text-brand">Эмийн сан</span>
                  <span className="mt-1.5 block max-w-2xl leading-relaxed text-fg-muted">Эмийн сангуудад зориулсан POS: жор баригчтай тооцоо, ЭМД-ын хөнгөлөлт, серийн бүртгэл.</span>
                  <span className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-fg-muted">MACS POS</span>
                    <span className="rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-fg-muted">MACS ERP</span>
                  </span>
                </span>
                <span className="hidden items-center gap-1.5 text-sm font-semibold text-brand transition-all group-hover:gap-2.5 sm:inline-flex">
                  Дэлгэрэнгүй{" "}
                  <svg aria-hidden="true" className="lucide lucide-arrow-right h-4 w-4" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </li>
            <li className="reveal" style={{ "--reveal-delay": "240ms" }}>
              <Link className="group grid items-center gap-5 rounded-3xl border border-line bg-card p-6 transition-all hover:border-brand/40 hover:shadow-xl hover:shadow-ink/5 sm:grid-cols-[auto_1fr_auto] sm:gap-8 sm:p-8" href="/solutions/auto-service">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft text-brand transition-colors group-hover:bg-brand group-hover:text-white dark:group-hover:text-ink">
                  <svg aria-hidden="true" className="lucide lucide-wrench h-7 w-7" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z" />
                  </svg>
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-2xl font-bold text-fg group-hover:text-brand">Авто засвар</span>
                  <span className="mt-1.5 block max-w-2xl leading-relaxed text-fg-muted">Авто засварын газрын бүртгэл, нарядын тооцоо, сэлбэг хайлт (Car Service систем).</span>
                  <span className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-fg-muted">MACS ERP</span>
                    <span className="rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-fg-muted">MACS POS</span>
                  </span>
                </span>
                <span className="hidden items-center gap-1.5 text-sm font-semibold text-brand transition-all group-hover:gap-2.5 sm:inline-flex">
                  Дэлгэрэнгүй{" "}
                  <svg aria-hidden="true" className="lucide lucide-arrow-right h-4 w-4" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </section>
      <section className="pb-16 sm:pb-20">
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="relative grid gap-10 overflow-hidden rounded-[2rem] bg-ink p-8 text-white sm:p-12 lg:grid-cols-12 lg:items-center lg:gap-12 dark:border dark:border-line dark:bg-surface">
            <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-brand/40 blur-3xl" />
            <div className="pointer-events-none absolute -right-20 -bottom-28 h-72 w-72 rounded-full bg-accent/25 blur-3xl" />
            <div className="relative lg:col-span-7">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">Танай салбарт хэрхэн ажиллахыг үзье</h2>
              <p className="mt-4 max-w-lg text-lg text-white/75">Мэргэжилтэн маань танай үйл ажиллагаанд тохируулан системийг танилцуулна.</p>
              <Link className="inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-colors duration-200 bg-brand text-white shadow-sm shadow-brand/20 hover:bg-brand-strong dark:text-ink h-12 px-6 text-base mt-8" href="/contact">
                Демо захиалах{" "}
                <svg aria-hidden="true" className="lucide lucide-arrow-right h-4 w-4" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </div>
            <CtaContacts />
          </div>
        </div>
      </section>
    </main>
  );
}
