import { defineConfig } from "prisma/config";

process.loadEnvFile?.(".env");

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations", seed: "tsx prisma/seed.ts" },
  // Read directly (not env()) so `prisma generate` works before the DB is configured.
  datasource: { url: process.env.DATA_BASE_URL ?? "" },
});
