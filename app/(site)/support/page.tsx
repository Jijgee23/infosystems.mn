import type { Metadata } from "next";
import Link from "next/link";
import { CompanyEmail, PhoneLinks } from "@/components/site/company-links";
import { Mail } from "@/components/site/icons";
import { JsonLd } from "@/components/site/json-ld";

export const metadata: Metadata = {
  title: "Тусламж — MACS заавар, алсын тусламж | InfoSystems Mongolia",
  description: "MACS ERP, MACS POS-ийн видео заавар, гарын авлага, алсын тусламж болон түгээмэл асуултын хариулт.",
};

/** The questions below, as plain text for the FAQPage structured data. Keep in sync with the markup. */
const FAQ = [
  {
    q: "Алсаас тусламж хэрхэн авах вэ?",
    a: "AnyDesk эсвэл TeamViewer програмыг суулгаад, гарч ирэх ID болон нууц үгээ манай инженерт хэлнэ. Дэлгэрэнгүйг AnyDesk, TeamViewer заавраас үзнэ үү. Инженер ажиллаж байх үед компьютероо унтраахгүй, давхар оролдлого хийхгүй байхыг анхаарна уу."
  },
  {
    q: "Хэрэглэгч бүрт тусдаа эрх өгч болох уу?",
    a: "Болно. Хэрэглэгч бүр өөрийн нэвтрэх нэр, нууц үгтэй байх ба цэс, данс, салбараар эрхийг нь хязгаарлаж болно. Эрхийг зөвхөн Admin эрхтэй хэрэглэгч тохируулна. Заавар үзэх"
  },
  {
    q: "Өмнөх үеийн гүйлгээг санамсаргүй өөрчлөхөөс яаж хамгаалах вэ?",
    a: "«Компани мэдээлэл» цонхонд Нууцлах огноо эсвэл Өндөрлөх огноо тавина. Тухайн огнооноос өмнөх гүйлгээг засах, устгах боломжгүй болно. Салбар болон данс тус бүрт өөр огноо тавьж болно. Заавар үзэх"
  },
  {
    q: "Excel-ээс мэдээлэл оруулж болох уу?",
    a: "Болно. Касс, харилцахын орлого, зарлагын баримт, банкны хуулга, барааны эхний үлдэгдэл, орлого, зарлага болон харилцагчдын мэдээллийг Excel-ээс оруулж, тайлангаа Excel рүү гаргана."
  },
  {
    q: "MACS POS-ийг MACS ERP-гүйгээр ашиглаж болох уу?",
    a: "Болно. MACS POS дангаараа ажиллах боломжтой. MACS ERP-тэй холбосон үед кассаар хийсэн борлуулалт санхүүгийн програм руу борлуулалтын падаан болж автоматаар орно."
  },
  {
    q: "Гадаад валютаар гүйлгээ хийж болох уу?",
    a: "Болно. Валютаа бүртгээд «авто» ханш сонговол гүйлгээ хийхэд тухайн өдрийн ханш автоматаар гарна. Ханшийн тэгшитгэл хийж, баримт дээр валютын болон төгрөгийн дүн зэрэгцэн харагдана. Заавар үзэх"
  },
  {
    q: "Хэн, хэзээ гүйлгээ зассаныг харж болох уу?",
    a: "Болно. «Гүйлгээний түүх»-ээс засагдсан, устгагдсан, шинээр үүссэн гүйлгээг хэрэглэгч болон компьютерын нэрээр харна. Зөвхөн Admin эрхтэй хэрэглэгч харах боломжтой. Заавар үзэх"
  }
];

