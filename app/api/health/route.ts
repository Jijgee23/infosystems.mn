import { connection } from "next/server";
import { db } from "@/lib/db";

const DB_TIMEOUT_MS = 3000;
const headers = { "Cache-Control": "no-store" };

/**
 * GET /api/health — for the uptime monitor: 200 when the app can reach Postgres, 503 otherwise.
 * The body never includes error details; the cause goes to the server log.
 */
export async function GET() {
  await connection(); // checked on every request, never prerendered
  const started = performance.now();
  try {
    await Promise.race([
      db.$queryRaw`SELECT 1`,
      new Promise((_, reject) => setTimeout(() => reject(new Error(`timed out after ${DB_TIMEOUT_MS}ms`)), DB_TIMEOUT_MS)),
    ]);
  } catch (e) {
    console.error("[health] database check failed", e);
    return Response.json({ status: "error", db: "down" }, { status: 503, headers });
  }
  return Response.json(
    { status: "ok", db: "ok", dbLatencyMs: Math.round(performance.now() - started), uptimeS: Math.round(process.uptime()) },
    { headers },
  );
}

export async function HEAD() {
  const res = await GET();
  return new Response(null, { status: res.status, headers });
}
