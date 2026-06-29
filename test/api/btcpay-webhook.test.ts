import { describe, it, expect, vi, beforeEach } from "vitest";

const { updateMany, verify } = vi.hoisted(() => ({ updateMany: vi.fn(), verify: vi.fn() }));
vi.mock("@/lib/db", () => ({ prisma: { order: { updateMany } } }));
vi.mock("@/lib/payments/btcpay", () => ({ verifyWebhookSignature: verify }));

import { POST } from "@/app/api/webhooks/btcpay/route";

function req(body: unknown) {
  return new Request("http://localhost/api/webhooks/btcpay", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "BTCPay-Sig": "sha256=whatever" },
  });
}

beforeEach(() => {
  updateMany.mockReset();
  verify.mockReset();
});

describe("BTCPay webhook", () => {
  it("rejects an invalid signature with 401 and writes nothing", async () => {
    verify.mockReturnValue(false);
    const res = await POST(req({ type: "InvoiceSettled", invoiceId: "inv_1" }));
    expect(res.status).toBe(401);
    expect(updateMany).not.toHaveBeenCalled();
  });

  it("marks the matching order PAID on InvoiceSettled", async () => {
    verify.mockReturnValue(true);
    updateMany.mockResolvedValue({ count: 1 });
    const res = await POST(req({ type: "InvoiceSettled", invoiceId: "inv_1" }));
    expect(res.status).toBe(200);
    expect(updateMany).toHaveBeenCalledWith({
      where: { paymentInvoiceId: "inv_1", status: "AWAITING_PAYMENT" },
      data: { status: "PAID" },
    });
  });

  it("ignores non-settlement events", async () => {
    verify.mockReturnValue(true);
    const res = await POST(req({ type: "InvoiceProcessing", invoiceId: "inv_1" }));
    expect(res.status).toBe(200);
    expect(updateMany).not.toHaveBeenCalled();
  });
});
