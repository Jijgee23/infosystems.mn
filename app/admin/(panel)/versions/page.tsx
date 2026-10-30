import { PageHeader } from "@/components/admin/ui";
import { requireStaff } from "@/lib/auth/session";
import { toDateInput } from "@/lib/time";
import { db } from "@/lib/db";
import { VersionRow } from "./version-row";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { EditableItem, ItemList, ListToolbar, NewItem } from "@/components/admin/list-editor";
import { deleteVersion } from "@/lib/actions/admin";

export const metadata = { title: "Хувилбарын түүх" };

export default async function AdminVersions() {
  await requireStaff();
  const rows = await db.versionInfo.findMany({ orderBy: [{ changedDate: "desc" }, { seq: "desc" }], take: 500 });
  return (
    <>
      <PageHeader description={<>MACS / POS програмын шинэчлэлийн тэмдэглэл. Програмууд <code>/api/version-infos</code>-оос уншина.</>} title="Хувилбарын түүх" />
      <ListToolbar note={`${rows.length} тэмдэглэл, шинэ нь эхэндээ`}>
        <NewItem label="Тэмдэглэл нэмэх">
          <VersionRow row={null} />
        </NewItem>
      </ListToolbar>
      <ItemList empty="Тэмдэглэл алга.">
        {rows.map((r) => (
          <EditableItem
            actions={
              <ConfirmButton action={deleteVersion.bind(null, r.id)} confirm={"Энэ тэмдэглэлийг устгах уу?"} size="sm" variant="ghost">
                  Устгах
                </ConfirmButton>
            }
            key={r.id}
            summary={
              <div className="flex items-baseline gap-3">
                <span className="shrink-0 text-xs text-fg-subtle tabular-nums">{toDateInput(r.changedDate)}</span>
                <span className="shrink-0 rounded-full bg-surface px-2 py-0.5 text-xs font-semibold text-fg-muted">{r.productname ?? "MACS"}</span>
                <span className="min-w-0 truncate text-sm text-fg">{r.description}</span>
              </div>
            }
          >
            <VersionRow row={{ id: r.id, changedDate: toDateInput(r.changedDate), productname: r.productname ?? "MACS", description: r.description ?? "" }} />
          </EditableItem>
        ))}
      </ItemList>
    </>
  );
}
