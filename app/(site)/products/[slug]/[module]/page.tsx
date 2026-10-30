import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ModuleView, ProductSkeleton } from "@/components/site/product-page";
import { getProductPage } from "@/lib/data/products";
import { ViewCounter } from "@/components/site/view-counter";

/** Module pages, e.g. /products/macs-erp/accounting. */
export async function generateMetadata({ params }: PageProps<"/products/[slug]/[module]">): Promise<Metadata> {
  const { slug, module } = await params;
  const product = await getProductPage(decodeURIComponent(module), decodeURIComponent(slug));
  if (!product) return { title: "Модуль олдсонгүй | InfoSystems Mongolia" };
  return {
    title: `${product.name} — ${product.parent?.name} | InfoSystems Mongolia`,
    description: product.summary,
    alternates: { canonical: `/products/${product.parent?.slug}/${product.slug}` },
  };
}

export default function ModulePage(props: PageProps<"/products/[slug]/[module]">) {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <Module params={props.params} />
    </Suspense>
  );
}

async function Module({ params }: Pick<PageProps<"/products/[slug]/[module]">, "params">) {
  const { slug, module } = await params;
  const product = await getProductPage(decodeURIComponent(module), decodeURIComponent(slug));
  if (!product) notFound();
  return (
    <>
      <ModuleView product={product} />
      <ViewCounter id={product.id} kind="product" />
    </>
  );
}
