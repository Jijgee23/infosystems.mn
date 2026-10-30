import Link from "next/link";
import { notFound } from "next/navigation";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { PageHeader } from "@/components/admin/ui";
import { deleteCaseStudy } from "@/lib/actions/trust";
import { requireStaff } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { idParam } from "@/lib/ids";
import { sanitizeHtml } from "@/lib/sanitize";
import { CaseForm } from "../case-form";

export const metadata = { title: "Амжилтын түүх засах" };

export default async function EditCaseStudyPage({ params, searchParams }: PageProps<"/admin/case-studies/[id]">) {
  await requireStaff();
  const id = idParam((await params).id);
  const saved = (await searchParams).saved === "1";
  const [c, products] = await Promise.all([
    id
      ? db.caseStudy.findUnique({ where: { id }, include: { products: { select: { id: true } }, cover: { select: { url: true } }, logo: { select: { url: true } } } })
      : null,
    db.product.findMany({ where: { parentId: null }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }], select: { id: true, name: true } }),
  ]);
  if (!c) notFound();
  return (
    <>
      <Link className="text-sm font-medium text-fg-muted hover:text-brand" href="/admin/case-studies">
        ← Амжилтын түүх
      </Link>
      <div className="mt-3">
        <PageHeader
          description={
            c.publishedAt ? (
              <Link className="text-brand hover:underline" href={`/customers/${c.slug}`} target="_blank">
                Сайтад харах ↗
              </Link>
            ) : (
              "Нийтлээгүй"
            )
          }
          title={c.title}
        />
      </div>
      <CaseForm
        products={products}
        saved={saved}
        value={{
          id: c.id,
          title: c.title,
          slug: c.slug,
          clientName: c.clientName,
          industry: c.industry ?? "",
          summary: c.summary ?? "",
          highlights: c.highlights ?? "",
          body: sanitizeHtml(c.body),
          productIds: c.products.map((p) => p.id),
          sortOrder: c.sortOrder,
          published: !!c.publishedAt,
          coverUrl: c.cover?.url ?? null,
          logoUrl: c.logo?.url ?? null,
        }}
      />
      <div className="mt-10 border-t border-line pt-6">
        <ConfirmButton action={deleteCaseStudy.bind(null, c.id)} confirm={`«${c.title}»-г устгах уу?`} variant="danger">
          Түүх устгах
        </ConfirmButton>
      </div>
    </>
  );
}
