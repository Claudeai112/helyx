"use client";

import { useState } from "react";
import Link from "next/link";
import { DisclaimerBar } from "@/components/ui/disclaimer-bar";

export default function CartPage() {
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setCheckoutError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: { prescriptionId: null } }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCheckoutError(data.error ?? "Something went wrong.");
      } else if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setCheckoutError("Unable to reach checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative z-[2] mx-auto min-h-screen max-w-[900px] px-6 pb-24 pt-36">
      <h1 className="mb-2 font-display text-3xl font-bold text-white">Your Cart</h1>
      <p className="mb-10 text-sm text-muted-foreground">
        Items require an approved consultation before checkout can be completed.
      </p>

      {/* Empty-state */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center">
        <p className="mb-2 text-lg font-semibold text-[#e0e0f0]">Your cart is empty</p>
        <p className="mb-6 text-sm text-[#7777aa]">
          Browse our peptide protocols and add items to get started.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center rounded-full bg-gradient-to-br from-[#28e0c8] to-[#00a896] px-7 py-3 text-sm font-semibold text-[#050510] shadow-[0_4px_20px_rgba(40,224,200,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_30px_rgba(40,224,200,0.5)]"
        >
          Shop Peptides
        </Link>
      </div>

      {/* Checkout gate notice */}
      <div className="mt-8 rounded-2xl border border-[rgba(40,224,200,0.15)] bg-[rgba(40,224,200,0.04)] p-6">
        <p className="mb-1 text-sm font-semibold text-[#28e0c8]">Consultation required</p>
        <p className="text-sm text-[#7777aa]">
          Checkout opens after your consultation is approved. A licensed provider will review
          your intake and, if appropriate, issue a prescription before your order ships.
        </p>
        <div className="mt-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={handleCheckout}
            disabled={loading}
            className="inline-flex items-center rounded-full border border-[rgba(40,224,200,0.3)] bg-transparent px-6 py-2.5 text-sm font-semibold text-[#28e0c8] transition-all hover:border-[#28e0c8] hover:bg-[rgba(40,224,200,0.08)] disabled:opacity-50"
          >
            {loading ? "Checking…" : "Proceed to Checkout"}
          </button>
          <Link
            href="/consultation"
            className="text-sm text-[#7777aa] underline underline-offset-2 hover:text-[#28e0c8]"
          >
            Start a consultation instead
          </Link>
        </div>
        {checkoutError && (
          <p className="mt-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
            {checkoutError}
          </p>
        )}
      </div>

      <div className="mt-10 border-t border-white/5 pt-6">
        <DisclaimerBar />
      </div>
    </main>
  );
}
