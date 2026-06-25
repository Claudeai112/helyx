import Link from "next/link";
import { DisclaimerBar } from "@/components/ui/disclaimer-bar";
import { RedeemForm } from "@/components/commerce/redeem-form";
import { getRedeemedCode } from "@/lib/rx-auth";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const redeemed = await getRedeemedCode();

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

      {/* Access gate */}
      <div className="mt-8 rounded-2xl border border-[rgba(40,224,200,0.15)] bg-[rgba(40,224,200,0.04)] p-6">
        {redeemed ? (
          <>
            <p className="mb-1 text-sm font-semibold text-[#28e0c8]">Access active</p>
            <p className="text-sm text-[#7777aa]">
              Your access is active — purchasing arrives in the next release.
            </p>
          </>
        ) : (
          <>
            <p className="mb-3 text-sm font-semibold text-[#28e0c8]">Access required</p>
            <p className="mb-4 text-sm text-[#7777aa]">
              Enter your access code to continue.
            </p>
            <RedeemForm />
          </>
        )}
      </div>

      <div className="mt-10 border-t border-white/5 pt-6">
        <DisclaimerBar />
      </div>
    </main>
  );
}
