-- CreateEnum
CREATE TYPE "customer_type" AS ENUM ('company', 'individual');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "customer_type" "customer_type" NOT NULL DEFAULT 'company',
ADD COLUMN     "personal_register" VARCHAR(10);

-- CreateIndex
CREATE UNIQUE INDEX "users_personal_register_key" ON "users"("personal_register");

