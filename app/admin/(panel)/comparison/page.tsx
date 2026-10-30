import Link from "next/link";
import { PageHeader } from "@/components/admin/ui";
import { requireStaff } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { ComparisonRowForm } from "./comparison-row";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { EditableItem, ItemList, ListToolbar, NewItem } from "@/components/admin/list-editor";
import { deleteComparisonRow } from "@/lib/actions/trust";

export const metadata = { title: "Бүтээгдэхүүн харьцуулах" };

export default async function ComparisonPage() {
  await requireStaff();
  const [products, rows] = await Promise.all([
    db.product.findMany({ where: { inComparison: true, parentId: null }, orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }], select: { id: true, name: true } }),
    db.comparisonRow.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }], include: { cells: true } }),
  ]);
  return (
    <>
      <PageHeader
        description={
          <>
            <Link className="text-brand hover:underline" href="/products#compare" target="_blank">
              /products
            </Link>{" "}
            хуудасны хүснэгт. Багана нь бүтээгдэхүүний тохиргооны «Харьцуулах хүснэгтэд» сонголттой бүтээгдэхүүнүүд. «✓» нь тэмдэг, «—» нь байхгүй гэж гарна. Хоосон нүд хоосон харагдана.
          </>
        }
        title="Бүтээгдэхүүн харьцуулах"
      />
      {products.length < 2 ? (
        <p className="rounded-3xl border border-dashed border-line p-6 text-sm text-fg-muted">
          Хүснэгт гарахад дор хаяж 2 бүтээгдэхүүн хэрэгтэй. <Link className="font-semibold text-brand hover:underline" href="/admin/products">Бүтээгдэхүүн</Link>-ий тохиргооноос «Харьцуулах хүснэгтэд»-ийг сонгоно уу.
        </p>
      ) : (
        <>
          <ListToolbar note={`${rows.length} мөр · ${products.length} бүтээгдэхүүн: ${products.map((p) => p.name).join(", ")}`}>
            <NewItem label="Мөр нэмэх">
              <div className="overflow-x-auto">
                <div className="min-w-[48rem]">
                  <ComparisonRowForm products={products} row={null} />
                </div>
              </div>
            </NewItem>
          </ListToolbar>
          <ItemList empty="Мөр нэмээгүй байна.">
            {rows.map((r) => {
              const values = Object.fromEntries(r.cells.map((c) => [c.productId, c.value]));
              return (
                <EditableItem
                  actions={
                    <ConfirmButton action={deleteComparisonRow.bind(null, r.id)} confirm={`«${r.label}» мөрийг устгах уу?`} size="sm" variant="ghost">
                  Устгах
                </ConfirmButton>
                  }
                  key={r.id}
                  summary={
                    <div className="min-w-0">
                      <p className="truncate font-medium text-fg">{r.label}</p>
                      <p className="truncate text-xs text-fg-subtle">{products.map((p) => `${p.name}: ${values[p.id] || "—"}`).join(" · ")}</p>
                    </div>
                  }
                >
                  <div className="overflow-x-auto">
                    <div className="min-w-[48rem]">
                      <ComparisonRowForm products={products} row={{ id: r.id, label: r.label, sortOrder: r.sortOrder, values }} />
                    </div>
                  </div>
                </EditableItem>
              );
            })}
          </ItemList>
        </>
      )}
    </>
  );
}
