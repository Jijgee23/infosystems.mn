import "server-only";
import { headers } from "next/headers";

// In-memory sliding window. The site runs as a single Node process (PM2), so this is enough
// to stop casual form spam and password guessing; swap for Redis if it is ever scaled out.
const hits = new Map<string, number[]>();

/**
 * Client IP as seen by our reverse proxy. nginx sets X-Real-IP to $remote_addr (overwriting
 * anything the client sent) and appends $remote_addr as the last X-Forwarded-For hop. The
 * first X-Forwarded-For entry is whatever the client claims, so it must never be trusted.
 */
export async function clientIp() {
  const h = await headers();
  return h.get("x-real-ip")?.trim() || h.get("x-forwarded-for")?.split(",").at(-1)?.trim() || "unknown";
}

const MAX_KEYS = 10_000;
const MAX_WINDOW_MS = 60 * 60_000; // longest window any caller uses

/** Drops idle keys first, then the oldest ones, so a flood of new keys can't wipe active lockouts. */
function prune() {
  const now = Date.now();
  for (const [key, list] of hits) if (!list.length || now - list[list.length - 1] > MAX_WINDOW_MS) hits.delete(key);
  for (const key of hits.keys()) {
    if (hits.size <= MAX_KEYS * 0.9) break;
    hits.delete(key);
  }
}

function recent(key: string, windowMs: number) {
  const now = Date.now();
  const list = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  hits.set(key, list);
  if (hits.size > MAX_KEYS) prune();
  return list;
}

/** Records a request and returns true when the caller is over `limit` per `windowMs` for `bucket`. */
export async function isRateLimited(bucket: string, limit: number, windowMs: number) {
  const list = recent(`${bucket}:${await clientIp()}`, windowMs);
  list.push(Date.now());
  return list.length > limit;
}

/**
 * Failure-only limiter for sign-in forms: `blocked()` checks without recording,
 * `fail()` records a failed attempt, `reset()` clears it after a successful sign-in.
 */
export async function attemptLimiter(bucket: string, limit: number, windowMs: number) {
  const key = `${bucket}:${await clientIp()}`;
  return {
    blocked: () => recent(key, windowMs).length >= limit,
    /** Failed attempts left before `blocked()` turns true. */
    remaining: () => Math.max(0, limit - recent(key, windowMs).length),
    /** Minutes until the oldest failure leaves the window and a new attempt is allowed. */
    retryAfterMinutes: () => {
      const oldest = recent(key, windowMs)[0];
      return oldest ? Math.max(1, Math.ceil((oldest + windowMs - Date.now()) / 60_000)) : 0;
    },
    fail: () => void recent(key, windowMs).push(Date.now()),
    reset: () => void hits.delete(key),
  };
}
