import type { Metadata } from "next";
import Link from "next/link";
import { HomeGuides } from "@/components/site/home-guides";
import { HomeNews } from "@/components/site/home-news";
import { HomeProducts } from "@/components/site/home-products";
import { CaseStudies, ClientLogos, Testimonials, TrustBar } from "@/components/site/trust";
import { CtaContacts } from "@/components/site/cta-contacts";

export const metadata: Metadata = {
  title: "Санхүү, бүртгэлийн програм хангамж — 1998 оноос | InfoSystems Mongolia",
  description: "MACS ERP нь Сангийн яамны тусгай зөвшөөрөлтэй санхүүгийн бүртгэлийн иж бүрэн програм. Нягтлан бодох бүртгэл, бараа материал, цалин, кассын системээ нэг дор удирдаарай.",
};

export default function HomePage() {
  return (
    <main id="main">
      <section className="relative overflow-hidden">
        <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_70%_20%,black_25%,transparent_65%)]" />
        <div className="pointer-events-none absolute -top-48 right-[-10%] h-[560px] w-[760px] rounded-full bg-brand/12 blur-3xl" />
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-7xl relative grid items-center gap-10 pt-10 pb-12 sm:pt-14 lg:grid-cols-12 lg:gap-12 lg:pt-20 lg:pb-16">
          <div className="lg:col-span-6">
            <h1 className="text-4xl leading-[1.08] font-extrabold text-fg sm:text-5xl lg:text-[3.1rem] xl:text-[3.4rem]">
              Санхүү, бүртгэлээ{" "}
              <span className="bg-gradient-to-r from-brand to-accent bg-clip-text text-transparent">нэг системээр</span>
              {" "}удирдаарай
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-fg-muted">MACS ERP нь нягтлан бодох бүртгэл, бараа материал, цалин, кассын үйл ажиллагааг нэгтгэдэг. Цаг хугацаа, зардлаа хэмнэж, удирдлагын шийдвэрт хэрэгтэй мэдээллийг бодит хугацаанд аваарай.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link className="inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-colors duration-200 bg-brand text-white shadow-sm shadow-brand/20 hover:bg-brand-strong dark:text-ink h-12 px-6 text-base" href="/contact">
                Демо захиалах
                <svg aria-hidden="true" className="lucide lucide-arrow-right h-4 w-4" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
              <a className="inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-colors duration-200 border border-line bg-card text-fg hover:border-brand/50 hover:text-brand h-12 px-6 text-base" href="#products">Бүтээгдэхүүн үзэх</a>
            </div>
          </div>
          <div className="min-w-0 lg:col-span-6">
            <div className="rounded-[1.4rem] border border-line bg-card p-1.5 shadow-2xl shadow-ink/[0.08]">
              <div className="flex items-center gap-1.5 px-3 py-2">
                <span className="h-2.5 w-2.5 rounded-full bg-line" />
                <span className="h-2.5 w-2.5 rounded-full bg-line" />
                <span className="h-2.5 w-2.5 rounded-full bg-line" />
                <span className="ml-3 text-xs font-semibold text-fg-subtle">MACS ERP</span>
              </div>
              <div className="relative overflow-hidden rounded-2xl bg-surface">
                <div aria-label="MACS ERP програмын үндсэн дэлгэц" role="img">
                  <div className="grid grid-cols-12 gap-2 p-2">
                    <div className="col-span-4 hidden rounded-xl bg-card p-2.5 sm:block">
                      <div className="mb-1 truncate rounded-lg px-2.5 py-2 text-[11px] font-medium bg-brand text-white dark:text-ink">Ерөнхий журнал</div>
                      <div className="mb-1 truncate rounded-lg px-2.5 py-2 text-[11px] font-medium text-fg-muted">Касс, харилцах</div>
                      <div className="mb-1 truncate rounded-lg px-2.5 py-2 text-[11px] font-medium text-fg-muted">Бараа материал</div>
                      <div className="mb-1 truncate rounded-lg px-2.5 py-2 text-[11px] font-medium text-fg-muted">Хүний нөөц, цалин</div>
                      <div className="mb-1 truncate rounded-lg px-2.5 py-2 text-[11px] font-medium text-fg-muted">Тайлан</div>
                    </div>
                    <div className="col-span-12 space-y-2 sm:col-span-8">
                      <div className="grid grid-cols-3 gap-2">
                        <div className="rounded-xl bg-card p-3">
                          <p className="truncate text-[10px] font-medium text-fg-subtle">Мөнгөн хөрөнгө</p>
                          <div className="mt-2 h-2.5 w-3/4 rounded-full bg-fg/15" />
                          <div className="mt-2 h-1.5 rounded-full w-2/5 bg-brand" />
                        </div>
                        <div className="rounded-xl bg-card p-3">
                          <p className="truncate text-[10px] font-medium text-fg-subtle">Борлуулалт</p>
                          <div className="mt-2 h-2.5 w-3/4 rounded-full bg-fg/15" />
                          <div className="mt-2 h-1.5 rounded-full w-1/2 bg-accent" />
                        </div>
                        <div className="rounded-xl bg-card p-3">
                          <p className="truncate text-[10px] font-medium text-fg-subtle">Бараа материал</p>
                          <div className="mt-2 h-2.5 w-3/4 rounded-full bg-fg/15" />
                          <div className="mt-2 h-1.5 rounded-full w-2/5 bg-brand" />
                        </div>
                      </div>
                      <div className="rounded-xl bg-card p-4">
                        <p className="text-[11px] font-semibold text-fg-muted">Орлого, зарлага</p>
                        <div className="mt-4 flex h-28 items-end gap-1.5 sm:h-36">
                          <div className="flex-1 rounded-t-md bg-brand" style={{ height: "38%", opacity: "0.3" }} />
                          <div className="flex-1 rounded-t-md bg-brand" style={{ height: "52%", opacity: "0.36" }} />
                          <div className="flex-1 rounded-t-md bg-brand" style={{ height: "45%", opacity: "0.42" }} />
                          <div className="flex-1 rounded-t-md bg-brand" style={{ height: "64%", opacity: "0.48" }} />
                          <div className="flex-1 rounded-t-md bg-brand" style={{ height: "58%", opacity: "0.54" }} />
                          <div className="flex-1 rounded-t-md bg-brand" style={{ height: "72%", opacity: "0.6" }} />
                          <div className="flex-1 rounded-t-md bg-brand" style={{ height: "66%", opacity: "0.6599999999999999" }} />
                          <div className="flex-1 rounded-t-md bg-brand" style={{ height: "80%", opacity: "0.72" }} />
                          <div className="flex-1 rounded-t-md bg-brand" style={{ height: "74%", opacity: "0.78" }} />
                          <div className="flex-1 rounded-t-md bg-brand" style={{ height: "88%", opacity: "0.8400000000000001" }} />
                          <div className="flex-1 rounded-t-md bg-brand" style={{ height: "82%", opacity: "0.8999999999999999" }} />
                          <div className="flex-1 rounded-t-md bg-brand" style={{ height: "94%", opacity: "0.96" }} />
                        </div>
                      </div>
                      <div className="space-y-2 rounded-xl bg-card p-3">
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-16 rounded-full bg-fg/10" />
                          <div className="h-2 flex-1 rounded-full bg-fg/5" />
                          <div className="h-2 w-10 rounded-full bg-fg/15" />
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-16 rounded-full bg-fg/10" />
                          <div className="h-2 flex-1 rounded-full bg-fg/5" />
                          <div className="h-2 w-10 rounded-full bg-fg/15" />
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-16 rounded-full bg-fg/10" />
                          <div className="h-2 flex-1 rounded-full bg-fg/5" />
                          <div className="h-2 w-10 rounded-full bg-fg/15" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <TrustBar />
      <ClientLogos />
      <section className="scroll-mt-20 py-16 sm:py-20" id="products">
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-xl">
              <h2 className="text-3xl font-bold text-fg sm:text-4xl">Бүтээгдэхүүн</h2>
              <p className="mt-3 text-lg text-fg-muted">Бие даасан модулиудыг холбон, байгууллагынхаа үйл ажиллагааг шаардлагатай түвшинд хамруулна.</p>
            </div>
            <Link className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-brand hover:gap-2.5 transition-all" href="/products">
              Бүх бүтээгдэхүүн{" "}
              <svg aria-hidden="true" className="lucide lucide-arrow-right h-4 w-4" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
          <HomeProducts />
        </div>
      </section>
      <section className="bg-surface py-16 sm:py-20">
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="mb-3 text-sm font-semibold tracking-wide text-brand uppercase">Яагаад MACS гэж?</p>
              <h2 className="text-3xl font-bold text-fg sm:text-4xl">Хууль, зах зээлийн өөрчлөлттэй хамт шинэчлэгддэг</h2>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-fg-muted">Зах зээл, эрх зүйн орчны өөрчлөлт, харилцагчдынхаа хэрэгцээг тусган MACS-ийг байнга сайжруулдаг.</p>
            </div>
          </div>
          <div className="mt-10 space-y-12 sm:mt-14 sm:space-y-20">
            <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
              <div className="reveal hidden lg:block" style={{ "--reveal-delay": "0ms" }}>
                <div className="rounded-[1.4rem] border border-line bg-card p-1.5 shadow-2xl shadow-ink/[0.08]">
                  <div className="flex items-center gap-1.5 px-3 py-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-line" />
                    <span className="h-2.5 w-2.5 rounded-full bg-line" />
                    <span className="h-2.5 w-2.5 rounded-full bg-line" />
                  </div>
                  <div className="relative overflow-hidden rounded-2xl bg-surface">
                    <div aria-label="Мэдээлэл тань найдвартай, хамгаалагдсан" role="img">
                      <div className="space-y-2 p-4 sm:p-6">
                        <div className="flex items-center gap-3 rounded-xl bg-card p-3">
                          <span className="h-8 w-8 shrink-0 rounded-full bg-brand-soft" />
                          <span className="h-2 w-20 rounded-full bg-fg/15" />
                          <span className="ml-auto flex gap-2">
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-accent text-white dark:text-ink">
                              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 16 16">
                                <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </span>
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-accent text-white dark:text-ink">
                              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 16 16">
                                <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </span>
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-accent text-white dark:text-ink">
                              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 16 16">
                                <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </span>
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-accent text-white dark:text-ink">
                              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 16 16">
                                <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center gap-3 rounded-xl bg-card p-3">
                          <span className="h-8 w-8 shrink-0 rounded-full bg-brand-soft" />
                          <span className="h-2 w-20 rounded-full bg-fg/15" />
                          <span className="ml-auto flex gap-2">
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-accent text-white dark:text-ink">
                              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 16 16">
                                <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </span>
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-accent text-white dark:text-ink">
                              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 16 16">
                                <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </span>
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-line bg-surface" />
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-accent text-white dark:text-ink">
                              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 16 16">
                                <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center gap-3 rounded-xl bg-card p-3">
                          <span className="h-8 w-8 shrink-0 rounded-full bg-brand-soft" />
                          <span className="h-2 w-20 rounded-full bg-fg/15" />
                          <span className="ml-auto flex gap-2">
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-accent text-white dark:text-ink">
                              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 16 16">
                                <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </span>
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-line bg-surface" />
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-line bg-surface" />
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-accent text-white dark:text-ink">
                              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 16 16">
                                <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center gap-3 rounded-xl bg-card p-3">
                          <span className="h-8 w-8 shrink-0 rounded-full bg-brand-soft" />
                          <span className="h-2 w-20 rounded-full bg-fg/15" />
                          <span className="ml-auto flex gap-2">
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-line bg-surface" />
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-accent text-white dark:text-ink">
                              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 16 16">
                                <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </span>
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-line bg-surface" />
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-line bg-surface" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="reveal" style={{ "--reveal-delay": "100ms" }}>
                <span className="font-display text-sm font-bold text-brand tabular-nums">01</span>
                <h3 className="mt-2 text-2xl font-bold text-fg sm:text-3xl">Мэдээлэл тань найдвартай, хамгаалагдсан</h3>
                <dl className="mt-6 space-y-5">
                  <div className="border-l-2 border-brand/30 pl-4">
                    <dt className="font-semibold text-fg">Найдвартай ажиллагаа</dt>
                    <dd className="mt-1 leading-relaxed text-fg-muted">Цахилгааны доголдлоос үүсэх индекс файлын гэмтэл, мэдээлэл алдагдах эрсдэлээс хамгаална. Өгөгдлийн сан оновчтой, боловсруулалт хурдан.</dd>
                  </div>
                  <div className="border-l-2 border-brand/30 pl-4">
                    <dt className="font-semibold text-fg">Нарийн эрхийн тохиргоо</dt>
                    <dd className="mt-1 leading-relaxed text-fg-muted">Хэрэглэгчийн эрхийг цэс бүрээр, салбараар, бараа материалын дансаар тусгаарлана. Гүйлгээ бүрийг хэн хийснийг автоматаар хадгална.</dd>
                  </div>
                </dl>
              </div>
            </div>
            <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
              <div className="reveal hidden lg:block lg:order-2" style={{ "--reveal-delay": "0ms" }}>
                <div className="rounded-[1.4rem] border border-line bg-card p-1.5 shadow-2xl shadow-ink/[0.08]">
                  <div className="flex items-center gap-1.5 px-3 py-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-line" />
                    <span className="h-2.5 w-2.5 rounded-full bg-line" />
                    <span className="h-2.5 w-2.5 rounded-full bg-line" />
                  </div>
                  <div className="relative overflow-hidden rounded-2xl bg-surface">
                    <div aria-label="Санхүүгийн байдлаа хүссэн үедээ хар" role="img">
                      <div className="space-y-3 p-4 sm:p-6">
                        <div className="flex gap-2">
                          <span className="rounded-full px-3 py-1 text-[11px] font-semibold bg-brand text-white dark:text-ink">MNT</span>
                          <span className="rounded-full px-3 py-1 text-[11px] font-semibold bg-card text-fg-muted">USD</span>
                          <span className="rounded-full px-3 py-1 text-[11px] font-semibold bg-card text-fg-muted">CNY</span>
                          <span className="rounded-full px-3 py-1 text-[11px] font-semibold bg-card text-fg-muted">EUR</span>
                        </div>
                        <div className="rounded-xl bg-card p-4">
                          <svg aria-hidden="true" className="h-36 w-full" preserveAspectRatio="none" viewBox="0 0 300 120">
                            <defs>
                              <linearGradient id="mon-fill" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0" stopColor="var(--brand)" stopOpacity="0.25" />
                                <stop offset="1" stopColor="var(--brand)" stopOpacity="0" />
                              </linearGradient>
                            </defs>
                            <path d="M0 95 C30 90 45 70 75 72 S120 50 150 55 S200 30 230 34 S275 18 300 12 V120 H0Z" fill="url(#mon-fill)" />
                            <path d="M0 95 C30 90 45 70 75 72 S120 50 150 55 S200 30 230 34 S275 18 300 12" fill="none" stroke="var(--brand)" strokeWidth="3" />
                            <path d="M0 105 C40 100 70 92 110 94 S180 80 220 82 S270 70 300 66" fill="none" stroke="var(--accent)" strokeDasharray="5 5" strokeWidth="2.5" />
                          </svg>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="rounded-xl bg-card p-3">
                            <div className="h-2 w-12 rounded-full bg-fg/10" />
                            <div className="mt-2 h-3 w-20 rounded-full bg-fg/20" />
                          </div>
                          <div className="rounded-xl bg-card p-3">
                            <div className="h-2 w-12 rounded-full bg-fg/10" />
                            <div className="mt-2 h-3 w-20 rounded-full bg-fg/20" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="reveal lg:order-1" style={{ "--reveal-delay": "100ms" }}>
                <span className="font-display text-sm font-bold text-brand tabular-nums">02</span>
                <h3 className="mt-2 text-2xl font-bold text-fg sm:text-3xl">Санхүүгийн байдлаа хүссэн үедээ хар</h3>
                <dl className="mt-6 space-y-5">
                  <div className="border-l-2 border-brand/30 pl-4">
                    <dt className="font-semibold text-fg">Бодит хугацааны хяналт</dt>
                    <dd className="mt-1 leading-relaxed text-fg-muted">Удирдлага, эрх бүхий ажилтнууд санхүүгийн байдлыг өөрсдөө, цаг тухай бүрт нь хянана.</dd>
                  </div>
                  <div className="border-l-2 border-brand/30 pl-4">
                    <dt className="font-semibold text-fg">Олон валют</dt>
                    <dd className="mt-1 leading-relaxed text-fg-muted">Ханш бүртгэж, ханшийн тэгшитгэл хийнэ. Валютын болон төгрөгийн дүн баримт дээр зэрэгцэн харагдана.</dd>
                  </div>
                </dl>
              </div>
            </div>
            <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
              <div className="reveal hidden lg:block" style={{ "--reveal-delay": "0ms" }}>
                <div className="rounded-[1.4rem] border border-line bg-card p-1.5 shadow-2xl shadow-ink/[0.08]">
                  <div className="flex items-center gap-1.5 px-3 py-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-line" />
                    <span className="h-2.5 w-2.5 rounded-full bg-line" />
                    <span className="h-2.5 w-2.5 rounded-full bg-line" />
                  </div>
                  <div className="relative overflow-hidden rounded-2xl bg-surface">
                    <div aria-label="Өдөр тутмын ажлаа хурдасга" role="img">
                      <div className="p-4 sm:p-6">
                        <div className="overflow-hidden rounded-xl bg-card">
                          <div className="flex items-center gap-2 border-b border-line px-3 py-2">
                            <span className="rounded-md bg-[#1d6f42] px-1.5 py-0.5 text-[10px] font-bold text-white">XLSX</span>
                            <span className="h-2 w-24 rounded-full bg-fg/10" />
                            <span className="ml-auto h-6 w-16 rounded-full bg-brand" />
                          </div>
                          <div className="grid grid-cols-[2.5rem_1fr_4rem_4rem] items-center gap-3 border-b border-line/60 px-3 py-2.5 last:border-0">
                            <span aria-hidden="true" className="flex h-5 items-end gap-[2px]">
                              <span className="h-full bg-fg/40" style={{ width: "3px" }} />
                              <span className="h-full bg-fg/40" style={{ width: "1px" }} />
                              <span className="h-full bg-fg/40" style={{ width: "2px" }} />
                              <span className="h-full bg-fg/40" style={{ width: "1px" }} />
                              <span className="h-full bg-fg/40" style={{ width: "3px" }} />
                              <span className="h-full bg-fg/40" style={{ width: "2px" }} />
                              <span className="h-full bg-fg/40" style={{ width: "1px" }} />
                            </span>
                            <span className="h-2 rounded-full bg-fg/10" style={{ width: "60%" }} />
                            <span className="h-2 rounded-full bg-fg/15" />
                            <span className="h-2 rounded-full bg-accent/70" />
                          </div>
                          <div className="grid grid-cols-[2.5rem_1fr_4rem_4rem] items-center gap-3 border-b border-line/60 px-3 py-2.5 last:border-0">
                            <span aria-hidden="true" className="flex h-5 items-end gap-[2px]">
                              <span className="h-full bg-fg/40" style={{ width: "3px" }} />
                              <span className="h-full bg-fg/40" style={{ width: "1px" }} />
                              <span className="h-full bg-fg/40" style={{ width: "2px" }} />
                              <span className="h-full bg-fg/40" style={{ width: "1px" }} />
                              <span className="h-full bg-fg/40" style={{ width: "3px" }} />
                              <span className="h-full bg-fg/40" style={{ width: "2px" }} />
                              <span className="h-full bg-fg/40" style={{ width: "1px" }} />
                            </span>
                            <span className="h-2 rounded-full bg-fg/10" style={{ width: "73%" }} />
                            <span className="h-2 rounded-full bg-fg/15" />
                            <span className="h-2 rounded-full bg-fg/15" />
                          </div>
                          <div className="grid grid-cols-[2.5rem_1fr_4rem_4rem] items-center gap-3 border-b border-line/60 px-3 py-2.5 last:border-0">
                            <span aria-hidden="true" className="flex h-5 items-end gap-[2px]">
                              <span className="h-full bg-fg/40" style={{ width: "3px" }} />
                              <span className="h-full bg-fg/40" style={{ width: "1px" }} />
                              <span className="h-full bg-fg/40" style={{ width: "2px" }} />
                              <span className="h-full bg-fg/40" style={{ width: "1px" }} />
                              <span className="h-full bg-fg/40" style={{ width: "3px" }} />
                              <span className="h-full bg-fg/40" style={{ width: "2px" }} />
                              <span className="h-full bg-fg/40" style={{ width: "1px" }} />
                            </span>
                            <span className="h-2 rounded-full bg-fg/10" style={{ width: "86%" }} />
                            <span className="h-2 rounded-full bg-fg/15" />
                            <span className="h-2 rounded-full bg-fg/15" />
                          </div>
                          <div className="grid grid-cols-[2.5rem_1fr_4rem_4rem] items-center gap-3 border-b border-line/60 px-3 py-2.5 last:border-0">
                            <span aria-hidden="true" className="flex h-5 items-end gap-[2px]">
                              <span className="h-full bg-fg/40" style={{ width: "3px" }} />
                              <span className="h-full bg-fg/40" style={{ width: "1px" }} />
                              <span className="h-full bg-fg/40" style={{ width: "2px" }} />
                              <span className="h-full bg-fg/40" style={{ width: "1px" }} />
                              <span className="h-full bg-fg/40" style={{ width: "3px" }} />
                              <span className="h-full bg-fg/40" style={{ width: "2px" }} />
                              <span className="h-full bg-fg/40" style={{ width: "1px" }} />
                            </span>
                            <span className="h-2 rounded-full bg-fg/10" style={{ width: "64%" }} />
                            <span className="h-2 rounded-full bg-fg/15" />
                            <span className="h-2 rounded-full bg-accent/70" />
                          </div>
                          <div className="grid grid-cols-[2.5rem_1fr_4rem_4rem] items-center gap-3 border-b border-line/60 px-3 py-2.5 last:border-0">
                            <span aria-hidden="true" className="flex h-5 items-end gap-[2px]">
                              <span className="h-full bg-fg/40" style={{ width: "3px" }} />
                              <span className="h-full bg-fg/40" style={{ width: "1px" }} />
                              <span className="h-full bg-fg/40" style={{ width: "2px" }} />
                              <span className="h-full bg-fg/40" style={{ width: "1px" }} />
                              <span className="h-full bg-fg/40" style={{ width: "3px" }} />
                              <span className="h-full bg-fg/40" style={{ width: "2px" }} />
                              <span className="h-full bg-fg/40" style={{ width: "1px" }} />
                            </span>
                            <span className="h-2 rounded-full bg-fg/10" style={{ width: "77%" }} />
                            <span className="h-2 rounded-full bg-fg/15" />
                            <span className="h-2 rounded-full bg-fg/15" />
                          </div>
                          <div className="grid grid-cols-[2.5rem_1fr_4rem_4rem] items-center gap-3 border-b border-line/60 px-3 py-2.5 last:border-0">
                            <span aria-hidden="true" className="flex h-5 items-end gap-[2px]">
                              <span className="h-full bg-fg/40" style={{ width: "3px" }} />
                              <span className="h-full bg-fg/40" style={{ width: "1px" }} />
                              <span className="h-full bg-fg/40" style={{ width: "2px" }} />
                              <span className="h-full bg-fg/40" style={{ width: "1px" }} />
                              <span className="h-full bg-fg/40" style={{ width: "3px" }} />
                              <span className="h-full bg-fg/40" style={{ width: "2px" }} />
                              <span className="h-full bg-fg/40" style={{ width: "1px" }} />
                            </span>
                            <span className="h-2 rounded-full bg-fg/10" style={{ width: "90%" }} />
                            <span className="h-2 rounded-full bg-fg/15" />
                            <span className="h-2 rounded-full bg-fg/15" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="reveal" style={{ "--reveal-delay": "100ms" }}>
                <span className="font-display text-sm font-bold text-brand tabular-nums">03</span>
                <h3 className="mt-2 text-2xl font-bold text-fg sm:text-3xl">Өдөр тутмын ажлаа хурдасга</h3>
                <dl className="mt-6 space-y-5">
                  <div className="border-l-2 border-brand/30 pl-4">
                    <dt className="font-semibold text-fg">Excel импорт, экспорт</dt>
                    <dd className="mt-1 leading-relaxed text-fg-muted">Касс, харилцахын баримт, банкны хуулга, барааны үлдэгдлийг Excel-ээс оруулж, тайлангаа Excel рүү гаргана.</dd>
                  </div>
                  <div className="border-l-2 border-brand/30 pl-4">
                    <dt className="font-semibold text-fg">Баркод, өртөг тооцоо</dt>
                    <dd className="mt-1 leading-relaxed text-fg-muted">Нэг бараанд олон баркод бүртгэнэ. Бараа тус бүрийн өртөг, зардал, ашгийг тооцоолж харуулна.</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 sm:py-20">
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-7xl grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <p className="mb-3 text-sm font-semibold tracking-wide text-brand uppercase">Зөвлөгөө, заавар</p>
            <h2 className="text-3xl font-bold text-fg">MACS-ийг илүү үр дүнтэй ашиглах</h2>
            <p className="mt-3 leading-relaxed text-fg-muted">Цалин, НДШ, үндсэн хөрөнгө зэрэг өдөр тутмын ажлын алхам алхмаар заавар.</p>
            <Link className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-all hover:gap-2.5" href="/support/guides">
              Бүх заавар{" "}
              <svg aria-hidden="true" className="lucide lucide-arrow-right h-4 w-4" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
          <HomeGuides />
        </div>
      </section>
      <HomeNews />
      <Testimonials className="border-t border-line py-16 sm:py-20" />
      <CaseStudies className="pb-16 sm:pb-20" />
      <section className="pb-16 sm:pb-20">
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="relative grid gap-10 overflow-hidden rounded-[2rem] bg-ink p-8 text-white sm:p-12 lg:grid-cols-12 lg:items-center lg:gap-12 dark:border dark:border-line dark:bg-surface">
            <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-brand/40 blur-3xl" />
            <div className="pointer-events-none absolute -right-20 -bottom-28 h-72 w-72 rounded-full bg-accent/25 blur-3xl" />
            <div className="relative lg:col-span-7">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">MACS танай байгууллагад хэрхэн ажиллахыг үзээрэй</h2>
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
