import Link from "next/link";

/** GET search box for issue lists; `keep` carries other query params (e.g. the filter tab). */
export function IssueSearch({ action, q, keep = {} }: { action: string; q?: string; keep?: Record<string, string | undefined> }) {
  return (
    <form action={action} className="mb-4 flex items-center gap-2" role="search">
      {Object.entries(keep).map(([k, v]) => (v ? <input key={k} name={k} type="hidden" value={v} /> : null))}
      <label className="relative min-w-0 flex-1">
        <span className="sr-only">Асуудал хайх</span>
        <svg aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-fg-subtle" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
          <path d="m21 21-4.34-4.34" />
          <circle cx="11" cy="11" r="8" />
        </svg>
        <input
          className="h-10 w-full rounded-full border border-line bg-card pr-4 pl-10 text-sm text-fg placeholder:text-fg-subtle focus:border-brand focus:outline-none"
          defaultValue={q}
          maxLength={100}
          name="q"
          placeholder="Гарчиг, агуулгаар хайх…"
          type="search"
        />
      </label>
      {q && (
        <Link className="shrink-0 text-sm font-medium text-fg-muted hover:text-brand" href={`${action}${keep.filter ? `?filter=${keep.filter}` : ""}`}>
          Цэвэрлэх
        </Link>
      )}
    </form>
  );
}
