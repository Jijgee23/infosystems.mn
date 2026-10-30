import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ProductCatalog } from "@/components/site/product-catalog";
import { ProductComparison } from "@/components/site/product-extras";
import { CtaContacts } from "@/components/site/cta-contacts";

export const metadata: Metadata = {
  title: "Бүтээгдэхүүн | InfoSystems Mongolia",
  description: "MACS ERP санхүүгийн бүртгэлийн иж бүрэн програм, MACS POS кассын систем болон төслийн санхүү, өртөг тооцоо, тээвэр зуучлал, цаг бүртгэл, гэрээний бүртгэлийн системүүд.",
};

export default function ProductsPage() {
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
                <span aria-current="page" className="font-medium text-fg-muted">Бүтээгдэхүүн</span>
              </li>
            </ol>
          </nav>
          <div className="mt-8 max-w-3xl">
            <p className="mb-3 text-sm font-semibold tracking-wide text-brand uppercase">Бүтээгдэхүүн</p>
            <h1 className="text-4xl font-extrabold text-fg sm:text-5xl">Санхүү, бүртгэлийн програм хангамж</h1>
            <p className="mt-5 text-lg leading-relaxed text-fg-muted">Бие даасан модулиудыг холбон, байгууллагынхаа үйл ажиллагааг шаардлагатай түвшинд хамруулна. Бүх систем MACS ERP-тэй уялдаж ажиллана.</p>
          </div>
        </div>
      </section>
      <Suspense fallback={<div aria-hidden="true" className="mx-auto my-14 h-96 w-full max-w-7xl animate-pulse rounded-[2rem] bg-surface" />}>
        <ProductCatalog />
      </Suspense>
      <Suspense fallback={null}>
        <ProductComparison />
      </Suspense>
      <div className="pt-16 sm:pt-20">
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
      </div>
    </main>
  );
}

