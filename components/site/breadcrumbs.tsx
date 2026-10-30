import Link from "next/link";
import { absUrl, JsonLd } from "./json-ld";

type Crumb = { href?: string; label: string };

/** Visible breadcrumb trail, plus the same trail as schema.org BreadcrumbList for search results. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const trail = [{ href: "/", label: "Нүүр" }, ...items];
  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <JsonLd
        data={{
          "@type": "BreadcrumbList",
          itemListElement: trail.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, ...(c.href ? { item: absUrl(c.href) } : {}) })),
        }}
      />
      <ol className="flex flex-wrap items-center gap-1.5 text-fg-subtle">
        {trail.map((c, i, all) => (
          <li className="flex items-center gap-1.5" key={i}>
            {c.href && i < all.length - 1 ? (
              <>
                <Link className="transition-colors hover:text-brand" href={c.href}>
                  {c.label}
                </Link>
                <svg aria-hidden="true" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </>
            ) : (
              <span aria-current="page" className="font-medium text-fg-muted">
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
