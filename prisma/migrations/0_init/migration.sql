-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('customer', 'employee', 'admin');

-- CreateEnum
CREATE TYPE "contact_kind" AS ENUM ('demo', 'quote', 'feedback', 'notify');

-- CreateEnum
CREATE TYPE "contact_type" AS ENUM ('phone', 'email', 'social');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "legacy_id" INTEGER,
    "username" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255),
    "company_name" VARCHAR(255),
    "company_register" BIGINT,
    "role" "user_role" NOT NULL DEFAULT 'customer',
    "admin_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "blocked" BOOLEAN NOT NULL DEFAULT false,
    "seen" BOOLEAN NOT NULL DEFAULT false,
    "reset_token" VARCHAR(255),
    "reset_token_expires" TIMESTAMPTZ,
    "password_changed_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "files" (
    "id" TEXT NOT NULL,
    "legacy_id" INTEGER,
    "name" VARCHAR(255) NOT NULL,
    "alternative_text" VARCHAR(255),
    "hash" VARCHAR(255) NOT NULL,
    "ext" VARCHAR(32),
    "mime" VARCHAR(255) NOT NULL,
    "size_kb" INTEGER,
    "width" INTEGER,
    "height" INTEGER,
    "url" VARCHAR(512) NOT NULL,
    "formats" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL,
    "legacy_id" INTEGER,
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "category" VARCHAR(255),
    "excerpt" TEXT,
    "body" TEXT NOT NULL DEFAULT '',
    "image_id" TEXT,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "published_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "legacy_id" INTEGER,
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "category" VARCHAR(255),
    "description" TEXT,
    "image_id" TEXT,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "published_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_products" (
    "user_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "user_products_pkey" PRIMARY KEY ("user_id","product_id")
);

-- CreateTable
CREATE TABLE "product_issues" (
    "id" TEXT NOT NULL,
    "legacy_id" INTEGER,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "product_id" TEXT,
    "user_id" TEXT,
    "admin_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "seen" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_issues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "issue_answers" (
    "id" TEXT NOT NULL,
    "legacy_id" INTEGER,
    "issue_id" TEXT NOT NULL,
    "user_id" TEXT,
    "content" TEXT NOT NULL,
    "seen" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "issue_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "issue_attachments" (
    "issue_id" TEXT NOT NULL,
    "file_id" TEXT NOT NULL,

    CONSTRAINT "issue_attachments_pkey" PRIMARY KEY ("issue_id","file_id")
);

