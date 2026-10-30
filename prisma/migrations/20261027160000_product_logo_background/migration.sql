-- AlterTable
ALTER TABLE "products" ADD COLUMN     "background_id" TEXT,
ADD COLUMN     "logo_id" TEXT;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_logo_id_fkey" FOREIGN KEY ("logo_id") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_background_id_fkey" FOREIGN KEY ("background_id") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

