import Link from "next/link";
import { Badge } from "@/components/ui/form";
import { formatDate } from "@/lib/data/posts";

type Item = {
  id: string;
  title: string;
  resolved: boolean;
  seen: boolean;
  updatedAt: Date;
  product: string | null;
  companyName?: string | null;
  unread: number;
  /** Shown to the product's other customers (adminConfirmed). */
  adminConfirmed?: boolean;
};

export function IssueList({
  items,
  base,
  showCompany = false,
  staffView = false,
  empty = "Асуудал алга.",
}: {
  items: Item[];
  base: string;
  showCompany?: boolean;
  staffView?: boolean;
  empty?: string;
}) {
  if (!items.length) return <p className="rounded-3xl border border-dashed border-line bg-card p-8 text-center text-fg-muted">{empty}</p>;
  return (
    <ul className="divide-y divide-line overflow-hidden rounded-3xl border border-line bg-card">
      {items.map((i) => (
        <li key={i.id}>
          <Link className="flex flex-wrap items-center gap-x-4 gap-y-1 p-4 transition-colors hover:bg-surface/60 sm:px-6" href={`${base}/${i.id}`}>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-semibold text-fg">{i.title}</span>
              <span className="mt-0.5 block text-xs text-fg-subtle">
                {[showCompany && i.companyName, i.product, formatDate(i.updatedAt)].filter(Boolean).join(" · ")}
              </span>
            </span>
            <span className="flex items-center gap-2">
              {staffView && !i.seen && <Badge tone="warn">Шинэ</Badge>}
              {staffView && i.adminConfirmed && <Badge tone="brand">Бусдад харагдана</Badge>}
              {i.unread > 0 && <Badge tone="brand">{i.unread} шинэ хариулт</Badge>}
              {i.resolved ? <Badge tone="accent">Шийдэгдсэн</Badge> : <Badge>Нээлттэй</Badge>}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
