-- CreateTable
CREATE TABLE "guides" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(160) NOT NULL,
    "category" VARCHAR(64) NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "body" TEXT NOT NULL DEFAULT '',
    "content_date" DATE,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "published_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "guides_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "guides_slug_key" ON "guides"("slug");

-- CreateIndex
CREATE INDEX "guides_category_sort_order_idx" ON "guides"("category", "sort_order");
