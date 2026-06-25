import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/stripe", () => ({
  createCheckoutSession: vi.fn().mockResolvedValue({ url: "https://stripe.test/session" }),
}));
vi.mock("@/lib/rate-limit", () => ({
  rateLimit: () => ({ ok: true, remaining: 9, retryAfterSeconds: 0 }),
  clientIp: () => "test",
}));

import { POST } from "@/app/api/checkout/route";

function req(body: unknown) {
  return new Request("http://localhost/api/checkout", {
    method: "POST", body: JSON.stringify(body), headers: { "content-type": "application/json" },
  });
}

describe("checkout gate", () => {
  it("blocks checkout for an order without a prescription (403)", async () => {
    const res = await POST(req({ order: { prescriptionId: null } }));
    expect(res.status).toBe(403);
  });
  it("allows checkout once a prescription is linked", async () => {
    const res = await POST(req({ order: { prescriptionId: "rx_1" } }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.url).toBe("https://stripe.test/session");
  });
  it("rejects requests with invalid JSON body (400)", async () => {
    const res = await POST(
      new Request("http://localhost/api/checkout", {
        method: "POST",
        body: "not json",
        headers: { "content-type": "application/json" },
      }),
    );
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("Invalid request body.");
  });
});
