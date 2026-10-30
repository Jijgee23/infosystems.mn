import Link from "next/link";
import { PageHeader } from "@/components/admin/ui";
import { requireStaff } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { CaseForm } from "../case-form";

export const metadata = { title: "Шинэ амжилтын түүх" };

export default async function NewCaseStudyPage() {
  await requireStaff();
  const products = await db.product.findMany({ where: { parentId: null }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }], select: { id: true, name: true } });
  return (
    <>
      <Link className="text-sm font-medium text-fg-muted hover:text-brand" href="/admin/case-studies">
        ← Амжилтын түүх
      </Link>
      <div className="mt-3">
        <PageHeader description="Харилцагчийн зөвшөөрөлтэйгээр, бодит тоо баримттай бичнэ үү." title="Шинэ амжилтын түүх" />
      </div>
      <CaseForm
        products={products}
        value={{ title: "", slug: "", clientName: "", industry: "", summary: "", highlights: "", body: "", productIds: [], sortOrder: 0, published: false, coverUrl: null, logoUrl: null }}
      />
    </>
  );
}
