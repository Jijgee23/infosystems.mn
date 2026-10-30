import Link from "next/link";
import { PageHeader } from "@/components/admin/ui";
import { requireStaff } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { AwardCard } from "./award-card";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { EditableItem, ItemList, ListToolbar, NewItem } from "@/components/admin/list-editor";
import { Badge } from "@/components/ui/form";
import { deleteAward } from "@/lib/actions/company";

export const metadata = { title: "Шагнал урамшуулал" };

export default async function AwardsPage() {
  await requireStaff({ admin: true });
  const awards = await db.award.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }], include: { image: { select: { url: true } } } });
  return (
    <>
      <PageHeader
        description={
          <>
            «Сайтад харуулах» сонгосон шагналууд{" "}
            <Link className="text-brand hover:underline" href="/about#awards" target="_blank">
              Бидний тухай › Шагнал урамшуулал
            </Link>{" "}
            хэсэгт гарна.
          </>
        }
        title="Шагнал урамшуулал"
      />
      <ListToolbar note={`${awards.length} шагнал`}>
        <NewItem label="Шагнал нэмэх">
          <AwardCard award={null} />
        </NewItem>
      </ListToolbar>
      <ItemList empty="Шагнал бүртгэгдээгүй байна.">
        {awards.map((a) => (
          <EditableItem
            actions={
              <ConfirmButton action={deleteAward.bind(null, a.id)} confirm={`«${a.title}»-г устгах уу?`} size="sm" variant="ghost">
                  Устгах
                </ConfirmButton>
            }
            key={a.id}
            summary={
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="" className="h-12 w-10 shrink-0 rounded-lg border border-line bg-surface object-contain" src={a.image.url} />
                <div className="min-w-0">
                  <p className="truncate font-medium text-fg">
                    {a.title} {!a.isPublic && <Badge>Нуусан</Badge>}
                  </p>
                  <p className="truncate text-xs text-fg-subtle">{[a.issuer, a.year].filter(Boolean).join(" · ")}</p>
                </div>
              </div>
            }
          >
            <AwardCard
              award={{
                id: a.id,
                title: a.title,
                issuer: a.issuer ?? "",
                year: a.year?.toString() ?? "",
                description: a.description ?? "",
                sortOrder: a.sortOrder,
                isPublic: a.isPublic,
                imageUrl: a.image.url,
              }}
            />
          </EditableItem>
        ))}
      </ItemList>
    </>
  );
}
