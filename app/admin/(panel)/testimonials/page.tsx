import { PageHeader } from "@/components/admin/ui";
import { requireStaff } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { TestimonialCard } from "./testimonial-card";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { EditableItem, ItemList, ListToolbar, NewItem } from "@/components/admin/list-editor";
import { Badge } from "@/components/ui/form";
import { deleteTestimonial } from "@/lib/actions/trust";

export const metadata = { title: "Хэрэглэгчийн сэтгэгдэл" };

export default async function TestimonialsPage() {
  await requireStaff({ admin: true });
  const [items, products] = await Promise.all([
    db.testimonial.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }], include: { photo: { select: { url: true } } } }),
    db.product.findMany({ where: { parentId: null }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }], select: { id: true, name: true } }),
  ]);
  return (
    <>
      <PageHeader description="Нүүр хуудас, «Амжилтын түүх» болон сонгосон бүтээгдэхүүний хуудсанд гарна. Хэрэглэгчийн зөвшөөрөлтэйгээр, бодит нэрээр оруулна уу." title="Хэрэглэгчийн сэтгэгдэл" />
      <ListToolbar note={`${items.length} сэтгэгдэл`}>
        <NewItem label="Сэтгэгдэл нэмэх">
          <TestimonialCard item={null} products={products} />
        </NewItem>
      </ListToolbar>
      <ItemList empty="Сэтгэгдэл бүртгэгдээгүй байна.">
        {items.map((t) => (
          <EditableItem
            actions={
              <ConfirmButton action={deleteTestimonial.bind(null, t.id)} confirm={`${t.authorName}-ийн сэтгэгдлийг устгах уу?`} size="sm" variant="ghost">
                  Устгах
                </ConfirmButton>
            }
            key={t.id}
            summary={
              <div className="flex items-center gap-3">
                {t.photo?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" src={t.photo.url} />
                ) : (
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-surface font-semibold text-fg-muted">{t.authorName.charAt(0)}</span>
                )}
                <div className="min-w-0">
                  <p className="truncate font-medium text-fg">
                    {t.authorName}
                    {t.companyName && <span className="font-normal text-fg-subtle"> · {t.companyName}</span>} {!t.isPublic && <Badge>Нуусан</Badge>}
                  </p>
                  <p className="truncate text-xs text-fg-subtle">“{t.quote}”</p>
                </div>
              </div>
            }
          >
            <TestimonialCard
              item={{
                id: t.id,
                quote: t.quote,
                authorName: t.authorName,
                authorTitle: t.authorTitle ?? "",
                companyName: t.companyName ?? "",
                productId: t.productId ?? "",
                isPublic: t.isPublic,
                sortOrder: t.sortOrder,
                photoUrl: t.photo?.url ?? null,
              }}
              products={products}
            />
          </EditableItem>
        ))}
      </ItemList>
    </>
  );
}
