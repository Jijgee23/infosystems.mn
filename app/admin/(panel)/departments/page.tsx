import { EditableItem, ListToolbar, NewItem } from "@/components/admin/list-editor";
import { PageHeader } from "@/components/admin/ui";
import { deleteDepartment, deletePosition } from "@/lib/actions/company";
import { requireStaff } from "@/lib/auth/session";
import { getOrgTree } from "@/lib/data/org";
import { DeleteButton, DepartmentForm, PositionRow } from "./org-rows";

export const metadata = { title: "Хэлтэс, албан тушаал" };

export default async function DepartmentsPage() {
  await requireStaff({ admin: true });
  const tree = await getOrgTree();
  const options = tree.map((d) => ({ id: d.id, label: d.path }));
  const positions = tree.reduce((n, d) => n + d.positions.length, 0);
  return (
    <>
      <PageHeader
        description="Албан тушаал бүр нэг хэлтэс, тасагт харьяалагдана. Ажилтан бүртгэхдээ албан тушаалаа сонгоход хэлтэс нь автоматаар тодорхойлогдоно."
        title="Хэлтэс, албан тушаал"
      />
      <ListToolbar note={`${tree.length} хэлтэс, тасаг · ${positions} албан тушаал`}>
        <NewItem label="Хэлтэс нэмэх">
          <DepartmentForm dept={null} options={options} />
        </NewItem>
      </ListToolbar>
      {tree.length === 0 && <p className="rounded-3xl border border-dashed border-line p-8 text-center text-sm text-fg-subtle">Хэлтэс бүртгэгдээгүй байна.</p>}
      <div className="space-y-4">
        {tree.map((d) => (
          <section className="overflow-hidden rounded-3xl border border-line bg-card" key={d.id} style={{ marginLeft: `${Math.min(d.depth, 4) * 1.5}rem` }}>
            <ul>
              <EditableItem
                actions={<DeleteButton action={deleteDepartment.bind(null, d.id)} confirm={`«${d.name}»-г устгах уу?`} />}
                summary={
                  <div className="min-w-0">
                    {d.depth > 0 && <p className="truncate text-xs text-fg-subtle">{d.path.split(" › ").slice(0, -1).join(" › ")} ›</p>}
                    <p className="truncate font-semibold text-fg">{d.name}</p>
                    <p className="text-xs text-fg-subtle">
                      {d.employees} ажилтан · {d.positions.length} албан тушаал{d.children ? ` · ${d.children} дэд хэлтэс` : ""}
                    </p>
                  </div>
                }
              >
                <DepartmentForm dept={{ id: d.id, name: d.name, parentId: d.parentId, sortOrder: d.sortOrder, employees: d.employees, children: d.children, positions: d.positions.length }} options={options} />
              </EditableItem>
            </ul>
            <div className="border-t border-line bg-surface/40">
              <div className="flex flex-wrap items-center justify-between gap-2 px-4 pt-3 pb-2">
                <p className="text-xs font-semibold tracking-wide text-fg-subtle uppercase">Албан тушаал</p>
                <NewItem label="Албан тушаал нэмэх" variant="secondary">
                  <PositionRow departmentId={d.id} options={options} position={null} />
                </NewItem>
              </div>
              {d.positions.length > 0 ? (
                <ul className="divide-y divide-line border-t border-line">
                  {d.positions.map((p) => (
                    <EditableItem
                      actions={<DeleteButton action={deletePosition.bind(null, p.id)} confirm={`«${p.name}»-г устгах уу?`} />}
                      key={p.id}
                      summary={
                        <p className="truncate text-sm">
                          <span className="font-medium text-fg">{p.name}</span> <span className="text-xs text-fg-subtle">· {p.employees} ажилтан</span>
                        </p>
                      }
                    >
                      <PositionRow departmentId={d.id} options={options} position={p} />
                    </EditableItem>
                  ))}
                </ul>
              ) : (
                <p className="px-4 pb-3 text-sm text-fg-subtle">Албан тушаал алга.</p>
              )}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
