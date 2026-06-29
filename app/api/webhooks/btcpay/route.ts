import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyWebhookSignature } from "@/lib/payments/btcpay";

// BTCPay posts invoice lifecycle events here. We mark the matching order PAID
// once the invoice settles. Idempotent: a redelivered "settled" event is a no-op.
export async function POST(req: Request) {
  const rawBody = await req.text();
  const sig = req.headers.get("BTCPay-Sig");

  if (!verifyWebhookSignature(rawBody, sig)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  let event: { type?: string; invoiceId?: string };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  // "InvoiceSettled" = fully paid and confirmed.
  if (event.type === "InvoiceSettled" && event.invoiceId) {
    try {
      // Only transition orders still awaiting payment → idempotent.
      await prisma.order.updateMany({
        where: { paymentInvoiceId: event.invoiceId, status: "AWAITING_PAYMENT" },
        data: { status: "PAID" },
      });
    } catch {
      // Surface a 500 so BTCPay retries delivery.
      return NextResponse.json({ error: "processing failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
