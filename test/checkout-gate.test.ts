import { describe, it, expect, vi, beforeEach } from "vitest";
vi.mock("server-only", () => ({}));
vi.mock("@/lib/stripe", () => ({
  createCheckoutSession: vi.fn().mockResolvedValue({ url: "https://stripe.test/session" }),
}));
vi.mock("@/lib/rate-limit", () => ({ rateLimit: () => ({ ok: true }), clientIp: () => "t" }));
const { getRedeemedCode } = vi.hoisted(() => ({ getRedeemedCode: vi.fn() }));
vi.mock("@/lib/rx-auth", () => ({ getRedeemedCode }));
import { POST } from "@/app/api/checkout/route";

function req() { return new Request("http://localhost/api/checkout", { method: "POST" }); }
beforeEach(() => getRedeemedCode.mockReset());

describe("checkout gate (code-based)", () => {
  it("403 when no redeemed code", async () => {
    getRedeemedCode.mockResolvedValue(null);
    expect((await POST(req())).status).toBe(403);
  });
  it("200 + url when a valid code is redeemed", async () => {
    getRedeemedCode.mockResolvedValue({ id: "c1" });
    const res = await POST(req());
    expect(res.status).toBe(200);
    expect((await res.json()).url).toBe("https://stripe.test/session");
  });
});
