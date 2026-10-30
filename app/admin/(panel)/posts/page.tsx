import Link from "next/link";
import { fmtDateTime, PageHeader, Table, Td } from "@/components/admin/ui";
import { Badge } from "@/components/ui/form";
import { requireStaff } from "@/lib/auth/session";
import { db } from "@/lib/db";

export const metadata = { title: "Мэдээ" };

export default async function AdminPosts() {
  await requireStaff();
  const posts = await db.post.findMany({
    select: { id: true, title: true, slug: true, category: true, publishedAt: true, viewCount: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });
  return (
    <>
      <PageHeader action={{ href: "/admin/posts/new", label: "Шинэ мэдээ" }} title="Мэдээ" />
      <Table empty={!posts.length} head={["Гарчиг", "Ангилал", "Төлөв", "Үзсэн", "Шинэчилсэн"]}>
        {posts.map((p) => (
          <tr className="hover:bg-surface/50" key={p.id}>
            <Td>
              <Link className="font-semibold text-fg hover:text-brand" href={`/admin/posts/${p.id}`}>
                {p.title}
              </Link>
              <span className="block text-xs text-fg-subtle">/news/{p.slug}</span>
            </Td>
            <Td>{p.category ?? "—"}</Td>
            <Td>{p.publishedAt ? <Badge tone="accent">Нийтэлсэн</Badge> : <Badge>Ноорог</Badge>}</Td>
            <Td className="tabular-nums">{p.viewCount}</Td>
            <Td className="whitespace-nowrap text-fg-muted">{fmtDateTime(p.updatedAt)}</Td>
          </tr>
        ))}
      </Table>
    </>
  );
}
