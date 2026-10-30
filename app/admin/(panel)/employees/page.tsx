import Link from "next/link";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { EditableItem, ItemList, ListToolbar, NewItem } from "@/components/admin/list-editor";
import { PageHeader } from "@/components/admin/ui";
import { Badge } from "@/components/ui/form";
import { deleteEmployee } from "@/lib/actions/company";
import { requireStaff } from "@/lib/auth/session";
import { getOrgTree } from "@/lib/data/org";
import { db } from "@/lib/db";
import { EmployeeCard } from "./employee-card";

export const metadata = { title: "Ажилтнууд" };

export default async function EmployeesPage() {
  await requireStaff({ admin: true });
  const [rows, tree] = await Promise.all([
    db.employee.findMany({
      orderBy: [{ position: { department: { sortOrder: "asc" } } }, { position: { sortOrder: "asc" } }, { sortOrder: "asc" }, { createdAt: "asc" }],
      include: { photo: { select: { url: true } }, position: { select: { departmentId: true } } },
    }),
    getOrgTree(),
  ]);
  const departments = tree.map((d) => ({ id: d.id, label: d.path }));
  const positionOptions = tree.flatMap((d) => d.positions.map((p) => ({ id: p.id, label: p.name, departmentId: d.id })));
  const ready = positionOptions.length > 0;

  return (
    <>
      <PageHeader description="«Сайтад харуулах» сонгосон ажилтнууд Бидний тухай хуудасны «Хамт олон» хэсэгт гарна." title="Ажилтнууд" />
      {!ready ? (
        <div className="rounded-3xl border border-dashed border-line bg-card p-8 text-center">
          <p className="font-semibold text-fg">Эхлээд хэлтэс, тасаг болон түүний албан тушаалуудыг бүртгэнэ үү.</p>
          <p className="mt-1 text-sm text-fg-muted">Ажилтан бүр хэлтэст харьяалагдах албан тушаалтай байна.</p>
          <Link className="mt-4 inline-block font-semibold text-brand hover:underline" href="/admin/departments">
            Хэлтэс, албан тушаал бүртгэх →
          </Link>
        </div>
      ) : (
        <>
          <ListToolbar note={`${rows.length} ажилтан · ${rows.filter((e) => e.isPublic).length} нь сайтад харагдана`}>
            <NewItem label="Ажилтан нэмэх">
              <EmployeeCard departments={departments} employee={null} positions={positionOptions} />
            </NewItem>
          </ListToolbar>
          <ItemList empty="Ажилтан бүртгэгдээгүй байна.">
            {rows.map((e) => {
              const position = positionOptions.find((p) => p.id === e.positionId);
              const department = departments.find((d) => d.id === e.position.departmentId);
              return (
                <EditableItem
                  actions={
                    <ConfirmButton action={deleteEmployee.bind(null, e.id)} confirm={`${e.name}-г устгах уу?`} size="sm" variant="ghost">
                      Устгах
                    </ConfirmButton>
                  }
                  key={e.id}
                  summary={
                    <div className="flex items-center gap-3">
                      {e.photo?.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" src={e.photo.url} />
                      ) : (
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-surface font-semibold text-fg-muted">{e.name.charAt(0)}</span>
                      )}
                      <div className="min-w-0">
                        <p className="truncate font-medium text-fg">
                          {e.name} {!e.isPublic && <Badge>Нуусан</Badge>}
                        </p>
                        <p className="truncate text-xs text-fg-subtle">{[position?.label, department?.label, e.phone, e.email].filter(Boolean).join(" · ")}</p>
                      </div>
                    </div>
                  }
                >
                  <EmployeeCard
                    departments={departments}
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
                    positions={positionOptions}
                  />
                </EditableItem>
              );
            })}
          </ItemList>
        </>
      )}
    </>
  );
}
