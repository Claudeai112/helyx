import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createHmac } from "node:crypto";
import { verifyWebhookSignature, btcpayConfigured } from "@/lib/payments/btcpay";

const SECRET = "whsec_test_123";
function sign(body: string) {
  return "sha256=" + createHmac("sha256", SECRET).update(body, "utf8").digest("hex");
}

describe("btcpay webhook signature", () => {
  beforeEach(() => {
    process.env.BTCPAY_WEBHOOK_SECRET = SECRET;
  });
  afterEach(() => {
    delete process.env.BTCPAY_WEBHOOK_SECRET;
  });

  it("accepts a correctly signed body", () => {
    const body = JSON.stringify({ type: "InvoiceSettled", invoiceId: "abc" });
    expect(verifyWebhookSignature(body, sign(body))).toBe(true);
  });

  it("rejects a tampered body", () => {
    const body = JSON.stringify({ type: "InvoiceSettled", invoiceId: "abc" });
    const goodSig = sign(body);
    const tampered = JSON.stringify({ type: "InvoiceSettled", invoiceId: "EVIL" });
    expect(verifyWebhookSignature(tampered, goodSig)).toBe(false);
  });

  it("rejects a missing signature header", () => {
    expect(verifyWebhookSignature("{}", null)).toBe(false);
  });

  it("rejects when no secret is configured", () => {
    delete process.env.BTCPAY_WEBHOOK_SECRET;
    const body = "{}";
    expect(verifyWebhookSignature(body, sign(body))).toBe(false);
  });
});

describe("btcpayConfigured", () => {
  afterEach(() => {
    delete process.env.BTCPAY_URL;
    delete process.env.BTCPAY_API_KEY;
    delete process.env.BTCPAY_STORE_ID;
  });

  it("is false when env is incomplete", () => {
    process.env.BTCPAY_URL = "https://btcpay.example.com";
    expect(btcpayConfigured()).toBe(false);
  });

  it("is true when url, key, and store are set", () => {
    process.env.BTCPAY_URL = "https://btcpay.example.com";
    process.env.BTCPAY_API_KEY = "token";
    process.env.BTCPAY_STORE_ID = "store_1";
    expect(btcpayConfigured()).toBe(true);
  });
});
