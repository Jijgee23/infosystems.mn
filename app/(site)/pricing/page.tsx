import type { Metadata } from "next";
import Link from "next/link";
import { PrimaryPhone } from "@/components/site/company-links";
import { Phone } from "@/components/site/icons";

export const metadata: Metadata = {
  title: "Үнэ, лиценз — MACS ERP, MACS POS | InfoSystems Mongolia",
  description: "MACS ERP, MACS POS-ийн үнэ, лицензийн нөхцөл. Танай байгууллагад тохирсон үнийн санал авах.",
};

export default function PricingPage() {
  return (
    <main id="main">
      <section className="border-b border-line bg-surface">
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-7xl pt-8 pb-12 sm:pb-14">
          <nav aria-label="Breadcrumb" className="text-sm">
            <ol className="flex flex-wrap items-center gap-1.5 text-fg-subtle">
              <li className="flex items-center gap-1.5">
                <Link className="transition-colors hover:text-brand" href="/">Нүүр</Link>
                <svg aria-hidden="true" className="lucide lucide-chevron-right h-3.5 w-3.5" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </li>
              <li className="flex items-center gap-1.5">
                <span aria-current="page" className="font-medium text-fg-muted">Үнэ, лиценз</span>
              </li>
            </ol>
          </nav>
          <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="mb-3 text-sm font-semibold tracking-wide text-brand uppercase">Үнэ, лиценз</p>
              <h1 className="text-4xl font-extrabold text-fg sm:text-5xl">Үнэ, лиценз</h1>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-fg-muted">Танай байгууллагын хэрэгцээнд тохирсон бүтээгдэхүүн, модулийг сонгон үнийн саналыг бид гаргаж өгнө.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:justify-end">
              <Link className="inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-colors duration-200 bg-brand text-white shadow-sm shadow-brand/20 hover:bg-brand-strong dark:text-ink h-12 px-6 text-base" href="/contact">
                Үнийн санал авах{" "}
                <svg aria-hidden="true" className="lucide lucide-arrow-right h-4 w-4" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="py-14 sm:py-16">
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid gap-10 rounded-[2rem] border border-line bg-surface p-7 sm:p-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              <h2 className="text-3xl font-bold text-fg">Үнийн санал авах</h2>
              <p className="mt-3 leading-relaxed text-fg-muted">Танай байгууллагын хэмжээ, хэрэгцээг сонсоод тохирох бүтээгдэхүүн, модуль болон үнийн саналыг гаргаж өгнө.</p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <Link className="inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-colors duration-200 bg-brand text-white shadow-sm shadow-brand/20 hover:bg-brand-strong dark:text-ink h-12 px-6 text-base" href="/contact">
                  Үнийн санал авах{" "}
                  <svg aria-hidden="true" className="lucide lucide-arrow-right h-4 w-4" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
                <PrimaryPhone className="inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-colors duration-200 border border-line bg-card text-fg hover:border-brand/50 hover:text-brand h-12 px-6 text-base" icon={<Phone className="h-4 w-4" />} />
              </div>
            </div>
            <div className="lg:col-span-7">
              <p className="mb-3 text-xs font-semibold tracking-wider text-fg-subtle uppercase">Үнийн санал авах боломжтой бүтээгдэхүүн</p>
              <ul className="grid gap-2 sm:grid-cols-2">
                <li>
                  <Link className="group flex items-center gap-3 rounded-2xl border border-line bg-card px-4 py-3 transition-colors hover:border-brand/40" href="/contact">
                    <svg aria-hidden="true" className="lucide lucide-layout-grid h-4 w-4 text-fg-subtle group-hover:text-brand" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                      <rect height="7" rx="1" width="7" x="3" y="3" />
                      <rect height="7" rx="1" width="7" x="14" y="3" />
                      <rect height="7" rx="1" width="7" x="14" y="14" />
                      <rect height="7" rx="1" width="7" x="3" y="14" />
                    </svg>
                    <span className="flex-1 font-medium text-fg group-hover:text-brand">MACS ERP</span>
                    <svg aria-hidden="true" className="lucide lucide-arrow-right h-4 w-4 text-fg-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-brand" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </Link>
                </li>
                <li>
                  <Link className="group flex items-center gap-3 rounded-2xl border border-line bg-card px-4 py-3 transition-colors hover:border-brand/40" href="/contact">
                    <svg aria-hidden="true" className="lucide lucide-scan-barcode h-4 w-4 text-fg-subtle group-hover:text-brand" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                      <path d="M8 7v10" />
                      <path d="M12 7v10" />
                      <path d="M17 7v10" />
                    </svg>
                    <span className="flex-1 font-medium text-fg group-hover:text-brand">MACS POS</span>
                    <svg aria-hidden="true" className="lucide lucide-arrow-right h-4 w-4 text-fg-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-brand" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </Link>
                </li>
                <li>
                  <Link className="group flex items-center gap-3 rounded-2xl border border-line bg-card px-4 py-3 transition-colors hover:border-brand/40" href="/contact">
                    <svg aria-hidden="true" className="lucide lucide-folder-kanban h-4 w-4 text-fg-subtle group-hover:text-brand" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
                      <path d="M8 10v4" />
                      <path d="M12 10v2" />
                      <path d="M16 10v6" />
                    </svg>
                    <span className="flex-1 font-medium text-fg group-hover:text-brand">PACS</span>
                    <svg aria-hidden="true" className="lucide lucide-arrow-right h-4 w-4 text-fg-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-brand" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </Link>
                </li>
                <li>
                  <Link className="group flex items-center gap-3 rounded-2xl border border-line bg-card px-4 py-3 transition-colors hover:border-brand/40" href="/contact">
                    <svg aria-hidden="true" className="lucide lucide-calculator h-4 w-4 text-fg-subtle group-hover:text-brand" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
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
                    <span className="flex-1 font-medium text-fg group-hover:text-brand">COST</span>
                    <svg aria-hidden="true" className="lucide lucide-arrow-right h-4 w-4 text-fg-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-brand" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </Link>
                </li>
                <li>
                  <Link className="group flex items-center gap-3 rounded-2xl border border-line bg-card px-4 py-3 transition-colors hover:border-brand/40" href="/contact">
                    <svg aria-hidden="true" className="lucide lucide-truck h-4 w-4 text-fg-subtle group-hover:text-brand" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
                      <path d="M15 18H9" />
                      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
                      <circle cx="17" cy="18" r="2" />
                      <circle cx="7" cy="18" r="2" />
                    </svg>
                    <span className="flex-1 font-medium text-fg group-hover:text-brand">Macs Freight</span>
                    <svg aria-hidden="true" className="lucide lucide-arrow-right h-4 w-4 text-fg-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-brand" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </Link>
                </li>
                <li>
                  <Link className="group flex items-center gap-3 rounded-2xl border border-line bg-card px-4 py-3 transition-colors hover:border-brand/40" href="/contact">
                    <svg aria-hidden="true" className="lucide lucide-clock h-4 w-4 text-fg-subtle group-hover:text-brand" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 6v6l4 2" />
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                    <span className="flex-1 font-medium text-fg group-hover:text-brand">Macs Attendance</span>
                    <svg aria-hidden="true" className="lucide lucide-arrow-right h-4 w-4 text-fg-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-brand" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </Link>
                </li>
                <li>
                  <Link className="group flex items-center gap-3 rounded-2xl border border-line bg-card px-4 py-3 transition-colors hover:border-brand/40" href="/contact">
                    <svg aria-hidden="true" className="lucide lucide-signature h-4 w-4 text-fg-subtle group-hover:text-brand" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                      <path d="m21 17-2.156-1.868A.5.5 0 0 0 18 15.5v.5a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1c0-2.545-3.991-3.97-8.5-4a1 1 0 0 0 0 5c4.153 0 4.745-11.295 5.708-13.5a2.5 2.5 0 1 1 3.31 3.284" />
                      <path d="M3 21h18" />
                    </svg>
                    <span className="flex-1 font-medium text-fg group-hover:text-brand">Contractus</span>
                    <svg aria-hidden="true" className="lucide lucide-arrow-right h-4 w-4 text-fg-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-brand" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