-- CreateTable
CREATE TABLE "project_categories" (
    "id" TEXT NOT NULL,
    "legacy_id" INTEGER,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core_issues" (
    "id" TEXT NOT NULL,
    "legacy_id" INTEGER,
    "name" VARCHAR(255),
    "email" VARCHAR(255),
    "title" VARCHAR(255),
    "description" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "category_id" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "core_issues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core_issue_files" (
    "core_issue_id" TEXT NOT NULL,
    "file_id" TEXT NOT NULL,

    CONSTRAINT "core_issue_files_pkey" PRIMARY KEY ("core_issue_id","file_id")
);

-- CreateTable
CREATE TABLE "contact_requests" (
    "id" TEXT NOT NULL,
    "legacy_id" INTEGER,
    "kind" "contact_kind" NOT NULL DEFAULT 'demo',
    "name" VARCHAR(255),
    "company" VARCHAR(255),
    "phone" VARCHAR(64),
    "email" VARCHAR(255),
    "product" VARCHAR(255),
    "message" TEXT,
    "seen" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "insert_notifications" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "description" VARCHAR(255),
    "macsversion" INTEGER NOT NULL DEFAULT 0,
    "apptype" INTEGER NOT NULL DEFAULT 0,
    "to_customer" INTEGER NOT NULL DEFAULT 0,
    "filetype" INTEGER NOT NULL DEFAULT 0,
    "is_active" INTEGER NOT NULL DEFAULT 1,
    "expire_date" DATE,
    "acount" INTEGER,
    "news_text" TEXT,
    "pdf_file" VARCHAR(255),
    "file_url" VARCHAR(255),
    "customer_id" TEXT,
    "published_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "insert_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "version_infos" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "changed_date" DATE NOT NULL,
    "description" TEXT,
    "productname" VARCHAR(32),
    "published_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "version_infos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_settings" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL DEFAULT 'InfoSystems Mongolia',
    "legal_name" VARCHAR(255),
    "short_description" TEXT,
    "about" TEXT,
    "founded_year" INTEGER,
    "address" TEXT,
    "location_name" VARCHAR(255),
    "latitude" DECIMAL(9,6),
    "longitude" DECIMAL(9,6),
    "map_url" VARCHAR(1024),
    "working_hours" VARCHAR(255),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "company_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_contacts" (
    "id" TEXT NOT NULL,
    "type" "contact_type" NOT NULL,
    "label" VARCHAR(120),
    "value" VARCHAR(512) NOT NULL,
    "show_in_footer" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "company_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departments" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "parent_id" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "positions" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "department_id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "positions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "position_id" TEXT NOT NULL,
    "phone" VARCHAR(64),
    "email" VARCHAR(255),
    "bio" TEXT,
    "photo_id" TEXT,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "awards" (
    "id" TEXT NOT NULL,
    "legacy_id" INTEGER,
    "title" VARCHAR(255) NOT NULL,
    "issuer" VARCHAR(255),
    "year" INTEGER,
    "description" TEXT,
    "image_id" TEXT NOT NULL,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "awards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_legacy_id_key" ON "users"("legacy_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_company_register_key" ON "users"("company_register");

-- CreateIndex
CREATE UNIQUE INDEX "files_legacy_id_key" ON "files"("legacy_id");

-- CreateIndex
CREATE UNIQUE INDEX "posts_legacy_id_key" ON "posts"("legacy_id");

-- CreateIndex
CREATE UNIQUE INDEX "posts_slug_key" ON "posts"("slug");

-- CreateIndex
CREATE INDEX "posts_published_idx" ON "posts"("published_at");

-- CreateIndex
CREATE UNIQUE INDEX "products_legacy_id_key" ON "products"("legacy_id");

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "product_issues_legacy_id_key" ON "product_issues"("legacy_id");

-- CreateIndex
CREATE UNIQUE INDEX "issue_answers_legacy_id_key" ON "issue_answers"("legacy_id");

-- CreateIndex
CREATE UNIQUE INDEX "project_categories_legacy_id_key" ON "project_categories"("legacy_id");

-- CreateIndex
CREATE UNIQUE INDEX "project_categories_slug_key" ON "project_categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "core_issues_legacy_id_key" ON "core_issues"("legacy_id");

-- CreateIndex
CREATE UNIQUE INDEX "contact_requests_legacy_id_key" ON "contact_requests"("legacy_id");

-- CreateIndex
CREATE UNIQUE INDEX "insert_notifications_seq_key" ON "insert_notifications"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "version_infos_seq_key" ON "version_infos"("seq");

-- CreateIndex
CREATE INDEX "company_contacts_type_sort_order_idx" ON "company_contacts"("type", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "departments_parent_id_name_key" ON "departments"("parent_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "positions_department_id_name_key" ON "positions"("department_id", "name");

-- CreateIndex
CREATE INDEX "employees_position_id_idx" ON "employees"("position_id");

-- CreateIndex
CREATE UNIQUE INDEX "awards_legacy_id_key" ON "awards"("legacy_id");

-- CreateIndex
CREATE INDEX "awards_is_public_sort_order_idx" ON "awards"("is_public", "sort_order");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_products" ADD CONSTRAINT "user_products_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_products" ADD CONSTRAINT "user_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_issues" ADD CONSTRAINT "product_issues_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_issues" ADD CONSTRAINT "product_issues_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issue_answers" ADD CONSTRAINT "issue_answers_issue_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "product_issues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issue_answers" ADD CONSTRAINT "issue_answers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issue_attachments" ADD CONSTRAINT "issue_attachments_issue_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "product_issues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issue_attachments" ADD CONSTRAINT "issue_attachments_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_issues" ADD CONSTRAINT "core_issues_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "project_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_issue_files" ADD CONSTRAINT "core_issue_files_core_issue_id_fkey" FOREIGN KEY ("core_issue_id") REFERENCES "core_issues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_issue_files" ADD CONSTRAINT "core_issue_files_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "positions" ADD CONSTRAINT "positions_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "positions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_photo_id_fkey" FOREIGN KEY ("photo_id") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "awards" ADD CONSTRAINT "awards_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


-- Top-level department names must be unique too: the (parent_id, name) index treats NULL
-- parents as distinct, and Prisma's schema can't express a partial index.
CREATE UNIQUE INDEX "departments_root_name_key" ON "departments"("name") WHERE "parent_id" IS NULL;
