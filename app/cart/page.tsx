"use client";
import Link from "next/link";
import { useCart } from "@/components/cart/cart-provider";
import { formatCents } from "@/lib/money";
import { DisclaimerBar } from "@/components/ui/disclaimer-bar";

export default function CartPage() {
  const { items, remove, subtotalCents } = useCart();

  return (
    <main className="relative z-[2] mx-auto min-h-screen max-w-[900px] px-6 pb-24 pt-36">
      <h1 className="mb-2 font-heading text-3xl font-bold text-foreground">Your Cart</h1>

      {items.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-border bg-card p-12 text-center">
          <p className="mb-2 text-lg font-semibold text-foreground">Your cart is empty</p>
          <p className="mb-6 text-sm text-muted-foreground">
            Browse our research peptide catalog and add items to get started.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
          >
            Browse Shop
          </Link>
        </div>
      ) : (
        <div className="mt-8">
          <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
            {items.map((item) => (
              <li key={item.variantId} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="font-semibold text-foreground">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Qty: {item.quantity} &times; {formatCents(item.unitPriceCents)}
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <span className="font-semibold text-foreground">
                    {formatCents(item.unitPriceCents * item.quantity)}
                  </span>
                  <button
                    onClick={() => remove(item.variantId)}
                    className="text-sm text-muted-foreground underline hover:text-foreground"
                    aria-label={`Remove ${item.name}`}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex justify-end">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Subtotal</p>
              <p className="text-2xl font-bold text-foreground">{formatCents(subtotalCents)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Checkout – coming in a future release */}
      <div className="mt-10">
        <button
          disabled
          className="w-full cursor-not-allowed rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground opacity-50"
        >
          Proceed to checkout
        </button>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Checkout is coming soon.
        </p>
      </div>

      <div className="mt-10 border-t border-border pt-6">
        <DisclaimerBar />
      </div>
    </main>
  );
}
