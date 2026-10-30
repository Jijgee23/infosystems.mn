import Link from "next/link";
import { PageHeader, Table, Td } from "@/components/admin/ui";
import { Badge } from "@/components/ui/form";
import { requireStaff } from "@/lib/auth/session";
import { db } from "@/lib/db";

export const metadata = { title: "Амжилтын түүх" };

export default async function CaseStudiesPage() {
  await requireStaff();
  const rows = await db.caseStudy.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }], include: { products: { select: { name: true } } } });
  return (
    <>
      <PageHeader action={{ href: "/admin/case-studies/new", label: "Шинэ түүх" }} description="/customers хуудас, нүүр хуудас болон холбогдох бүтээгдэхүүний хуудсанд гарна." title="Амжилтын түүх" />
      <Table empty={!rows.length} head={["Гарчиг", "Байгууллага", "Бүтээгдэхүүн", "Төлөв"]}>
        {rows.map((c) => (
          <tr className="hover:bg-surface/50" key={c.id}>
            <Td>
              <Link className="font-semibold text-fg hover:text-brand" href={`/admin/case-studies/${c.id}`}>
                {c.title}
              </Link>
              <span className="block text-xs text-fg-subtle">{c.slug}</span>
            </Td>
            <Td>
              {c.clientName}
              {c.industry && <span className="block text-xs text-fg-subtle">{c.industry}</span>}
            </Td>
            <Td>{c.products.map((p) => p.name).join(", ") || "—"}</Td>
            <Td>{c.publishedAt ? <Badge tone="accent">Нийтэлсэн</Badge> : <Badge>Ноорог</Badge>}</Td>
          </tr>
        ))}
      </Table>
    </>
  );
}
