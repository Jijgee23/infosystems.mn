import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/ui";
import { requireStaff } from "@/lib/auth/session";
import { getOrgTree } from "@/lib/data/org";
import { db } from "@/lib/db";
import { idParam } from "@/lib/ids";
import { EmployeeCard } from "../employee-card";

export const metadata = { title: "Ажилтан" };

export default async function AdminEmployeePage({ params }: PageProps<"/admin/employees/[id]">) {
  await requireStaff({ admin: true });
  const id = idParam((await params).id);
  if (!id) notFound();
  const [e, tree] = await Promise.all([
    db.employee.findUnique({
      where: { id },
      include: { photo: { select: { url: true } }, position: { select: { departmentId: true } } },
    }),
    getOrgTree(),
  ]);
  if (!e) notFound();

  return (
    <>
      <Link className="text-sm font-medium text-fg-muted hover:text-brand" href="/admin/employees">
        ← Ажилтнууд
      </Link>
      <div className="mt-3">
        <PageHeader title={e.name} />
      </div>
      <EmployeeCard
        departments={tree.map((d) => ({ id: d.id, label: d.path }))}
        employee={{
          id: e.id,
          name: e.name,
          departmentId: e.position.departmentId,
          positionId: e.positionId,
          phone: e.phone ?? "",
          email: e.email ?? "",
          bio: e.bio ?? "",
          sortOrder: e.sortOrder,
          isPublic: e.isPublic,
          photoUrl: e.photo?.url ?? null,
        }}
        positions={tree.flatMap((d) => d.positions.map((p) => ({ id: p.id, label: p.name, departmentId: d.id })))}
        standalone
      />
    </>
  );
}
