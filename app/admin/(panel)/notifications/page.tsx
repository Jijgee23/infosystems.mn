import Link from "next/link";
import { PageHeader, Table, Td } from "@/components/admin/ui";
import { Badge } from "@/components/ui/form";
import { requireStaff } from "@/lib/auth/session";
import { toDateInput } from "@/lib/time";
import { db } from "@/lib/db";
import { APP_LABEL, MACS_LABEL } from "./labels";

export const metadata = { title: "Програмын мэдэгдэл" };

export default async function AdminNotifications() {
  await requireStaff();
  const rows = await db.insertNotification.findMany({ orderBy: { seq: "desc" } });
  const now = new Date();
  return (
    <>
      <PageHeader
        action={{ href: "/admin/notifications/new", label: "Шинэ мэдэгдэл" }}
        description={<>MACS / POS програм нээгдэхэд харагдах мэдэгдэл (<code>/api/news-check</code>)</>}
        title="Програмын мэдэгдэл"
      />
      <Table empty={!rows.length} head={["Тайлбар", "Програм", "Хэнд", "Дуусах", "Төлөв"]}>
        {rows.map((r) => {
          const live = r.isActive === 1 && !!r.expireDate && r.expireDate > now;
          return (
            <tr className="hover:bg-surface/50" key={r.id}>
              <Td>
                <Link className="font-semibold text-fg hover:text-brand" href={`/admin/notifications/${r.id}`}>
                  {r.description || `#${r.id}`}
                </Link>
              </Td>
              <Td className="whitespace-nowrap">
                {APP_LABEL[r.apptype] ?? r.apptype} · {MACS_LABEL[r.macsversion] ?? r.macsversion}
              </Td>
              <Td>{r.toCustomer === 1 ? `${(r.customerId ?? "").split(",").filter(Boolean).length} харилцагч` : "Бүгд"}</Td>
              <Td className="whitespace-nowrap tabular-nums">{toDateInput(r.expireDate) || "—"}</Td>
              <Td>{live ? <Badge tone="accent">Идэвхтэй</Badge> : r.isActive ? <Badge>Хугацаа дууссан</Badge> : <Badge>Идэвхгүй</Badge>}</Td>
            </tr>
          );
        })}
      </Table>
    </>
  );
}
