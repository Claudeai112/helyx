import { RedeemForm } from "@/components/commerce/redeem-form";
import { DisclaimerBar } from "@/components/ui/disclaimer-bar";
import { getRedeemedCode } from "@/lib/rx-auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Redeem Access Code" };

export default async function RedeemPage() {
  const redeemed = await getRedeemedCode();
  return (
    <div className="mx-auto max-w-2xl px-6 py-24">
      <h1 className="text-4xl font-semibold text-foreground">Redeem your access code</h1>
      <p className="mt-3 text-muted-foreground">
        Enter the code provided after your approved consultation to unlock ordering.
      </p>
      <div className="mt-8">
        {redeemed ? (
          <p className="rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
            Your access is active. You can now browse and order prescribed products.
          </p>
        ) : (
          <RedeemForm />
        )}
      </div>
      <DisclaimerBar className="mt-12" />
    </div>
  );
}
