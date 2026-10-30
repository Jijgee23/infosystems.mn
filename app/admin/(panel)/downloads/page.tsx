import Link from "next/link";
import { PageHeader, Table, Td } from "@/components/admin/ui";
import { Badge } from "@/components/ui/form";
import { requireStaff } from "@/lib/auth/session";
import { formatSize } from "@/lib/data/downloads";
import { db } from "@/lib/db";

export const metadata = { title: "Програм татах" };

export default async function AdminDownloads() {
  await requireStaff();
  const rows = await db.download.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    include: { file: { select: { name: true, sizeKb: true } } },
  });
  return (
    <>
      <PageHeader action={{ href: "/admin/downloads/new", label: "Шинэ файл" }} description="/support/downloads хуудасны програм, файлууд" title="Програм татах" />
      <Table empty={!rows.length} head={["Нэр", "Файл", "Холбоос", "Төлөв"]}>
        {rows.map((d) => (
          <tr className="hover:bg-surface/50" key={d.id}>
            <Td>
              <Link className="font-semibold text-fg hover:text-brand" href={`/admin/downloads/${d.id}`}>
                {d.title}
              </Link>
              {d.description && <span className="block text-xs text-fg-subtle">{d.description}</span>}
            </Td>
            <Td className="text-fg-muted">{d.file ? `${d.file.name} · ${formatSize(d.file.sizeKb)}` : "—"}</Td>
            <Td className="max-w-56 truncate text-fg-muted">{d.externalUrl ?? "—"}</Td>
            <Td>{d.isPublic ? <Badge tone="accent">Харагдана</Badge> : <Badge>Нуусан</Badge>}</Td>
          </tr>
        ))}
      </Table>
    </>
  );
}
