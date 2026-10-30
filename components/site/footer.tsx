import { cacheLife } from "next/cache";
import Link from "next/link";
import { formatPhone, getCompany, telHref } from "@/lib/data/company";
import { ArrowRight, Logo, Mail, MapPin, Phone, SocialIcon } from "./icons";

const COLUMNS = [
  {
    title: "Бүтээгдэхүүн",
    links: [
      ["/products/macs-erp", "MACS ERP"],
      ["/products/macs-pos", "MACS POS"],
      ["/products/macs-micro", "MACS Micro"],
      ["/products", "Бүх бүтээгдэхүүн"],
      ["/pricing", "Үнэ, лиценз"],
    ],
  },
  {
    title: "Шийдэл",
    links: [
      ["/solutions/retail", "Худалдаа"],
      ["/solutions/manufacturing", "Үйлдвэрлэл"],
      ["/solutions/services", "Үйлчилгээ"],
      ["/solutions/pharmacy", "Эмийн сан"],
      ["/solutions/auto-service", "Авто засвар"],
    ],
  },
  {
    title: "Компани",
    links: [
      ["/about", "Бидний тухай"],
      ["/customers", "Амжилтын түүх"],
      ["/services", "Захиалгат хөгжүүлэлт"],
      ["/news", "Мэдээ, зөвлөгөө"],
      ["/contact", "Холбоо барих"],
    ],
  },
  {
    title: "Тусламж",
    links: [
      ["/support#faq", "Түгээмэл асуулт"],
      ["/support/guides", "Заавар, гарын авлага"],
      ["/support/downloads", "Програм татах"],
      ["/updates", "Шинэчлэлтүүд"],
      ["/support#training", "Сургалт"],
      ["/privacy", "Нууцлалын бодлого"],
    ],
  },
] as const;

async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

export async function Footer() {
  const c = await getCompany();
  const phones = c.phones.filter((p) => p.showInFooter);
  const emails = c.emails.filter((e) => e.showInFooter);
  const socials = c.socials.filter((s) => s.showInFooter);
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-7xl py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link aria-label="InfoSystems Mongolia" className="inline-block rounded-lg" href="/">
              <Logo />
            </Link>
            {c.shortDescription && <p className="mt-5 max-w-sm text-sm leading-relaxed text-fg-muted">{c.shortDescription}</p>}
            {socials.length > 0 && (
              <>
                <p className="mt-8 mb-3 text-sm font-semibold text-fg">Биднийг дагах</p>
                <ul className="flex gap-2">
                  {socials.map((s) => (
                    <li key={s.id}>
                      <a aria-label={s.label ?? s.value} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-card text-fg-muted transition-colors hover:border-brand hover:text-brand" href={s.value} rel="noopener" target="_blank">
                        <SocialIcon className="h-[18px] w-[18px]" url={s.value} />
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="mb-4 text-sm font-semibold text-fg">{col.title}</p>
                <ul className="space-y-2.5">
                  {col.links.map(([href, label]) => (
                    <li key={href}>
                      <Link className="text-sm text-fg-muted transition-colors hover:text-brand" href={href}>
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-14 grid gap-4 rounded-3xl border border-line bg-card p-6 text-sm sm:grid-cols-3">
          <div className="flex gap-3">
            <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
            <p className="flex flex-wrap gap-x-3 gap-y-1">
              {phones.map((p) => (
                <a className="font-medium text-fg hover:text-brand" href={telHref(p.value)} key={p.id} title={p.label ?? undefined}>
                  {formatPhone(p.value)}
                </a>
              ))}
            </p>
          </div>
          <div className="flex gap-3">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
            <p className="flex flex-wrap gap-x-3 gap-y-1">
              {emails.map((e) => (
                <a className="font-medium text-fg hover:text-brand" href={`mailto:${e.value}`} key={e.id}>
                  {e.value}
                </a>
              ))}
            </p>
          </div>
          <div className="flex gap-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
            <address className="text-fg-muted not-italic">{c.address}</address>
          </div>
        </div>
        <p className="mt-10 text-xs text-fg-subtle">
          © <CurrentYear /> {c.legalName ?? c.name}. Бүх эрх хуулиар хамгаалагдсан.
        </p>
      </div>
    </footer>
  );
}

export async function StickyBar() {
  const phone = (await getCompany()).phones[0]?.value;
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/95 pt-3 backdrop-blur-xl lg:hidden"
      style={{
        paddingBottom: "max(12px, env(safe-area-inset-bottom, 0px))",
        paddingLeft: "max(16px, env(safe-area-inset-left, 0px))",
        paddingRight: "max(16px, env(safe-area-inset-right, 0px))",
      }}
    >
      <div className="mx-auto grid max-w-md grid-cols-2 gap-2">
        <a className="inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-colors duration-200 border border-line bg-card text-fg hover:border-brand/50 hover:text-brand h-10 px-4 text-sm w-full" href={phone ? telHref(phone) : "/contact"}>
          <Phone className="h-4 w-4" /> Залгах
        </a>
        <Link className="inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-colors duration-200 bg-brand text-white shadow-sm shadow-brand/20 hover:bg-brand-strong dark:text-ink h-10 px-4 text-sm w-full" href="/contact">
          Демо захиалах <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
