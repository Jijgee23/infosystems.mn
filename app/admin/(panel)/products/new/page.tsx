import Link from "next/link";
import { PageHeader } from "@/components/admin/ui";
import { requireStaff } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { idParam } from "@/lib/ids";
import { ProductForm } from "../product-form";

export const metadata = { title: "Шинэ бүтээгдэхүүн" };

/** New product; `?parent=<id>` starts it as a module of that product. */
export default async function NewProductPage({ searchParams }: PageProps<"/admin/products/new">) {
  await requireStaff();
  const parentId = idParam((await searchParams).parent);
  const parents = await db.product.findMany({ where: { parentId: null }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }], select: { id: true, name: true, group: true } });
  const parent = parents.find((p) => p.id === parentId);
  return (
    <>
      <Link className="text-sm font-medium text-fg-muted hover:text-brand" href={parent ? `/admin/products/${parent.id}` : "/admin/products"}>
        ← {parent ? parent.name : "Бүтээгдэхүүн"}
      </Link>
      <div className="mt-3">
        <PageHeader description="Хадгалсны дараа хуудасны агуулга нэмж, харилцагч оноох боломжтой." title={parent ? `${parent.name}: шинэ модуль` : "Шинэ бүтээгдэхүүн"} />
      </div>
      <ProductForm
        currentMain={parents.find((x) => x.group === "main")?.name}
        parents={parents}
        product={{
          name: "",
          title: "",
          slug: "",
          tagline: "",
          icon: "package",
          badge: "",
          status: "available",
          group: "other",
          sortOrder: 0,
          parentId: parent?.id ?? "",
          listed: true,
          published: true,
          imageUrl: null,
          logoUrl: null,
          backgroundUrl: null,
          videoUrl: "",
          versionNames: "",
          solutions: [],
          inComparison: false,
        }}
      />
    </>
  );
}
