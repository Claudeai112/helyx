import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { formatCents } from "@/lib/money";

export const metadata: Metadata = { title: "Order" };

const STATUS_LABEL: Record<string, string> = {
  AWAITING_PAYMENT: "Awaiting Bitcoin payment",
  PAID: "Paid",
  FULFILLED: "Fulfilled",
  CANCELLED: "Cancelled",
  PENDING_CONSULT: "Pending",
};

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-[700px] px-6 pb-24 pt-20">
        <h1 className="text-3xl font-semibold tracking-tight">Order</h1>
        <p className="mt-4 text-muted-foreground">
          Please{" "}
          <Link href="/account" className="underline underline-offset-4 hover:text-foreground">
            sign in
          </Link>{" "}
          to view this order.
        </p>
      </div>
    );
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { variant: { include: { product: true } } } } },
  });

  // Don't leak other users' orders.
  if (!order || order.userId !== user.id) notFound();

  const isPaid = order.status === "PAID" || order.status === "FULFILLED";

  return (
    <div className="mx-auto max-w-[700px] px-6 pb-24 pt-20">
      <h1 className="text-3xl font-semibold tracking-tight">Order</h1>

      <div className="mt-4 flex items-center gap-3">
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${isPaid ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
        >
          {STATUS_LABEL[order.status] ?? order.status}
        </span>
        <span className="text-sm text-muted-foreground">#{order.id.slice(-8)}</span>
      </div>

      {order.status === "AWAITING_PAYMENT" && (
        <p className="mt-4 rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
          We&apos;re waiting for your Bitcoin payment to confirm on the network. This page updates to
          &ldquo;Paid&rdquo; once it settles — you can safely refresh.
        </p>
      )}

      <ul className="mt-6 divide-y divide-border rounded-xl border border-border bg-card">
        {order.items.map((it) => (
          <li key={it.id} className="flex items-center justify-between px-5 py-3">
            <div>
              <p className="text-sm font-medium text-foreground">{it.variant.product.name}</p>
              <p className="text-xs text-muted-foreground">
                {it.variant.label} · Qty {it.quantity}
              </p>
            </div>
            <span className="text-sm font-medium text-foreground">
              {formatCents(it.unitPriceCents * it.quantity)}
            </span>
          </li>
        ))}
      </ul>

      {order.discountCents > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-primary">Loyalty reward — free vial</span>
          <span className="text-sm font-medium text-primary">− {formatCents(order.discountCents)}</span>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <span className="text-sm text-muted-foreground">Total</span>
        <span className="text-xl font-bold text-foreground">
          {formatCents(order.amountCents ?? 0)}
        </span>
      </div>

      <div className="mt-8">
        <Link href="/" className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground">
          Continue browsing
        </Link>
      </div>
    </div>
  );
}
