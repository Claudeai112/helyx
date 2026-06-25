import { describe, it, expect, beforeEach, vi } from "vitest";

// lib/rate-limit imports "server-only", which throws in the node test env.
vi.mock("server-only", () => ({}));

import { rateLimit, clientIp, __resetRateLimitStore } from "@/lib/rate-limit";

beforeEach(() => __resetRateLimitStore());

describe("rateLimit", () => {
  it("allows up to the limit, then blocks within the window", () => {
    const key = "k1";
    for (let i = 0; i < 3; i++) {
      expect(rateLimit(key, 3, 60_000).ok).toBe(true);
    }
    const blocked = rateLimit(key, 3, 60_000);
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("tracks different keys independently", () => {
    expect(rateLimit("a", 1, 60_000).ok).toBe(true);
    expect(rateLimit("a", 1, 60_000).ok).toBe(false);
    // A different key (e.g. different IP) is unaffected.
    expect(rateLimit("b", 1, 60_000).ok).toBe(true);
  });

  it("resets after the window elapses", () => {
    vi.useFakeTimers();
    try {
      expect(rateLimit("w", 1, 1_000).ok).toBe(true);
      expect(rateLimit("w", 1, 1_000).ok).toBe(false);
      vi.advanceTimersByTime(1_001);
      expect(rateLimit("w", 1, 1_000).ok).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });
});

describe("clientIp", () => {
  it("takes the first IP from x-forwarded-for", () => {
    const h = new Headers({ "x-forwarded-for": "203.0.113.7, 70.41.3.18" });
    expect(clientIp(h)).toBe("203.0.113.7");
  });
  it("falls back to x-real-ip, then 'unknown'", () => {
    expect(clientIp(new Headers({ "x-real-ip": "198.51.100.2" }))).toBe("198.51.100.2");
    expect(clientIp(new Headers())).toBe("unknown");
  });
});