export default function SupportPage() {
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
                <span aria-current="page" className="font-medium text-fg-muted">Тусламж</span>
              </li>
            </ol>
          </nav>
          <div className="mt-8 max-w-3xl">
            <h1 className="text-4xl font-extrabold text-fg sm:text-5xl">Тусламж</h1>
            <p className="mt-4 text-lg leading-relaxed text-fg-muted">MACS-ийг ашиглахад тань туслах заавар, видео, алсын тусламж болон түгээмэл асуултын хариулт.</p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <Link className="group rounded-3xl border border-line bg-card p-6 transition-colors hover:border-brand/40" href="/support/guides">
              <svg aria-hidden="true" className="lucide lucide-book-open h-6 w-6 text-brand" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 7v14" />
                <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
              </svg>
              <p className="mt-4 font-display text-lg font-bold text-fg group-hover:text-brand">Заавар, гарын авлага</p>
              <p className="mt-1 text-sm text-fg-muted">16 заавар</p>
            </Link>
            <Link className="group rounded-3xl border border-line bg-card p-6 transition-colors hover:border-brand/40" href="/support/downloads">
              <svg aria-hidden="true" className="lucide lucide-download h-6 w-6 text-brand" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15V3" />
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <path d="m7 10 5 5 5-5" />
              </svg>
              <p className="mt-4 font-display text-lg font-bold text-fg group-hover:text-brand">Програм татах</p>
              <p className="mt-1 text-sm text-fg-muted">Алсын тусламжийн болон бусад туслах програмууд.</p>
            </Link>
            <div className="rounded-3xl bg-ink p-6 text-white dark:border dark:border-line dark:bg-card">
              <svg aria-hidden="true" className="lucide lucide-phone h-6 w-6 text-accent" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
              </svg>
              <p className="mt-4 font-display text-lg font-bold">Утсаар</p>
              <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
                <PhoneLinks className="font-semibold text-white hover:text-accent" />
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-14 sm:py-16">
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-3xl font-bold text-fg">Заавар, гарын авлага</h2>
              <p className="mt-2 text-fg-muted">MACS-ийн цэс бүрийг алхам алхмаар, видеотой тайлбарласан заавар.</p>
            </div>
            <Link className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-brand" href="/support/guides">
              Бүх заавар{" "}
              <svg aria-hidden="true" className="lucide lucide-arrow-right h-4 w-4" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-line bg-card p-6">
              <div className="flex items-center justify-between gap-3">
                <Link className="font-display text-lg font-bold text-fg hover:text-brand" href="/support/guides#general">Гарын авлага — Ерөнхий цэс</Link>
                <span className="rounded-full bg-surface px-2.5 py-0.5 text-xs tabular-nums text-fg-subtle">8</span>
              </div>
              <ul className="mt-3 space-y-1">
                <li>
                  <Link className="flex items-center gap-2 py-1 text-sm text-fg-muted hover:text-brand" href="/support/guides/company-info">
                    <svg aria-hidden="true" className="lucide lucide-arrow-right h-3.5 w-3.5 shrink-0 text-fg-subtle" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                    {" "}Компани мэдээлэл
                  </Link>
                </li>
                <li>
                  <Link className="flex items-center gap-2 py-1 text-sm text-fg-muted hover:text-brand" href="/support/guides/user-permissions">
                    <svg aria-hidden="true" className="lucide lucide-arrow-right h-3.5 w-3.5 shrink-0 text-fg-subtle" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                    {" "}Хэрэглэгчийн эрх нэмэх, засах, өөрчлөх
                  </Link>
                </li>
                <li>
                  <Link className="flex items-center gap-2 py-1 text-sm text-fg-muted hover:text-brand" href="/support/guides/reference-data">
                    <svg aria-hidden="true" className="lucide lucide-arrow-right h-3.5 w-3.5 shrink-0 text-fg-subtle" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                    {" "}Лавлах мэдээллүүд
                  </Link>
                </li>
                <li>
                  <Link className="flex items-center gap-2 py-1 text-sm text-fg-muted hover:text-brand" href="/support/guides/customers">
                    <svg aria-hidden="true" className="lucide lucide-arrow-right h-3.5 w-3.5 shrink-0 text-fg-subtle" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                    {" "}Харилцагчдын мэдээлэл нэмэх, засах, өөрчлөх, эксэлээс татах
                  </Link>
                </li>
              </ul>
            </div>
            <div className="rounded-3xl border border-line bg-card p-6">
              <div className="flex items-center justify-between gap-3">
                <Link className="font-display text-lg font-bold text-fg hover:text-brand" href="/support/guides#hr-payroll">Цалин, хүний нөөц</Link>
                <span className="rounded-full bg-surface px-2.5 py-0.5 text-xs tabular-nums text-fg-subtle">5</span>
              </div>
              <ul className="mt-3 space-y-1">
                <li>
                  <Link className="flex items-center gap-2 py-1 text-sm text-fg-muted hover:text-brand" href="/support/guides/employee-profile">
                    <svg aria-hidden="true" className="lucide lucide-arrow-right h-3.5 w-3.5 shrink-0 text-fg-subtle" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                    {" "}Ажилтны анкет бүртгэх
                  </Link>
                </li>
                <li>
                  <Link className="flex items-center gap-2 py-1 text-sm text-fg-muted hover:text-brand" href="/support/guides/payroll-calculation">
                    <svg aria-hidden="true" className="lucide lucide-arrow-right h-3.5 w-3.5 shrink-0 text-fg-subtle" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                    {" "}Цалин бодох
                  </Link>
                </li>
                <li>
                  <Link className="flex items-center gap-2 py-1 text-sm text-fg-muted hover:text-brand" href="/support/guides/vacation-pay">
                    <svg aria-hidden="true" className="lucide lucide-arrow-right h-3.5 w-3.5 shrink-0 text-fg-subtle" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                    {" "}Амралт бодох
                  </Link>
                </li>
                <li>
                  <Link className="flex items-center gap-2 py-1 text-sm text-fg-muted hover:text-brand" href="/support/guides/payroll-email">
                    <svg aria-hidden="true" className="lucide lucide-arrow-right h-3.5 w-3.5 shrink-0 text-fg-subtle" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                    {" "}Цалингийн мэйл илгээх
                  </Link>
                </li>
              </ul>
            </div>
            <div className="rounded-3xl border border-line bg-card p-6">
              <div className="flex items-center justify-between gap-3">
                <Link className="font-display text-lg font-bold text-fg hover:text-brand" href="/support/guides#fixed-assets">Үндсэн хөрөнгө</Link>
                <span className="rounded-full bg-surface px-2.5 py-0.5 text-xs tabular-nums text-fg-subtle">1</span>
              </div>
              <ul className="mt-3 space-y-1">
                <li>
                  <Link className="flex items-center gap-2 py-1 text-sm text-fg-muted hover:text-brand" href="/support/guides/fixed-asset-depreciation">
                    <svg aria-hidden="true" className="lucide lucide-arrow-right h-3.5 w-3.5 shrink-0 text-fg-subtle" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                    {" "}Үндсэн хөрөнгийн элэгдэл байгуулах
                  </Link>
                </li>
              </ul>
            </div>
            <div className="rounded-3xl border border-line bg-card p-6">
              <div className="flex items-center justify-between gap-3">
                <Link className="font-display text-lg font-bold text-fg hover:text-brand" href="/support/guides#remote-support">Алсын тусламж</Link>
                <span className="rounded-full bg-surface px-2.5 py-0.5 text-xs tabular-nums text-fg-subtle">2</span>
              </div>
              <ul className="mt-3 space-y-1">
                <li>
                  <Link className="flex items-center gap-2 py-1 text-sm text-fg-muted hover:text-brand" href="/support/guides/anydesk">
                    <svg aria-hidden="true" className="lucide lucide-arrow-right h-3.5 w-3.5 shrink-0 text-fg-subtle" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                    {" "}AnyDesk програм суулгах заавар
                  </Link>
                </li>
                <li>
                  <Link className="flex items-center gap-2 py-1 text-sm text-fg-muted hover:text-brand" href="/support/guides/teamviewer">
                    <svg aria-hidden="true" className="lucide lucide-arrow-right h-3.5 w-3.5 shrink-0 text-fg-subtle" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                    {" "}TeamViewer програмыг ашиглах заавар
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="scroll-mt-20 bg-surface py-14 sm:py-16" id="remote">
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-7xl grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="text-3xl font-bold text-fg">Алсын тусламж</h2>
            <div className="md-content mt-4 text-base">
              <p>Манай инженер таны компьютерт алсаас холбогдож асуудлыг шийдэх боломжтой. Доорх програмуудын аль нэгийг суулгаад бидэн рүү залгаарай.</p>
            </div>
            <div className="mt-6 space-y-2 text-sm">
              <CompanyEmail className="flex items-center gap-2 font-medium text-fg hover:text-brand" icon={<Mail className="h-4 w-4 text-brand" />} />
            </div>
          </div>
          <div className="lg:col-span-8">
            <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <li className="flex flex-col rounded-3xl border border-line bg-card p-6">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-surface text-brand">
                  <svg aria-hidden="true" className="lucide lucide-download h-5 w-5" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 15V3" />
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <path d="m7 10 5 5 5-5" />
                  </svg>
                </span>
                <p className="mt-4 font-display text-lg font-bold text-fg">AnyDesk</p>
                <p className="mt-1 text-sm text-fg-muted">Алсаас тусламж авах програм</p>
                <div className="mt-auto flex flex-wrap items-center gap-3 pt-6">
                  <a className="inline-flex h-10 items-center gap-2 rounded-full bg-brand px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-strong dark:text-ink" href="https://anydesk.com/en/downloads" rel="noopener" target="_blank">
                    <svg aria-hidden="true" className="lucide lucide-external-link h-4 w-4" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 3h6v6" />
                      <path d="M10 14 21 3" />
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    </svg>
                    Албан ёсны сайтаас
                  </a>
                  <Link className="text-sm font-semibold text-brand hover:underline" href="/support/guides/anydesk">Заавар</Link>
                </div>
              </li>
              <li className="flex flex-col rounded-3xl border border-line bg-card p-6">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-surface text-brand">
                  <svg aria-hidden="true" className="lucide lucide-download h-5 w-5" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 15V3" />
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <path d="m7 10 5 5 5-5" />
                  </svg>
                </span>
                <p className="mt-4 font-display text-lg font-bold text-fg">TeamViewer</p>
                <p className="mt-1 text-sm text-fg-muted">Алсаас тусламж авах програм</p>
                <div className="mt-auto flex flex-wrap items-center gap-3 pt-6">
                  <a className="inline-flex h-10 items-center gap-2 rounded-full bg-brand px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-strong dark:text-ink" href="https://www.teamviewer.com/en/download/windows" rel="noopener" target="_blank">
                    <svg aria-hidden="true" className="lucide lucide-external-link h-4 w-4" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 3h6v6" />
                      <path d="M10 14 21 3" />
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    </svg>
                    Албан ёсны сайтаас
                  </a>
                  <Link className="text-sm font-semibold text-brand hover:underline" href="/support/guides/teamviewer">Заавар</Link>
                </div>
              </li>
              <li className="flex flex-col rounded-3xl border border-line bg-card p-6">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-surface text-brand">
                  <svg aria-hidden="true" className="lucide lucide-download h-5 w-5" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 15V3" />
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <path d="m7 10 5 5 5-5" />
                  </svg>
                </span>
                <p className="mt-4 font-display text-lg font-bold text-fg">UltraViewer</p>
                <p className="mt-1 text-sm text-fg-muted">Алсаас тусламж авах програм (v6.4)</p>
                <div className="mt-auto flex flex-wrap items-center gap-3 pt-6">
                  <a className="inline-flex h-10 items-center gap-2 rounded-full bg-brand px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-strong dark:text-ink" href="https://www.ultraviewer.net/en/download.html" rel="noopener" target="_blank">
                    <svg aria-hidden="true" className="lucide lucide-external-link h-4 w-4" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 3h6v6" />
                      <path d="M10 14 21 3" />
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    </svg>
                    Албан ёсны сайтаас
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section className="scroll-mt-20 py-14 sm:py-16" id="faq">
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-7xl grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="text-3xl font-bold text-fg">Түгээмэл асуулт</h2>
            <p className="mt-3 text-fg-muted">Хариултаа олоогүй бол бидэнтэй холбогдоорой.</p>
            <Link className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand" href="/contact">
              Холбоо барих{" "}
              <svg aria-hidden="true" className="lucide lucide-arrow-right h-4 w-4" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="lg:col-span-8">
            <JsonLd data={{ "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }} />
            <div className="divide-y divide-line rounded-3xl border border-line bg-card">
              <details className="group px-5 sm:px-7 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-display text-lg font-semibold text-fg transition-colors hover:text-brand">
                  Алсаас тусламж хэрхэн авах вэ?
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-fg-muted transition-transform duration-200 group-open:rotate-45 group-open:border-brand group-open:text-brand">
                    <svg aria-hidden="true" className="lucide lucide-plus h-4 w-4" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12h14" />
                      <path d="M12 5v14" />
                    </svg>
                  </span>
                </summary>
                <div className="pb-6 [&_.md-content]:text-base">
                  <div className="md-content">
                    <p>
                      AnyDesk эсвэл TeamViewer програмыг суулгаад, гарч ирэх ID болон нууц үгээ манай инженерт хэлнэ. Дэлгэрэнгүйг{" "}
                      <Link href="/support/guides/anydesk">AnyDesk</Link>
                      ,{" "}
                      <Link href="/support/guides/teamviewer">TeamViewer</Link>
                      {" "}заавраас үзнэ үү. Инженер ажиллаж байх үед компьютероо унтраахгүй, давхар оролдлого хийхгүй байхыг анхаарна уу.
                    </p>
                  </div>
                </div>
              </details>
              <details className="group px-5 sm:px-7 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-display text-lg font-semibold text-fg transition-colors hover:text-brand">
                  Хэрэглэгч бүрт тусдаа эрх өгч болох уу?
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-fg-muted transition-transform duration-200 group-open:rotate-45 group-open:border-brand group-open:text-brand">
                    <svg aria-hidden="true" className="lucide lucide-plus h-4 w-4" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12h14" />
                      <path d="M12 5v14" />
                    </svg>
                  </span>
                </summary>
                <div className="pb-6 [&_.md-content]:text-base">
                  <div className="md-content">
                    <p>
                      Болно. Хэрэглэгч бүр өөрийн нэвтрэх нэр, нууц үгтэй байх ба цэс, данс, салбараар эрхийг нь хязгаарлаж болно. Эрхийг зөвхөн Admin эрхтэй хэрэглэгч тохируулна.{" "}
                      <Link href="/support/guides/user-permissions">Заавар үзэх</Link>
                    </p>
                  </div>
                </div>
              </details>
              <details className="group px-5 sm:px-7 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-display text-lg font-semibold text-fg transition-colors hover:text-brand">
                  Өмнөх үеийн гүйлгээг санамсаргүй өөрчлөхөөс яаж хамгаалах вэ?
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-fg-muted transition-transform duration-200 group-open:rotate-45 group-open:border-brand group-open:text-brand">
                    <svg aria-hidden="true" className="lucide lucide-plus h-4 w-4" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12h14" />
                      <path d="M12 5v14" />
                    </svg>
                  </span>
                </summary>
                <div className="pb-6 [&_.md-content]:text-base">
                  <div className="md-content">
                    <p>
                      «Компани мэдээлэл» цонхонд{" "}
                      <strong>Нууцлах огноо</strong>
                      {" "}эсвэл{" "}
                      <strong>Өндөрлөх огноо</strong>
                      {" "}тавина. Тухайн огнооноос өмнөх гүйлгээг засах, устгах боломжгүй болно. Салбар болон данс тус бүрт өөр огноо тавьж болно.{" "}
                      <Link href="/support/guides/company-info">Заавар үзэх</Link>
                    </p>
                  </div>
                </div>
              </details>
              <details className="group px-5 sm:px-7 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-display text-lg font-semibold text-fg transition-colors hover:text-brand">
                  Excel-ээс мэдээлэл оруулж болох уу?
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-fg-muted transition-transform duration-200 group-open:rotate-45 group-open:border-brand group-open:text-brand">
                    <svg aria-hidden="true" className="lucide lucide-plus h-4 w-4" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12h14" />
                      <path d="M12 5v14" />
                    </svg>
                  </span>
                </summary>
                <div className="pb-6 [&_.md-content]:text-base">
                  <div className="md-content">
                    <p>Болно. Касс, харилцахын орлого, зарлагын баримт, банкны хуулга, барааны эхний үлдэгдэл, орлого, зарлага болон харилцагчдын мэдээллийг Excel-ээс оруулж, тайлангаа Excel рүү гаргана.</p>
                  </div>
                </div>
              </details>
              <details className="group px-5 sm:px-7 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-display text-lg font-semibold text-fg transition-colors hover:text-brand">
                  MACS POS-ийг MACS ERP-гүйгээр ашиглаж болох уу?
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-fg-muted transition-transform duration-200 group-open:rotate-45 group-open:border-brand group-open:text-brand">
                    <svg aria-hidden="true" className="lucide lucide-plus h-4 w-4" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12h14" />
                      <path d="M12 5v14" />
                    </svg>
                  </span>
                </summary>
                <div className="pb-6 [&_.md-content]:text-base">
                  <div className="md-content">
                    <p>Болно. MACS POS дангаараа ажиллах боломжтой. MACS ERP-тэй холбосон үед кассаар хийсэн борлуулалт санхүүгийн програм руу борлуулалтын падаан болж автоматаар орно.</p>
                  </div>
                </div>
              </details>
              <details className="group px-5 sm:px-7 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-display text-lg font-semibold text-fg transition-colors hover:text-brand">
                  Гадаад валютаар гүйлгээ хийж болох уу?
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-fg-muted transition-transform duration-200 group-open:rotate-45 group-open:border-brand group-open:text-brand">
                    <svg aria-hidden="true" className="lucide lucide-plus h-4 w-4" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12h14" />
                      <path d="M12 5v14" />
                    </svg>
                  </span>
                </summary>
                <div className="pb-6 [&_.md-content]:text-base">
                  <div className="md-content">
                    <p>
                      Болно. Валютаа бүртгээд «авто» ханш сонговол гүйлгээ хийхэд тухайн өдрийн ханш автоматаар гарна. Ханшийн тэгшитгэл хийж, баримт дээр валютын болон төгрөгийн дүн зэрэгцэн харагдана.{" "}
                      <Link href="/support/guides/foreign-currency">Заавар үзэх</Link>
                    </p>
                  </div>
                </div>
              </details>
              <details className="group px-5 sm:px-7 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-display text-lg font-semibold text-fg transition-colors hover:text-brand">
                  Хэн, хэзээ гүйлгээ зассаныг харж болох уу?
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-fg-muted transition-transform duration-200 group-open:rotate-45 group-open:border-brand group-open:text-brand">
                    <svg aria-hidden="true" className="lucide lucide-plus h-4 w-4" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12h14" />
                      <path d="M12 5v14" />
                    </svg>
                  </span>
                </summary>
                <div className="pb-6 [&_.md-content]:text-base">
                  <div className="md-content">
                    <p>
                      Болно. «Гүйлгээний түүх»-ээс засагдсан, устгагдсан, шинээр үүссэн гүйлгээг хэрэглэгч болон компьютерын нэрээр харна. Зөвхөн Admin эрхтэй хэрэглэгч харах боломжтой.{" "}
                      <Link href="/support/guides/transaction-history">Заавар үзэх</Link>
                    </p>
                  </div>
                </div>
              </details>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
