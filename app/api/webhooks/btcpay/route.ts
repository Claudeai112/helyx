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
      // Find the still-unpaid order for this invoice. Because we filter on
      // AWAITING_PAYMENT, a redelivered event finds nothing → fully idempotent.
      const order = await prisma.order.findFirst({
        where: { paymentInvoiceId: event.invoiceId, status: "AWAITING_PAYMENT" },
        select: { id: true, userId: true, loyaltyApplied: true },
      });
      if (order) {
        await prisma.$transaction([
          prisma.order.update({ where: { id: order.id }, data: { status: "PAID" } }),
          // Consume one loyalty reward only on successful payment.
          ...(order.loyaltyApplied && order.userId
            ? [
                prisma.user.update({
                  where: { id: order.userId },
                  data: { loyaltyRedeemed: { increment: 1 } },
                }),
              ]
            : []),
        ]);
      }
    } catch {
      // Surface a 500 so BTCPay retries delivery.
      return NextResponse.json({ error: "processing failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
