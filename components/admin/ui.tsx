import Link from "next/link";
import type { ReactNode } from "react";
import { buttonClass } from "@/components/ui/form";

export function PageHeader({ title, description, action }: { title: string; description?: ReactNode; action?: { href: string; label: string } }) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="font-display text-[1.7rem] leading-tight font-bold tracking-tight text-fg">{title}</h1>
        {description && <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-fg-muted">{description}</p>}
      </div>
      {action && (
        <Link className={buttonClass("primary", "sm")} href={action.href}>
          {action.label}
        </Link>
      )}
    </div>
  );
}

export function Table({ head, children, empty }: { head: ReactNode[]; children: ReactNode; empty?: boolean }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-line/80 bg-card shadow-[0_1px_2px_rgb(16_24_40/0.04)]">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-line bg-surface/70 text-[11px] font-semibold tracking-wider text-fg-subtle uppercase">
          <tr>
            {head.map((h, i) => (
              <th className="px-4 py-3 whitespace-nowrap" key={i}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {empty ? (
            <tr>
              <td className="px-4 py-10 text-center text-fg-muted" colSpan={head.length}>
                Мэдээлэл алга.
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  );
}

export const Td = ({ children, className = "" }: { children: ReactNode; className?: string }) => <td className={`px-4 py-3 align-top ${className}`}>{children}</td>;

export function FilterTabs({ base, current, tabs }: { base: string; current: string; tabs: { value: string; label: string }[] }) {
  return (
    <div className="mb-4 flex flex-wrap gap-1">
      {tabs.map((t) => (
        <Link
          aria-current={current === t.value ? "page" : undefined}
          className="rounded-full px-3.5 py-1.5 text-sm font-medium text-fg-muted hover:bg-card hover:text-fg aria-[current=page]:bg-ink aria-[current=page]:text-white dark:aria-[current=page]:bg-brand dark:aria-[current=page]:text-ink"
          href={t.value ? `${base}?filter=${t.value}` : base}
          key={t.value}
        >
          {t.label}
        </Link>
      ))}
    </div>
  );
}

export const fmtDateTime = (d: Date | null) =>
  d ? new Intl.DateTimeFormat("mn-MN", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Ulaanbaatar" }).format(d) : "—";
