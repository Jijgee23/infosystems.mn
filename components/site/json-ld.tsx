export const SITE_URL = process.env.SITE_URL ?? "https://infosystems.mn";

/** Absolute URL on this site for structured data. */
export const absUrl = (path: string) => (path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`);

/** schema.org structured data. `<` is escaped so the JSON can't close the script tag. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", ...data }).replace(/</g, "\\u003c") }} type="application/ld+json" />;
}
