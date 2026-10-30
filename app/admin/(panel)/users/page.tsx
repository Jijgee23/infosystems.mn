import Link from "next/link";
import { registerLabel } from "@/lib/register-number";
import { FilterTabs, fmtDateTime, PageHeader, Table, Td } from "@/components/admin/ui";
import { Badge } from "@/components/ui/form";
import { requireStaff } from "@/lib/auth/session";
import { db } from "@/lib/db";
import type { Prisma } from "@/lib/generated/prisma/client";

export const metadata = { title: "Хэрэглэгчид" };

const FILTERS: Record<string, Prisma.UserWhereInput> = {
  pending: { adminConfirmed: false, blocked: false },
  staff: { role: { in: ["admin", "employee"] } },
  blocked: { blocked: true },
  individual: { role: "customer", customerType: "individual" },
};

export default async function AdminUsers({ searchParams }: PageProps<"/admin/users">) {
  await requireStaff();
  const sp = await searchParams;
  const filter = typeof sp.filter === "string" ? sp.filter : "";
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const contains = (v: string) => ({ contains: v, mode: "insensitive" as const });
  const search: Prisma.UserWhereInput = q
    ? {
        OR: [
          { email: contains(q) },
          { companyName: contains(q) },
          { username: contains(q) },
          { personalRegister: contains(q.replace(/\s+/g, "")) },
          ...(/^\d{1,18}$/.test(q) ? [{ companyRegister: BigInt(q) }] : []),
        ],
      }
    : {};
  const users = await db.user.findMany({
    where: { AND: [FILTERS[filter] ?? {}, search] },
    orderBy: { createdAt: "desc" },
    take: 300,
  });

  return (
    <>
      <PageHeader description="Харилцагч байгууллага, хувь хүмүүс болон ажилтнууд" title="Хэрэглэгчид" />
      <div className="flex flex-wrap items-start justify-between gap-3">
        <FilterTabs
          base="/admin/users"
          current={filter}
          tabs={[
            { value: "", label: "Бүгд" },
            { value: "pending", label: "Баталгаажуулах" },
            { value: "individual", label: "Хувь хүн" },
            { value: "staff", label: "Ажилтан" },
            { value: "blocked", label: "Хаагдсан" },
          ]}
        />
        <form className="mb-4">
          {filter && <input name="filter" type="hidden" value={filter} />}
          <input className="h-9 w-64 rounded-full border border-line bg-card px-4 text-sm text-fg focus:border-brand focus:outline-none" defaultValue={q} name="q" placeholder="Хайх: нэр, и-мэйл, РД" type="search" />
        </form>
      </div>
      <Table empty={!users.length} head={["Харилцагч", "РД", "И-мэйл", "Эрх", "Төлөв", "Бүртгүүлсэн"]}>
        {users.map((u) => (
          <tr className="hover:bg-surface/50" key={u.id}>
            <Td>
              <Link className="font-semibold text-fg hover:text-brand" href={`/admin/users/${u.id}`}>
                {u.companyName || u.username}
              </Link>
              {u.companyName && <span className="block text-xs text-fg-subtle">{u.username}</span>}
              {u.role === "customer" && u.customerType === "individual" && <span className="block text-xs text-fg-subtle">Хувь хүн</span>}
            </Td>
            <Td className="whitespace-nowrap tabular-nums">{registerLabel(u) ?? "—"}</Td>
            <Td>{u.email}</Td>
            <Td>{u.role === "admin" ? <Badge tone="brand">Админ</Badge> : u.role === "employee" ? <Badge tone="brand">Ажилтан</Badge> : "Харилцагч"}</Td>
            <Td>
              {u.blocked ? <Badge tone="danger">Хаагдсан</Badge> : u.adminConfirmed ? <Badge tone="accent">Идэвхтэй</Badge> : <Badge tone="warn">Хүлээгдэж буй</Badge>}
            </Td>
            <Td className="whitespace-nowrap text-fg-muted">{fmtDateTime(u.createdAt)}</Td>
          </tr>
        ))}
      </Table>
    </>
  );
}
