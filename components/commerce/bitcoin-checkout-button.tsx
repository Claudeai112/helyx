"use client";
import { useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { startBitcoinCheckout } from "@/app/actions/checkout";

// Starts a BTCPay invoice for the current cart and redirects to the hosted
// Bitcoin pay page. Prices are recomputed server-side from the DB.
export function BitcoinCheckoutButton() {
  const { items } = useCart();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const disabled = pending || items.length === 0;

  async function checkout() {
    setError(null);
    setPending(true);
    const r = await startBitcoinCheckout(
      items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
    );
    if (r.ok) {
      window.location.href = r.url;
    } else {
      setError(r.error);
      setPending(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={checkout}
        disabled={disabled}
        className="w-full rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Starting checkout…" : "Pay with Bitcoin"}
      </button>
      {error && <p className="mt-2 text-center text-sm text-destructive">{error}</p>}
      <p className="mt-2 text-center text-xs text-muted-foreground">
        Pay securely in Bitcoin. Your order confirms once payment settles on-chain.
      </p>
    </>
  );
}
