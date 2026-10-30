import type { Metadata } from "next";
import Link from "next/link";
import { CtaContacts } from "@/components/site/cta-contacts";

export const metadata: Metadata = {
  title: "Захиалгат хөгжүүлэлт | InfoSystems Mongolia",
  description: "Бизнес процессын автоматжуулалт, веб сайт, захиалгат програм, Android болон iOS гар утасны аппликейшн хөгжүүлэлт.",
};

export default function ServicesPage() {
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
                <span aria-current="page" className="font-medium text-fg-muted">Захиалгат хөгжүүлэлт</span>
              </li>
            </ol>
          </nav>
          <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="mb-3 text-sm font-semibold tracking-wide text-brand uppercase">Үйлчилгээ</p>
              <h1 className="text-4xl font-extrabold text-fg sm:text-5xl">Захиалгат хөгжүүлэлт</h1>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-fg-muted">MACS бүтээгдэхүүнээс гадна танай байгууллагын хэрэгцээнд тохирсон програм хангамж, веб сайт, гар утасны апп хөгжүүлнэ.</p>
            </div>
            <div className="lg:col-span-4 lg:text-right">
              <Link className="inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-colors duration-200 bg-brand text-white shadow-sm shadow-brand/20 hover:bg-brand-strong dark:text-ink h-12 px-6 text-base" href="/contact">
                Хүсэлт илгээх{" "}
                <svg aria-hidden="true" className="lucide lucide-arrow-right h-4 w-4" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="py-14 sm:py-20">
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-7xl">
          <ol className="grid gap-px overflow-hidden rounded-[2rem] border border-line bg-line md:grid-cols-2">
            <li className="reveal flex flex-col bg-card p-7 sm:p-10" style={{ "--reveal-delay": "0ms" }}>
              <div className="flex items-start justify-between gap-4">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                  <svg aria-hidden="true" className="lucide lucide-workflow h-6 w-6" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                    <rect height="8" rx="2" width="8" x="3" y="3" />
                    <path d="M7 11v4a2 2 0 0 0 2 2h4" />
                    <rect height="8" rx="2" width="8" x="13" y="13" />
                  </svg>
                </span>
                <span aria-hidden="true" className="font-display text-4xl font-extrabold text-fg-subtle tabular-nums">01</span>
              </div>
              <h2 className="mt-6 text-2xl font-bold text-fg">Бизнес процессын автоматжуулалт</h2>
              <p className="mt-3 leading-relaxed text-fg-muted">Байгууллагын нийт үйл ажиллагааг шаардагдах түвшинд хамруулан бие даасан модулиудыг холбон ажиллуулдаг</p>
            </li>
            <li className="reveal flex flex-col bg-card p-7 sm:p-10" style={{ "--reveal-delay": "80ms" }}>
              <div className="flex items-start justify-between gap-4">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                  <svg aria-hidden="true" className="lucide lucide-globe h-6 w-6" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                    <path d="M2 12h20" />
                  </svg>
                </span>
                <span aria-hidden="true" className="font-display text-4xl font-extrabold text-fg-subtle tabular-nums">02</span>
              </div>
              <h2 className="mt-6 text-2xl font-bold text-fg">Веб сайт хөгжүүлэлт</h2>
              <p className="mt-3 leading-relaxed text-fg-muted">Таны хэрэгцээнд нийцүүлэн, орчин үеийн технологи, график дизайны шийдлийг ашиглан, бүх төрлийн вебсайт, мобайл аппликейш хурдан шуурхай, чанарын өндөр түвшинд бүтээж үйлчилнэ</p>
            </li>
            <li className="reveal flex flex-col bg-card p-7 sm:p-10" style={{ "--reveal-delay": "0ms" }}>
              <div className="flex items-start justify-between gap-4">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                  <svg aria-hidden="true" className="lucide lucide-code-xml h-6 w-6" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="m18 16 4-4-4-4" />
                    <path d="m6 8-4 4 4 4" />
                    <path d="m14.5 4-5 16" />
                  </svg>
                </span>
                <span aria-hidden="true" className="font-display text-4xl font-extrabold text-fg-subtle tabular-nums">03</span>
              </div>
              <h2 className="mt-6 text-2xl font-bold text-fg">Захиалгын програм хөгжүүлэлт</h2>
              <p className="mt-3 leading-relaxed text-fg-muted">Танай байгууллагын хэрэгцээ шаардлагын дагуу веб болон клиент-сервер, мөн хосолсон технологиор өвөрмөц давтагдашгүй програмын шийдлийг хөгжүүлж өгнө</p>
            </li>
            <li className="reveal flex flex-col bg-card p-7 sm:p-10" style={{ "--reveal-delay": "80ms" }}>
              <div className="flex items-start justify-between gap-4">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                  <svg aria-hidden="true" className="lucide lucide-smartphone h-6 w-6" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                    <rect height="20" rx="2" ry="2" width="14" x="5" y="2" />
                    <path d="M12 18h.01" />
                  </svg>
                </span>
                <span aria-hidden="true" className="font-display text-4xl font-extrabold text-fg-subtle tabular-nums">04</span>
              </div>
              <h2 className="mt-6 text-2xl font-bold text-fg">Гар утасны аппликейшн</h2>
              <p className="mt-3 leading-relaxed text-fg-muted">Android болон iOS үйлдлийн системтэй гар утсанд ажиллах төрөл бүрийн мобайл апп зохиож байна. Танд хэрэгцээтэй байгаа програмын шийдлийн талаар бидэнд хандана уу</p>
            </li>
          </ol>
        </div>
      </section>
      <section className="pb-16 sm:pb-20">
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="relative grid gap-10 overflow-hidden rounded-[2rem] bg-ink p-8 text-white sm:p-12 lg:grid-cols-12 lg:items-center lg:gap-12 dark:border dark:border-line dark:bg-surface">
            <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-brand/40 blur-3xl" />
            <div className="pointer-events-none absolute -right-20 -bottom-28 h-72 w-72 rounded-full bg-accent/25 blur-3xl" />
            <div className="relative lg:col-span-7">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">Төслөө ярилцъя</h2>
              <p className="mt-4 max-w-lg text-lg text-white/75">Танай хэрэгцээг сонсоод тохирох шийдэл, хугацаа, үнийн саналыг гаргаж өгнө.</p>
              <Link className="inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-colors duration-200 bg-brand text-white shadow-sm shadow-brand/20 hover:bg-brand-strong dark:text-ink h-12 px-6 text-base mt-8" href="/contact">
                Хүсэлт илгээх{" "}
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
