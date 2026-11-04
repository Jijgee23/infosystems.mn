"use server";

import { headers } from "next/headers";
import { db } from "@/lib/db";
import { idParam } from "@/lib/ids";
import { clientIp, isKeyRateLimited, isRateLimited } from "@/lib/rate-limit";

export type ViewKind = "post" | "guide" | "product";

// Crawlers that run JavaScript would otherwise count on every render.
const BOT = /bot|crawl|spider|slurp|preview|headless|lighthouse|facebookexternalhit|embedly|whatsapp|telegram/i;

/**
 * Counts a page view. «Их уншсан» lists are built from these counts, so they are guarded:
 * one view per item per IP per hour, an overall per-IP cap, no bots, and only published items.
 * Raw updates, so the counter doesn't bump updated_at.
 */
export async function recordView(kind: ViewKind, id: string) {
  const itemId = idParam(id);
  if (!itemId) return;
  if (BOT.test((await headers()).get("user-agent") ?? "")) return;
  if (isKeyRateLimited(`view:${kind}:${itemId}:${await clientIp()}`, 1, 60 * 60_000)) return;
  if (await isRateLimited("view", 120, 10 * 60_000)) return;
  if (kind === "post") await db.$executeRaw`UPDATE posts SET view_count = view_count + 1 WHERE id = ${itemId} AND published_at <= now()`;
  else if (kind === "guide") await db.$executeRaw`UPDATE guides SET view_count = view_count + 1 WHERE id = ${itemId} AND published_at <= now()`;
  else if (kind === "product") await db.$executeRaw`UPDATE products SET view_count = view_count + 1 WHERE id = ${itemId} AND published_at <= now()`;
}
