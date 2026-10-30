import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductSkeleton, ProductView } from "@/components/site/product-page";
import { getProductPage } from "@/lib/data/products";
import { ViewCounter } from "@/components/site/view-counter";
import { DEFAULT_OG_IMAGE } from "@/lib/site";

/** Product pages, built from the product and its blocks in admin (Бүтээгдэхүүн). */
export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const product = await getProductPage(decodeURIComponent((await params).slug), null);
  if (!product) return { title: "Бүтээгдэхүүн олдсонгүй | InfoSystems Mongolia" };
  return {
    title: `${product.name} | InfoSystems Mongolia`,
    description: product.summary,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: { title: product.name, description: product.summary, images: product.imageUrl ? [product.imageUrl] : [DEFAULT_OG_IMAGE] },
  };
}

export default function ProductPage(props: PageProps<"/products/[slug]">) {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <Product params={props.params} />
    </Suspense>
  );
}

async function Product({ params }: Pick<PageProps<"/products/[slug]">, "params">) {
  const product = await getProductPage(decodeURIComponent((await params).slug), null);
  if (!product) notFound();
  return (
    <>
      <ProductView product={product} />
      <ViewCounter id={product.id} kind="product" />
    </>
  );
}
