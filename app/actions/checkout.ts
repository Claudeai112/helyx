"use server";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { createInvoice, btcpayConfigured } from "@/lib/payments/btcpay";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export type CheckoutLine = { variantId: string; quantity: number };
type CheckoutResult = { ok: true; url: string } | { ok: false; error: string };

const MAX_QTY = 999;

export async function startBitcoinCheckout(lines: CheckoutLine[]): Promise<CheckoutResult> {
  const limit = rateLimit(`checkout:${clientIp(await headers())}`, 10, 60_000);
  if (!limit.ok) return { ok: false, error: "Too many attempts. Please try again in a moment." };

  // Account is required to check out.
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please sign in or create an account to check out." };

  if (!btcpayConfigured()) {
    return { ok: false, error: "Bitcoin checkout is not available right now. Please try again later." };
  }

  // Normalise + validate the requested lines.
  const wanted = new Map<string, number>();
  for (const l of Array.isArray(lines) ? lines : []) {
    const qty = Math.floor(Number(l?.quantity));
    if (!l?.variantId || !Number.isFinite(qty) || qty < 1 || qty > MAX_QTY) continue;
    wanted.set(l.variantId, (wanted.get(l.variantId) ?? 0) + qty);
  }
  if (wanted.size === 0) return { ok: false, error: "Your cart is empty." };

  try {
    // Recompute every price from the DB — never trust client-supplied amounts.
    const variants = await prisma.productVariant.findMany({
      where: { id: { in: [...wanted.keys()] } },
      select: { id: true, priceCents: true },
    });
    if (variants.length === 0) return { ok: false, error: "These items are no longer available." };

    const items = variants.map((v) => ({
      variantId: v.id,
      quantity: wanted.get(v.id) as number,
      unitPriceCents: v.priceCents,
    }));
    const amountCents = items.reduce((sum, i) => sum + i.unitPriceCents * i.quantity, 0);
    if (amountCents <= 0) return { ok: false, error: "Your cart total is invalid." };

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        status: "AWAITING_PAYMENT",
        amountCents,
        paymentProvider: "btcpay",
        items: { create: items },
      },
      select: { id: true },
    });

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
    const invoice = await createInvoice({
      orderId: order.id,
      amountCents,
      redirectUrl: `${siteUrl}/order/${order.id}`,
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { paymentInvoiceId: invoice.id },
    });

    return { ok: true, url: invoice.checkoutLink };
  } catch {
    return { ok: false, error: "We couldn't start checkout right now. Please try again." };
  }
}
