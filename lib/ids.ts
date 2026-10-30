/**
 * Record ids are cuid2 strings (24 lowercase letters/digits, starting with a letter).
 * Returns the id when `v` looks like one, otherwise null — use it for route params and
 * form fields before they reach a query.
 */
export function idParam(v: unknown): string | null {
  return typeof v === "string" && /^[a-z][a-z0-9]{7,31}$/.test(v) ? v : null;
}

/** All valid ids from a multi-value form field (e.g. checkboxes). */
export const idList = (values: unknown[]) => values.map(idParam).filter((v): v is string => v !== null);
