-- AlterTable
ALTER TABLE "products" ADD COLUMN     "in_comparison" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "solutions" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "version_names" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "video_url" VARCHAR(500);

-- CreateTable
CREATE TABLE "testimonials" (
    "id" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "author_name" VARCHAR(120) NOT NULL,
    "author_title" VARCHAR(120),
    "company_name" VARCHAR(160),
    "photo_id" TEXT,
    "product_id" TEXT,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "testimonials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_logos" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "logo_id" TEXT NOT NULL,
    "url" VARCHAR(500),
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "client_logos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "case_studies" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(160) NOT NULL,
    "client_name" VARCHAR(160) NOT NULL,
    "industry" VARCHAR(120),
    "summary" TEXT,
    "body" TEXT NOT NULL DEFAULT '',
    "highlights" TEXT,
    "cover_id" TEXT,
    "logo_id" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "published_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "case_studies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_stats" (
    "id" TEXT NOT NULL,
    "value" VARCHAR(40) NOT NULL,
    "label" VARCHAR(120) NOT NULL,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "company_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comparison_rows" (
    "id" TEXT NOT NULL,
    "label" VARCHAR(160) NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "comparison_rows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comparison_cells" (
    "id" TEXT NOT NULL,
    "row_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "value" VARCHAR(255) NOT NULL,

    CONSTRAINT "comparison_cells_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CaseStudyToProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CaseStudyToProduct_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "testimonials_is_public_sort_order_idx" ON "testimonials"("is_public", "sort_order");

-- CreateIndex
CREATE INDEX "client_logos_is_public_sort_order_idx" ON "client_logos"("is_public", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "case_studies_slug_key" ON "case_studies"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "comparison_cells_row_id_product_id_key" ON "comparison_cells"("row_id", "product_id");

-- CreateIndex
CREATE INDEX "_CaseStudyToProduct_B_index" ON "_CaseStudyToProduct"("B");

-- AddForeignKey
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_photo_id_fkey" FOREIGN KEY ("photo_id") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_logos" ADD CONSTRAINT "client_logos_logo_id_fkey" FOREIGN KEY ("logo_id") REFERENCES "files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_cover_id_fkey" FOREIGN KEY ("cover_id") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_logo_id_fkey" FOREIGN KEY ("logo_id") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comparison_cells" ADD CONSTRAINT "comparison_cells_row_id_fkey" FOREIGN KEY ("row_id") REFERENCES "comparison_rows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comparison_cells" ADD CONSTRAINT "comparison_cells_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CaseStudyToProduct" ADD CONSTRAINT "_CaseStudyToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "case_studies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CaseStudyToProduct" ADD CONSTRAINT "_CaseStudyToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

