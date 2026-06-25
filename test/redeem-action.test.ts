import { describe, it, expect, vi, beforeEach } from "vitest";
vi.mock("server-only", () => ({}));
const { set } = vi.hoisted(() => ({ set: vi.fn() }));
vi.mock("next/headers", () => ({
  cookies: async () => ({ set }),
  headers: async () => new Headers(),
}));
vi.mock("@/lib/rate-limit", () => ({ rateLimit: () => ({ ok: true }), clientIp: () => "t" }));
const { findFirst } = vi.hoisted(() => ({ findFirst: vi.fn() }));
vi.mock("@/lib/db", () => ({ prisma: { prescriptionCode: { findFirst } } }));
import { redeemCode } from "@/app/actions/redeem";

function fd(code: string) { const f = new FormData(); f.set("code", code); return f; }
beforeEach(() => { set.mockReset(); findFirst.mockReset(); });

describe("redeemCode", () => {
  it("sets the cookie for a valid ACTIVE code", async () => {
    findFirst.mockResolvedValue({ id: "c1", code: "AAAA-BBBB-CCCC" });
    const r = await redeemCode(fd("AAAA-BBBB-CCCC"));
    expect(r.ok).toBe(true);
    expect(set).toHaveBeenCalledWith("rx_auth", expect.stringContaining("c1."), expect.objectContaining({ httpOnly: true }));
  });
  it("rejects an unknown/revoked code without setting a cookie", async () => {
    findFirst.mockResolvedValue(null);
    const r = await redeemCode(fd("nope"));
    expect(r.ok).toBe(false);
    expect(set).not.toHaveBeenCalled();
  });
});
