import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/stripe", () => ({
  createCheckoutSession: vi.fn().mockResolvedValue({ url: "https://stripe.test/session" }),
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
    expect(json.url).toContain("stripe");
  });
});
