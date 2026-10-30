import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CaseStudyCard, ClientLogos, Testimonials } from "@/components/site/trust";
import { getCaseStudies, getClientLogos, getTestimonials } from "@/lib/data/trust";

export const metadata: Metadata = {
  title: "Харилцагчид, амжилтын түүх | InfoSystems Mongolia",
  description: "MACS ERP, MACS POS ашигладаг байгууллагуудын туршлага, амжилтын түүх.",
  alternates: { canonical: "/customers" },
};

export default function CustomersPage() {
  return (
    <main id="main">
      <section className="border-b border-line bg-surface">
        <div className="mx-auto w-full max-w-7xl px-4 pt-8 pb-10 sm:px-6 sm:pb-12 lg:px-8">
          <Breadcrumbs items={[{ label: "Харилцагчид" }]} />
          <p className="mt-8 mb-3 text-sm font-semibold tracking-wide text-brand uppercase">Харилцагчид</p>
          <h1 className="text-4xl font-extrabold text-fg sm:text-5xl">Амжилтын түүх</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-fg-muted">Манай системийг ашиглан үйл ажиллагаагаа цэгцэлсэн байгууллагуудын туршлага.</p>
        </div>
      </section>
      <Suspense fallback={<div aria-hidden="true" className="mx-auto my-14 h-96 w-full max-w-7xl animate-pulse rounded-3xl bg-surface" />}>
        <Content />
      </Suspense>
    </main>
  );
}

async function Content() {
  const [cases, logos, quotes] = await Promise.all([getCaseStudies(), getClientLogos(), getTestimonials()]);
  if (!cases.length && !logos.length && !quotes.length)
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-fg-muted">Удахгүй нэмэгдэнэ.</p>
        <Link className="mt-4 inline-block font-semibold text-brand hover:underline" href="/products">
          Бүтээгдэхүүнтэй танилцах →
        </Link>
      </div>
    );
  return (
    <>
      {cases.length > 0 && (
        <section className="py-14 sm:py-16">
          <ul className="mx-auto grid w-full max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
            {cases.map((c) => (
              <li key={c.id}>
                <CaseStudyCard c={c} />
              </li>
            ))}
          </ul>
        </section>
      )}
      <ClientLogos className="border-t border-line py-12 sm:py-14" />
      <Testimonials className="border-t border-line bg-surface py-14 sm:py-16" />
    </>
  );
}
