-- CreateTable
CREATE TABLE "downloads" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(160) NOT NULL,
    "description" VARCHAR(500),
    "file_id" TEXT,
    "external_url" VARCHAR(512),
    "guide_slug" VARCHAR(160),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "downloads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "downloads_is_public_sort_order_idx" ON "downloads"("is_public", "sort_order");

-- CreateIndex
CREATE INDEX "downloads_file_id_idx" ON "downloads"("file_id");

-- AddForeignKey
ALTER TABLE "downloads" ADD CONSTRAINT "downloads_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;
