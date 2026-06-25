import "server-only";

/**
 * Minimal in-memory fixed-window rate limiter for public write endpoints
 * (abuse / scraping / brute-force resistance).
 *
 * LIMITATION: in-memory state is per-process. On serverless/multi-instance
 * hosting each instance keeps its own counters, so the effective limit is
 * `limit × instances`. For production-grade limiting, back this with a shared
 * store (e.g. Upstash Redis / Vercel KV) — the call sites can keep using the
 * same `rateLimit()` signature. This is a meaningful first line of defense, not
 * a complete one.
 */
type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export type RateLimitResult = { ok: boolean; remaining: number; retryAfterSeconds: number };

export function rateLimit(key: string, limit = 5, windowMs = 60_000): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || now >= existing.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }

  if (existing.count >= limit) {
    return { ok: false, remaining: 0, retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000) };
  }

  existing.count += 1;
  return { ok: true, remaining: limit - existing.count, retryAfterSeconds: 0 };
}

/** Best-effort client IP from common proxy headers; falls back to a shared bucket. */
export function clientIp(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return headers.get("x-real-ip")?.trim() || "unknown";
}

/** Test-only: clear all buckets between cases. */
export function __resetRateLimitStore(): void {
  buckets.clear();
}
