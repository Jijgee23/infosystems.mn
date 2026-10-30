-- CreateEnum
CREATE TYPE "product_status" AS ENUM ('available', 'coming_soon');

-- CreateEnum
CREATE TYPE "product_group" AS ENUM ('main', 'featured', 'other');

-- CreateEnum
CREATE TYPE "product_block_kind" AS ENUM ('text', 'features', 'links');

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "group" "product_group" NOT NULL DEFAULT 'other',
ADD COLUMN     "icon" VARCHAR(40),
ADD COLUMN     "listed" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "name" VARCHAR(120) NOT NULL DEFAULT '',
ADD COLUMN     "parent_id" TEXT,
ADD COLUMN     "sort_order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "status" "product_status" NOT NULL DEFAULT 'available',
ADD COLUMN     "tagline" VARCHAR(255);

-- Existing rows: short name starts as the full title (edited in admin / by the content import).
UPDATE "products" SET "name" = LEFT("title", 120);
ALTER TABLE "products" ALTER COLUMN "name" DROP DEFAULT;

-- CreateTable
CREATE TABLE "product_blocks" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "kind" "product_block_kind" NOT NULL,
    "heading" VARCHAR(255),
    "style" VARCHAR(20),
    "body" TEXT,
    "columns" INTEGER NOT NULL DEFAULT 1,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "product_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_block_items" (
    "id" TEXT NOT NULL,
    "block_id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "body" TEXT,
    "href" VARCHAR(500),
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "product_block_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "product_blocks_product_id_sort_order_idx" ON "product_blocks"("product_id", "sort_order");

-- CreateIndex
CREATE INDEX "product_block_items_block_id_sort_order_idx" ON "product_block_items"("block_id", "sort_order");

-- CreateIndex
CREATE INDEX "products_parent_id_sort_order_idx" ON "products"("parent_id", "sort_order");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_blocks" ADD CONSTRAINT "product_blocks_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_block_items" ADD CONSTRAINT "product_block_items_block_id_fkey" FOREIGN KEY ("block_id") REFERENCES "product_blocks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

