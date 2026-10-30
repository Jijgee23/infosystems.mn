-- DropForeignKey
ALTER TABLE "product_issues" DROP CONSTRAINT "product_issues_user_id_fkey";

-- CreateIndex
CREATE INDEX "comparison_cells_product_id_idx" ON "comparison_cells"("product_id");

-- CreateIndex
CREATE INDEX "contact_requests_created_at_idx" ON "contact_requests"("created_at");

-- CreateIndex
CREATE INDEX "core_issue_files_file_id_idx" ON "core_issue_files"("file_id");

-- CreateIndex
CREATE INDEX "core_issues_category_id_idx" ON "core_issues"("category_id");

-- CreateIndex
CREATE INDEX "core_issues_created_at_idx" ON "core_issues"("created_at");

-- CreateIndex
CREATE INDEX "issue_answers_issue_id_created_at_idx" ON "issue_answers"("issue_id", "created_at");

-- CreateIndex
CREATE INDEX "issue_answers_user_id_idx" ON "issue_answers"("user_id");

-- CreateIndex
CREATE INDEX "issue_attachments_file_id_idx" ON "issue_attachments"("file_id");

-- CreateIndex
CREATE INDEX "product_issues_user_id_updated_at_idx" ON "product_issues"("user_id", "updated_at");

-- CreateIndex
CREATE INDEX "product_issues_product_id_idx" ON "product_issues"("product_id");

-- CreateIndex
CREATE INDEX "product_issues_updated_at_idx" ON "product_issues"("updated_at");

-- CreateIndex
CREATE INDEX "testimonials_product_id_idx" ON "testimonials"("product_id");

-- CreateIndex
CREATE INDEX "user_products_product_id_idx" ON "user_products"("product_id");

-- CreateIndex
CREATE INDEX "users_reset_token_idx" ON "users"("reset_token");

-- CreateIndex
CREATE INDEX "users_created_at_idx" ON "users"("created_at");

-- CreateIndex
CREATE INDEX "version_infos_productname_changed_date_idx" ON "version_infos"("productname", "changed_date");

-- CreateIndex
CREATE INDEX "version_infos_changed_date_idx" ON "version_infos"("changed_date");

-- AddForeignKey
ALTER TABLE "product_issues" ADD CONSTRAINT "product_issues_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
