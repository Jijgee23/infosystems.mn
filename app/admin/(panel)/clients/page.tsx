import { PageHeader } from "@/components/admin/ui";
import { requireStaff } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { ClientCard } from "./client-card";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { EditableItem, ItemList, ListToolbar, NewItem } from "@/components/admin/list-editor";
import { Badge } from "@/components/ui/form";
import { deleteClientLogo } from "@/lib/actions/trust";

export const metadata = { title: "Харилцагчийн лого" };

export default async function ClientsPage() {
  await requireStaff({ admin: true });
  const items = await db.clientLogo.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }], include: { logo: { select: { url: true } } } });
  return (
    <>
      <PageHeader description="Нүүр хуудас болон «Амжилтын түүх» хуудасны «Бидэнд итгэдэг байгууллагууд» хэсэгт өнгөтөөр гарна. Тухайн байгууллагын зөвшөөрөлтэйгээр оруулна уу." title="Харилцагчийн лого" />
      <ListToolbar note={`${items.length} лого`}>
        <NewItem label="Лого нэмэх">
          <ClientCard item={null} />
        </NewItem>
      </ListToolbar>
      <ItemList empty="Лого бүртгэгдээгүй байна.">
        {items.map((c) => (
          <EditableItem
            actions={
              <ConfirmButton action={deleteClientLogo.bind(null, c.id)} confirm={`«${c.name}»-г устгах уу?`} size="sm" variant="ghost">
                  Устгах
                </ConfirmButton>
            }
            key={c.id}
            summary={
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-20 shrink-0 place-items-center rounded-lg border border-line bg-white p-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img alt="" className="max-h-full max-w-full object-contain" src={c.logo.url} />
                </span>
                <div className="min-w-0">
                  <p className="truncate font-medium text-fg">
                    {c.name} {!c.isPublic && <Badge>Нуусан</Badge>}
                  </p>
                  {c.url && <p className="truncate text-xs text-fg-subtle">{c.url.replace(/^https?:\/\/(www\.)?/, "")}</p>}
                </div>
              </div>
            }
          >
            <ClientCard item={{ id: c.id, name: c.name, url: c.url ?? "", isPublic: c.isPublic, sortOrder: c.sortOrder, logoUrl: c.logo.url }} />
          </EditableItem>
        ))}
      </ItemList>
    </>
  );
}
