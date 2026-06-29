import { describe, it, expect, vi, beforeEach } from "vitest";

const { findFirst, orderUpdate, userUpdate, txn, verify } = vi.hoisted(() => ({
  findFirst: vi.fn(),
  orderUpdate: vi.fn(() => ({ __op: "order.update" })),
  userUpdate: vi.fn(() => ({ __op: "user.update" })),
  txn: vi.fn(),
  verify: vi.fn(),
}));
vi.mock("@/lib/db", () => ({
  prisma: {
    order: { findFirst, update: orderUpdate },
    user: { update: userUpdate },
    $transaction: txn,
  },
}));
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
  findFirst.mockReset();
  orderUpdate.mockClear();
  userUpdate.mockClear();
  txn.mockReset();
  verify.mockReset();
});

describe("BTCPay webhook", () => {
  it("rejects an invalid signature with 401 and writes nothing", async () => {
    verify.mockReturnValue(false);
    const res = await POST(req({ type: "InvoiceSettled", invoiceId: "inv_1" }));
    expect(res.status).toBe(401);
    expect(findFirst).not.toHaveBeenCalled();
  });

  it("marks a non-loyalty order PAID without touching the user", async () => {
    verify.mockReturnValue(true);
    findFirst.mockResolvedValue({ id: "o1", userId: "u1", loyaltyApplied: false });
    const res = await POST(req({ type: "InvoiceSettled", invoiceId: "inv_1" }));
    expect(res.status).toBe(200);
    expect(orderUpdate).toHaveBeenCalledWith({ where: { id: "o1" }, data: { status: "PAID" } });
    expect(userUpdate).not.toHaveBeenCalled();
  });

  it("consumes a loyalty reward when a loyalty order is paid", async () => {
    verify.mockReturnValue(true);
    findFirst.mockResolvedValue({ id: "o2", userId: "u2", loyaltyApplied: true });
    const res = await POST(req({ type: "InvoiceSettled", invoiceId: "inv_2" }));
    expect(res.status).toBe(200);
    expect(orderUpdate).toHaveBeenCalledWith({ where: { id: "o2" }, data: { status: "PAID" } });
    expect(userUpdate).toHaveBeenCalledWith({
      where: { id: "u2" },
      data: { loyaltyRedeemed: { increment: 1 } },
    });
  });

  it("is idempotent — no matching unpaid order means no writes", async () => {
    verify.mockReturnValue(true);
    findFirst.mockResolvedValue(null);
    const res = await POST(req({ type: "InvoiceSettled", invoiceId: "inv_1" }));
    expect(res.status).toBe(200);
    expect(orderUpdate).not.toHaveBeenCalled();
    expect(userUpdate).not.toHaveBeenCalled();
  });

  it("ignores non-settlement events", async () => {
    verify.mockReturnValue(true);
    const res = await POST(req({ type: "InvoiceProcessing", invoiceId: "inv_1" }));
    expect(res.status).toBe(200);
    expect(findFirst).not.toHaveBeenCalled();
  });
});
