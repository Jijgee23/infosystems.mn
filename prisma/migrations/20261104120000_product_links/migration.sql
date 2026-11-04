-- CreateEnum
CREATE TYPE "ProductLinkKind" AS ENUM ('website', 'app_store', 'google_play', 'windows', 'other');

-- CreateTable
CREATE TABLE "product_links" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "kind" "ProductLinkKind" NOT NULL DEFAULT 'website',
    "label" VARCHAR(80),
    "url" VARCHAR(500) NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "product_links_product_id_sort_order_idx" ON "product_links"("product_id", "sort_order");

-- AddForeignKey
ALTER TABLE "product_links" ADD CONSTRAINT "product_links_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

