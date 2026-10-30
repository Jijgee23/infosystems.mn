"use server";

import { db } from "@/lib/db";
import { idParam } from "@/lib/ids";
import { isRateLimited } from "@/lib/rate-limit";

export type ViewKind = "post" | "guide" | "product";

/** Counts a page view. Raw updates, so the counter doesn't bump updated_at. */
export async function recordView(kind: ViewKind, id: string) {
  if (!idParam(id) || (await isRateLimited("view", 120, 10 * 60_000))) return;
  if (kind === "post") await db.$executeRaw`UPDATE posts SET view_count = view_count + 1 WHERE id = ${id}`;
  else if (kind === "guide") await db.$executeRaw`UPDATE guides SET view_count = view_count + 1 WHERE id = ${id}`;
  else if (kind === "product") await db.$executeRaw`UPDATE products SET view_count = view_count + 1 WHERE id = ${id}`;
}
