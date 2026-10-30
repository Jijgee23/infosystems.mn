/**
 * Creates an admin, or promotes an existing user to admin and sets a new password.
 *
 *   npm run create-admin -- admin@infosystems.mn "Нэр"
 *
 * The password is read from the ADMIN_PASSWORD env var or prompted on stdin.
 */
import { createInterface } from "node:readline/promises";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../lib/generated/prisma/client";

process.loadEnvFile?.(".env");

async function main() {
  const [emailArg, name = "Admin"] = process.argv.slice(2);
  if (!emailArg)
    throw new Error('Usage: npm run create-admin -- <email> ["Name"]');
  const email = emailArg.toLowerCase();
  let password = process.env.ADMIN_PASSWORD;
  if (!password) {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    password = await rl.question("Password (8+ chars): ");
    rl.close();
  }
  if (password.length < 8)
    throw new Error("Password must be at least 8 characters");

  const prisma = new PrismaClient({
    adapter: new PrismaPg({
      connectionString: process.env.DATA_BASE_URL!,
      options: "-c TimeZone=UTC",
    }),
  });
  const data = {
    role: "admin" as const,
    adminConfirmed: true,
    blocked: false,
    passwordHash: await bcrypt.hash(password, 10),
    passwordChangedAt: new Date(),
  };
  const user = await prisma.user.upsert({
    where: { email },
    update: data,
    create: { ...data, email, username: name },
  });
  console.log(`Admin ready: ${user.email} (id ${user.id})`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
