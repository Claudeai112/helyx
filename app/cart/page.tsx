"use client";
import Link from "next/link";
import { useCart } from "@/components/cart/cart-provider";
import { useAuth } from "@/components/auth/auth-provider";
import { formatCents } from "@/lib/money";
import { DisclaimerBar } from "@/components/ui/disclaimer-bar";

export default function CartPage() {
  const { items, remove, changeVariant, setQuantity, subtotalCents } = useCart();
  const user = useAuth();

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
                  {item.variants && item.variants.length > 1 ? (
                    <select
                      value={item.variantId}
                      onChange={(e) => changeVariant(item.variantId, e.target.value)}
                      aria-label={`Vial strength for ${item.name}`}
                      className="mt-1 rounded-md border border-border bg-card px-2 py-1 text-sm text-foreground"
                    >
                      {item.variants.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.label} · {formatCents(v.priceCents)}
                        </option>
                      ))}
                    </select>
                  ) : null}
                  <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Qty</span>
                    <div className="inline-flex items-center rounded-md border border-border">
                      <button
                        type="button"
                        aria-label={`Decrease ${item.name} quantity`}
                        onClick={() => setQuantity(item.variantId, item.quantity - 1)}
                        className="px-2 py-1 text-foreground hover:bg-secondary"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          setQuantity(item.variantId, Math.max(1, Math.floor(Number(e.target.value) || 1)))
                        }
                        aria-label={`Quantity for ${item.name}`}
                        className="w-14 border-x border-border bg-card px-2 py-1 text-center text-foreground"
                      />
                      <button
                        type="button"
                        aria-label={`Increase ${item.name} quantity`}
                        onClick={() => setQuantity(item.variantId, item.quantity + 1)}
                        className="px-2 py-1 text-foreground hover:bg-secondary"
                      >
                        +
                      </button>
                    </div>
                    <span>&times; {formatCents(item.unitPriceCents)}</span>
                  </div>
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
            <div className="min-w-[260px] text-right">
              <div className="flex items-center justify-between gap-6">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="text-foreground">{formatCents(subtotalCents)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between gap-6 border-t border-border pt-2">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="text-2xl font-bold text-foreground">{formatCents(subtotalCents)}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Shipping is calculated at checkout and paid by the customer.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Checkout – requires an account; checkout itself ships in a future release */}
      <div className="mt-10">
        {user ? (
          <>
            <button
              disabled
              className="w-full cursor-not-allowed rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground opacity-50"
            >
              Proceed to checkout
            </button>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Checkout is coming soon.
            </p>
          </>
        ) : (
          <>
            <Link
              href="/account"
              className="block w-full rounded-full bg-primary px-8 py-4 text-center text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
            >
              Create an account to check out
            </Link>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              You need a Helyx account to check out. Sign in or create one to continue.
            </p>
          </>
        )}
      </div>

      <div className="mt-10 border-t border-border pt-6">
        <DisclaimerBar />
      </div>
    </main>
  );
}
