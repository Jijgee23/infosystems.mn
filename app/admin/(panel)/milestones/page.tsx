import Link from "next/link";
import { PageHeader } from "@/components/admin/ui";
import { requireStaff } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { MilestoneCard } from "./milestone-card";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { EditableItem, ItemList, ListToolbar, NewItem } from "@/components/admin/list-editor";
import { Badge } from "@/components/ui/form";
import { deleteMilestone } from "@/lib/actions/company";

export const metadata = { title: "Он цагийн хэлхээс" };

export default async function MilestonesPage() {
  await requireStaff({ admin: true });
  const milestones = await db.milestone.findMany({ orderBy: [{ year: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }] });
  return (
    <>
      <PageHeader
        description={
          <>
            Харагдах үйл явдлууд он дарааллаар{" "}
            <Link className="text-brand hover:underline" href="/about" target="_blank">
              Бидний тухай
            </Link>{" "}
            хуудасны «Он цагийн хэлхээс» хэсэгт гарна.
          </>
        }
        title="Он цагийн хэлхээс"
      />
      <ListToolbar note={`${milestones.length} үйл явдал, он дарааллаар`}>
        <NewItem label="Үйл явдал нэмэх">
          <MilestoneCard milestone={null} />
        </NewItem>
      </ListToolbar>
      <ItemList empty="Үйл явдал бүртгэгдээгүй байна.">
        {milestones.map((m) => (
          <EditableItem
            actions={
              <ConfirmButton action={deleteMilestone.bind(null, m.id)} confirm={`${m.year} — «${m.title}»-г устгах уу?`} size="sm" variant="ghost">
                  Устгах
                </ConfirmButton>
            }
            key={m.id}
            summary={
              <div className="flex items-baseline gap-4">
                <span className="w-12 shrink-0 font-display font-bold text-brand tabular-nums">{m.year}</span>
                <div className="min-w-0">
                  <p className="truncate font-medium text-fg">
                    {m.title} {!m.isPublic && <Badge>Нуусан</Badge>}
                  </p>
                  {m.description && <p className="truncate text-xs text-fg-subtle">{m.description}</p>}
                </div>
              </div>
            }
          >
            <MilestoneCard milestone={{ id: m.id, year: m.year, title: m.title, description: m.description ?? "", sortOrder: m.sortOrder, isPublic: m.isPublic }} />
          </EditableItem>
        ))}
      </ItemList>
    </>
  );
}
