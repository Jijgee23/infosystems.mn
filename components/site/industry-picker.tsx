import Link from "next/link";
import type { ReactNode } from "react";

const icon = (children: ReactNode) => (
  <svg aria-hidden="true" className="h-6 w-6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
    {children}
  </svg>
);

/** Same pages and icons as /solutions. */
const INDUSTRIES = [
  {
    href: "/solutions/retail",
    label: "Худалдаа",
    note: "Касс, баркод, бараа материал",
    icon: icon(
      <>
        <path d="M15 21v-5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5" />
        <path d="M17.774 10.31a1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.451 0 1.12 1.12 0 0 0-1.548 0 2.5 2.5 0 0 1-3.452 0 1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.77-3.248l2.889-4.184A2 2 0 0 1 7 2h10a2 2 0 0 1 1.653.873l2.895 4.192a2.5 2.5 0 0 1-3.774 3.244" />
        <path d="M4 10.95V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8.05" />
      </>,
    ),
  },
  {
    href: "/solutions/pharmacy",
    label: "Эмийн сан",
    note: "Жор, ЭМД-ын хөнгөлөлт",
    icon: icon(
      <>
        <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
        <path d="m8.5 8.5 7 7" />
      </>,
    ),
  },
  {
    href: "/solutions/auto-service",
    label: "Авто засвар",
    note: "Наряд, сэлбэг хайлт",
    icon: icon(
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z" />,
    ),
  },
  {
    href: "/solutions/manufacturing",
    label: "Үйлдвэрлэл",
    note: "Өртөг, орц, хорогдол",
    icon: icon(
      <>
        <path d="M12 16h.01" />
        <path d="M16 16h.01" />
        <path d="M3 19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5a.5.5 0 0 0-.769-.422l-4.462 2.844A.5.5 0 0 1 15 10.5v-2a.5.5 0 0 0-.769-.422L9.77 10.922A.5.5 0 0 1 9 10.5V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z" />
        <path d="M8 16h.01" />
      </>,
    ),
  },
  {
    href: "/solutions/services",
    label: "Үйлчилгээ",
    note: "Касс, санхүүгийн бүртгэл",
    icon: icon(
      <>
        <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        <rect height="14" rx="2" width="20" x="2" y="6" />
      </>,
    ),
  },
];

/** Home page, right under the hero: lets visitors who didn't come for MACS ERP pick their industry. */
export function IndustryPicker() {
  return (
    <section aria-labelledby="industry-picker" className="pb-12 sm:pb-16">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <h2 className="text-xl font-bold text-fg sm:text-2xl" id="industry-picker">
            Танай бизнес аль салбарынх вэ?
          </h2>
          <Link className="text-sm font-semibold text-brand hover:underline" href="/solutions">
            Бүх шийдэл
          </Link>
        </div>
        <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {INDUSTRIES.map((i) => (
            <li className="last:col-span-2 sm:last:col-span-1" key={i.href}>
              <Link
                className="group flex h-full items-center gap-3 rounded-2xl border border-line bg-card p-4 transition-all hover:border-brand/40 hover:shadow-lg hover:shadow-ink/5"
                href={i.href}
              >
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand transition-colors group-hover:bg-brand group-hover:text-white dark:group-hover:text-ink">
                  {i.icon}
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold text-fg group-hover:text-brand">{i.label}</span>
                  <span className="mt-0.5 block text-xs leading-snug text-fg-muted">{i.note}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
