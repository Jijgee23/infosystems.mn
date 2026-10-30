import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/site/contact-form";
import { MapEmbed } from "@/components/site/map-embed";
import { Mail, MapPin, Phone } from "@/components/site/icons";
import { formatPhone, getCompany, mapEmbedUrl, telHref } from "@/lib/data/company";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getCompany();
  const phones = c.phones.map((p) => formatPhone(p.value)).join(", ");
  return {
    title: "Холбоо барих, демо захиалах | InfoSystems Mongolia",
    description: ["MACS ERP, MACS POS-ийн демо захиалах, үнийн санал авах.", phones && `Утас: ${phones}.`, c.locationName ?? c.address].filter(Boolean).join(" "),
  };
}

export default async function ContactPage() {
  const c = await getCompany();
  return (
    <main id="main">
      <section className="border-b border-line bg-surface">
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-7xl pt-8 pb-10 sm:pb-12">
          <nav aria-label="Breadcrumb" className="text-sm">
            <ol className="flex flex-wrap items-center gap-1.5 text-fg-subtle">
              <li className="flex items-center gap-1.5">
                <Link className="transition-colors hover:text-brand" href="/">Нүүр</Link>
                <svg aria-hidden="true" className="lucide lucide-chevron-right h-3.5 w-3.5" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </li>
              <li className="flex items-center gap-1.5">
                <span aria-current="page" className="font-medium text-fg-muted">Холбоо барих</span>
              </li>
            </ol>
          </nav>
          <p className="mt-8 mb-3 text-sm font-semibold tracking-wide text-brand uppercase">Холбоо барих</p>
          <h1 className="text-4xl font-extrabold text-fg sm:text-5xl">Демо захиалах</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-fg-muted">Маягтаа бөглөөд илгээгээрэй. Мэргэжилтэн маань тантай холбогдож, танай үйл ажиллагаанд тохируулан системийг танилцуулна.</p>
        </div>
      </section>
      <section className="py-12 sm:py-16">
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-7xl grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
          <aside className="lg:col-span-5">
            <div className="space-y-4 lg:sticky lg:top-24">
              <h2 className="sr-only">Холбоо барих мэдээлэл</h2>
              {c.phones.length > 0 && (
                <div className="rounded-3xl bg-ink p-6 text-white sm:p-7 dark:border dark:border-line dark:bg-card">
                  <p className="flex items-center gap-2 text-sm text-white/60">
                    <Phone className="h-4 w-4" /> Утас
                  </p>
                  <ul className="mt-2 space-y-1">
                    {c.phones.map((p) => (
                      <li className="flex flex-wrap items-baseline gap-x-3" key={p.id}>
                        <a className="font-display text-2xl font-bold text-white hover:text-accent" href={telHref(p.value)}>
                          {formatPhone(p.value)}
                        </a>
                        {p.label && <span className="text-sm text-white/60">{p.label}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {c.emails.map((e) => (
                <a className="flex items-center gap-4 rounded-3xl border border-line bg-card p-5 transition-colors hover:border-brand/40" href={`mailto:${e.value}`} key={e.id}>
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                    <Mail className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm text-fg-subtle">{e.label ?? "И-мэйл"}</span>
                    <span className="font-semibold text-fg">{e.value}</span>
                  </span>
                </a>
              ))}
              {c.address && (
                <div className="flex items-start gap-4 rounded-3xl border border-line bg-card p-5">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm text-fg-subtle">Хаяг</span>
                    <address className="font-semibold text-fg not-italic">{c.address}</address>
                    {c.workingHours && <span className="mt-1 block text-sm text-fg-muted">{c.workingHours}</span>}
                  </span>
                </div>
              )}
              {c.socials.length > 0 && (
                <div className="flex flex-wrap items-center gap-3 px-1 text-sm">
                  <span className="text-fg-subtle">Сошиал:</span>
                  {c.socials.map((s) => (
                    <a className="font-semibold text-brand hover:underline" href={s.value} key={s.id} rel="noopener" target="_blank">
                      {s.label ?? s.value}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>
      {(c.address || c.latitude !== null) && (
        <section className="pb-16 sm:pb-20">
          <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h2 className="mb-5 text-2xl font-bold text-fg">Байршил</h2>
            <div className="overflow-hidden rounded-3xl border border-line bg-surface">
              <div className="relative h-80 sm:h-[28rem] lg:h-[32rem]">
                <MapEmbed address={c.address ?? ""} embedUrl={mapEmbedUrl(c)} />
              </div>
              {c.mapUrl && (
                <a className="flex items-center justify-between gap-3 border-t border-line bg-card px-5 py-3 text-sm font-semibold text-brand hover:bg-surface" href={c.mapUrl} rel="noopener" target="_blank">
                  Google Maps-д нээх
                  <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M15 3h6v6" />
                    <path d="M10 14 21 3" />
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
