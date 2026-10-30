import Link from "next/link";
import { fmtDateTime, PageHeader, Table, Td } from "@/components/admin/ui";
import { Badge } from "@/components/ui/form";
import { requireStaff } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { GUIDE_CATEGORIES, guideCategoryName } from "@/lib/guide-categories";

export const metadata = { title: "Заавар" };

export default async function AdminGuides() {
  await requireStaff();
  const rows = await db.guide.findMany({
    select: { id: true, title: true, slug: true, category: true, sortOrder: true, publishedAt: true, viewCount: true, updatedAt: true },
    orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
  });
  const rank = (c: string) => GUIDE_CATEGORIES.findIndex((g) => g.key === c);
  rows.sort((a, b) => rank(a.category) - rank(b.category));
  const now = new Date();
  return (
    <>
      <PageHeader action={{ href: "/admin/guides/new", label: "Шинэ заавар" }} description="/support/guides хуудасны заавар, гарын авлага" title="Заавар" />
      <Table empty={!rows.length} head={["Гарчиг", "Бүлэг", "Төлөв", "Үзсэн", "Шинэчилсэн"]}>
        {rows.map((g) => (
          <tr className="hover:bg-surface/50" key={g.id}>
            <Td>
              <Link className="font-semibold text-fg hover:text-brand" href={`/admin/guides/${g.id}`}>
                {g.title}
              </Link>
              <span className="block text-xs text-fg-subtle">/support/guides/{g.slug}</span>
            </Td>
            <Td>
              {guideCategoryName(g.category)} <span className="text-fg-subtle">· {g.sortOrder}</span>
            </Td>
            <Td>
              {!g.publishedAt ? <Badge>Ноорог</Badge> : g.publishedAt > now ? <Badge tone="warn">Товлосон</Badge> : <Badge tone="accent">Нийтэлсэн</Badge>}
            </Td>
            <Td className="tabular-nums">{g.viewCount}</Td>
            <Td className="whitespace-nowrap text-fg-muted">{fmtDateTime(g.updatedAt)}</Td>
          </tr>
        ))}
      </Table>
    </>
  );
}
