type Stat = { id: string; value: string; label: string; note: string | null };

/** Column count that keeps every card the same width for 1–4 figures (more wrap onto a second row). */
const COLS: Record<number, string> = {
  // One or two figures keep a card's natural width instead of stretching across the row.
  1: "grid-cols-1 max-w-[15rem] w-full",
  2: "grid-cols-2 max-w-[30rem] w-full",
  3: "grid-cols-3",
};

/**
 * The trust-bar figures: number, what it counts, and optional small print saying where the
 * number comes from. Used on the home page and as the live preview in admin.
 */
export function StatCards({ stats, className = "" }: { stats: Stat[]; className?: string }) {
  if (!stats.length) return null;
  return (
    <dl className={`mx-auto grid gap-3 ${COLS[stats.length] ?? "grid-cols-2 sm:grid-cols-4"} ${className}`}>
      {stats.map((s) => (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-line bg-card px-3 py-4 text-center sm:px-5 sm:py-5" key={s.id}>
          {/* <dt> comes first for the list semantics; the number is shown on top. */}
          <dt className="order-2 mt-2 text-[13px] leading-snug font-medium text-fg sm:text-sm">{s.label}</dt>
          <dd className="order-1 font-display text-2xl leading-none font-extrabold text-brand tabular-nums sm:text-[2rem]">{s.value}</dd>
          {s.note && <dd className="order-3 mt-1 text-xs leading-snug text-fg-subtle">{s.note}</dd>}
        </div>
      ))}
    </dl>
  );
}
