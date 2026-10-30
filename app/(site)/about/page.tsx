import type { Metadata } from "next";
import Link from "next/link";
import { AwardsSection } from "@/components/site/awards-section";
import { MilestonesSection } from "@/components/site/milestones-section";
import { TeamSection } from "@/components/site/team-section";
import { CtaContacts } from "@/components/site/cta-contacts";

export const metadata: Metadata = {
  title: "Бидний тухай — 1997 оноос програм хангамжийн салбарт | InfoSystems Mongolia",
  description: "InfoSystems Mongolia: 1997 оноос програм хангамжийн салбарт, 1998 оноос Сангийн яамны тусгай зөвшөөрөлтэй MACS санхүүгийн програм.",
};

export default function AboutPage() {
  return (
    <main id="main">
      <section className="relative overflow-hidden border-b border-line">
        <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_85%_10%,black_20%,transparent_60%)]" />
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-7xl relative pt-8 pb-14 sm:pb-20">
          <nav aria-label="Breadcrumb" className="text-sm">
            <ol className="flex flex-wrap items-center gap-1.5 text-fg-subtle">
              <li className="flex items-center gap-1.5">
                <Link className="transition-colors hover:text-brand" href="/">Нүүр</Link>
                <svg aria-hidden="true" className="lucide lucide-chevron-right h-3.5 w-3.5" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </li>
              <li className="flex items-center gap-1.5">
                <span aria-current="page" className="font-medium text-fg-muted">Бидний тухай</span>
              </li>
            </ol>
          </nav>
          <div className="mt-10 grid items-end gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="mb-3 text-sm font-semibold tracking-wide text-brand uppercase">1997 оноос</p>
              <h1 className="text-4xl font-extrabold text-fg sm:text-5xl">Бидний тухай</h1>
              <p className="mt-6 max-w-2xl text-xl leading-relaxed text-fg-muted">Манай компани 1997 оноос эхлэн Мэдээллийн технологийн салбарт програм хангамжийн чиглэлээр ажиллаж зах зээлд өөрийн гэсэн байр сууриа эзэлж, тэргүүлэгч компаниудын нэг болсон.</p>
            </div>
            <p aria-hidden="true" className="hidden font-display text-[7rem] leading-none sm:block font-extrabold tracking-tighter text-transparent select-none sm:text-[10rem] lg:col-span-5 lg:text-right [-webkit-text-stroke:2px_var(--border)]">1997</p>
          </div>
        </div>
      </section>
      <MilestonesSection />
      <section className="bg-surface py-14 sm:py-20">
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-7xl grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-3xl font-bold text-fg">Зорилт</h2>
            <div className="md-content mt-5">
              <p>Цаашид Монголын мэдээллийн технологи хөгжиж, өдөр тутмын хэрэглээ болохын хирээр програм хангамжийн хэрэгцээ нэмэгдэх нь зайлшгүй юм. Ийм учраас бид үйл ажиллагааны хүрээгээ өргөтгөн, хэрэглэгчиддээ чанартай, олон улсын түвшинд хүрсэн бүтээгдэхүүнээр хангахын тулд дараах зорилтуудыг дэвшүүлэн ажиллах байна.</p>
              {" "}
              <p>
                <strong>Үүнд:</strong>
              </p>
              {" "}
              <ul>
                {" "}
                <li>Програм хангамж боловсруулах үйл ажиллагаагаа улам сайжруулж Олон Улсын ISO, CMM стандартыг хангасан байгууллага болох</li>
                {" "}
                <li>Гадаадын байгууллагуудтай хамтран ажиллаж, outsourcing хийх</li>
                {" "}
              </ul>
            </div>
          </div>
          <div className="rounded-3xl border border-line bg-card p-7 sm:p-9">
            <h2 className="text-2xl font-bold text-fg">Боломж</h2>
            <p className="mt-3 text-fg-muted">Инфосистемс ХХК нь харилцагчиддаа үйл ажиллагаагаа зөв удирдан зохион байгуулах боломжийг олгодгоороо чухал ач холбогдолттой юм.</p>
            <ul className="mt-6 space-y-4">
              <li className="flex gap-3">
                <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                  <svg aria-hidden="true" className="lucide lucide-check h-3.5 w-3.5" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                <span className="leading-relaxed text-fg">Танд нэр хүндтэй уян хатан системтэй энгийн хялбар ажиллагаатай, онч мэргэн бүтэц диаграмтай програм хангамжтай болох боломжийг бид олгож байна.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                  <svg aria-hidden="true" className="lucide lucide-check h-3.5 w-3.5" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                <span className="leading-relaxed text-fg">Манай програмыг ашиглаж байгаа хэрэглэгчдийн бүх үйлдэл, өдөр тутмын үйл ажиллагааны талаарх мэдээллийг дээд шатны удирдлагуудад мэдээлэх байдлаар таны хяналтанд бүрэн орох болно.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                  <svg aria-hidden="true" className="lucide lucide-check h-3.5 w-3.5" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                <span className="leading-relaxed text-fg">Томоохон байгууллага корпорацийн салбар компани, жижиг сүлжээ дэлгүүрүүдийн хувьд ч програм хангамжийн хувьсал ирж байгаа гэдэгт итгэж болно. Манай компани алслагдсан олон салбаруудыг online байдлаар нэгдсэн сүлжээ үүсгэж хяналт тавих боломжийг мөн олгож байна.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section className="py-14 sm:py-20">
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-7xl">
          <h2 className="text-3xl font-bold text-fg">Давуу тал</h2>
          <ul className="mt-10 grid gap-4 md:grid-cols-2">
            <li className="reveal flex gap-4 rounded-2xl border border-line bg-card p-6" style={{ "--reveal-delay": "0ms" }}>
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
                <svg aria-hidden="true" className="lucide lucide-circle-check h-5 w-5" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </span>
              <span className="leading-relaxed text-fg">Бүх төрлийн үйл ажиллагаа эрхэлдэг байгууллагуудад манай програм бүрэн зохицон ажилладаг.</span>
            </li>
            <li className="reveal flex gap-4 rounded-2xl border border-line bg-card p-6" style={{ "--reveal-delay": "80ms" }}>
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
                <svg aria-hidden="true" className="lucide lucide-circle-check h-5 w-5" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </span>
              <span className="leading-relaxed text-fg">Худалдан авалтын дараах үйлчилгээг манай эвсэг хамт олон танд маш шуурхай хүрч үйлчлэх бөгөөд шаардлагтай гэж үзвэл утас, интернэт гэх мэт аль ч төрлийн холбоо хэрэгслээр дамжуулж авч болно.</span>
            </li>
            <li className="reveal flex gap-4 rounded-2xl border border-line bg-card p-6" style={{ "--reveal-delay": "0ms" }}>
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
                <svg aria-hidden="true" className="lucide lucide-circle-check h-5 w-5" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </span>
              <span className="leading-relaxed text-fg">Хэдийгээр манайхаас програм худалдаж авснаар мөнгө, цаг хугацаа зарцуулагдах боловч танай компаний бүтээмжийг бууруулж, ашгийг багасгаж, өрсөлдөх чадварыг тань алдагдуулаад байгаа асуудлуудыг дэлгэн тавьж зөв шийдвэр гаргахад шаардлагатай мэдээллээр ханган үйл ажиллагааны үр дүнг сайжруулах давуу талтайг анхаарах хэрэгтэй.</span>
            </li>
            <li className="reveal flex gap-4 rounded-2xl border border-line bg-card p-6" style={{ "--reveal-delay": "80ms" }}>
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
                <svg aria-hidden="true" className="lucide lucide-circle-check h-5 w-5" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </span>
              <span className="leading-relaxed text-fg">Манайх програмаа үргэлж шинэчлэн сайжруулж манлайлж, орчин үеийн шинэ технологиор үйлчилдэг учир та хамгийн шилдэг нь байх болно.</span>
            </li>
            <li className="reveal flex gap-4 rounded-2xl border border-line bg-card p-6 md:col-span-2" style={{ "--reveal-delay": "0ms" }}>
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
                <svg aria-hidden="true" className="lucide lucide-circle-check h-5 w-5" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </span>
              <span className="leading-relaxed text-fg">Зарим саруудад үнийн хөнгөлөлт, борлуулалтын урамшуулал үзүүлдэг тул та үүнийг сонирхоод үзээрэй.</span>
            </li>
          </ul>
        </div>
      </section>
      <AwardsSection />
      <div className="pt-16 sm:pt-20">
        <section className="pb-16 sm:pb-20">
          <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="relative grid gap-10 overflow-hidden rounded-[2rem] bg-ink p-8 text-white sm:p-12 lg:grid-cols-12 lg:items-center lg:gap-12 dark:border dark:border-line dark:bg-surface">
              <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-brand/40 blur-3xl" />
              <div className="pointer-events-none absolute -right-20 -bottom-28 h-72 w-72 rounded-full bg-accent/25 blur-3xl" />
              <div className="relative lg:col-span-7">
                <h2 className="text-3xl font-bold text-white sm:text-4xl">Хамтран ажиллая</h2>
                <p className="mt-4 max-w-lg text-lg text-white/75">MACS танай байгууллагад хэрхэн ажиллахыг мэргэжилтэн маань танилцуулна.</p>
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
      </div>
      <TeamSection />
    </main>
  );
}
