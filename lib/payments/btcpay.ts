import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

// BTCPay Server (self-hosted) integration via the Greenfield API. No external
// SDK — plain fetch + Node crypto for webhook signature verification.

const env = (k: string) => process.env[k] ?? "";

export function btcpayConfigured(): boolean {
  return Boolean(env("BTCPAY_URL") && env("BTCPAY_API_KEY") && env("BTCPAY_STORE_ID"));
}

export type BtcpayInvoice = { id: string; checkoutLink: string };

// Creates a fiat-denominated invoice; BTCPay quotes the BTC amount at pay time.
export async function createInvoice(params: {
  orderId: string;
  amountCents: number;
  currency?: string;
  redirectUrl: string;
}): Promise<BtcpayInvoice> {
  if (!btcpayConfigured()) throw new Error("BTCPay is not configured");

  const res = await fetch(`${env("BTCPAY_URL")}/api/v1/stores/${env("BTCPAY_STORE_ID")}/invoices`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `token ${env("BTCPAY_API_KEY")}`,
    },
    body: JSON.stringify({
      amount: (params.amountCents / 100).toFixed(2),
      currency: params.currency ?? "USD",
      metadata: { orderId: params.orderId },
      checkout: { redirectURL: params.redirectUrl, redirectAutomatically: true },
    }),
  });

  if (!res.ok) {
    throw new Error(`BTCPay invoice creation failed (${res.status})`);
  }
  const data = (await res.json()) as { id: string; checkoutLink: string };
  return { id: data.id, checkoutLink: data.checkoutLink };
}

// BTCPay signs each webhook with HMAC-SHA256 over the raw request body, sent as
// "BTCPay-Sig: sha256=<hex>". Compare in constant time.
export function verifyWebhookSignature(rawBody: string, sigHeader: string | null): boolean {
  const secret = env("BTCPAY_WEBHOOK_SECRET");
  if (!secret || !sigHeader) return false;
  const expected = "sha256=" + createHmac("sha256", secret).update(rawBody, "utf8").digest("hex");
  const a = Buffer.from(sigHeader);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
