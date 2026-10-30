-- AlterTable
ALTER TABLE "core_issues" ADD COLUMN     "checked_at" TIMESTAMPTZ,
ADD COLUMN     "checked_by_id" TEXT;

-- AddForeignKey
ALTER TABLE "core_issues" ADD CONSTRAINT "core_issues_checked_by_id_fkey" FOREIGN KEY ("checked_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
