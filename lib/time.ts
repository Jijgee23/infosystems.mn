/** `YYYY-MM-DDTHH:mm` in Ulaanbaatar time, for `<input type="datetime-local">`. */
export function toLocalInput(d: Date | null) {
  if (!d) return "";
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ulaanbaatar", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
      .formatToParts(d)
      .map((x) => [x.type, x.value]),
  );
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
}

/** Parses a datetime-local value as Ulaanbaatar time (UTC+8, no DST). */
export const fromLocalInput = (v: string) => new Date(`${v}:00+08:00`);

/**
 * Postgres DATE columns come back from Prisma as midnight UTC.
 * These convert between that and the `YYYY-MM-DD` strings used by forms and the legacy API.
 */
export const fromDateInput = (v: string) => new Date(`${v}T00:00:00Z`);
export const toDateInput = (d: Date | null) => (d ? d.toISOString().slice(0, 10) : "");
