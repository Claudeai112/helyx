import type { Metadata } from "next";
import { DisclaimerBar } from "@/components/ui/disclaimer-bar";
import { formatCents } from "@/lib/money";
import {
  bulkDiscountedTotalCents,
  bulkSavingsCents,
  BULK_MIN_CENTS,
  BULK_DISCOUNT_BPS,
} from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Bulk Orders",
  description: "Bulk peptide research supply orders for institutions and laboratories.",
};

const PCT = BULK_DISCOUNT_BPS / 100; // 25
const EXAMPLES = [BULK_MIN_CENTS, 200000, 500000]; // $1,000 / $2,000 / $5,000

export default function BulkPage() {
  return (
    <div className="mx-auto max-w-[900px] px-6 pb-24 pt-20">
      <h1 className="text-3xl font-semibold tracking-tight">Bulk Research Supply Orders</h1>

      <p className="mt-4 text-muted-foreground">
        Qualified research institutions, academic laboratories, and pharmaceutical companies may
        place bulk orders through the standard checkout process. Orders with a subtotal of{" "}
        {formatCents(BULK_MIN_CENTS)} or more automatically receive {PCT}% off the total order.
      </p>

      <p className="mt-4 text-muted-foreground">
        Bulk ordering is intended for institutional and laboratory research procurement only. All
        compounds are supplied for in-vitro and non-clinical research use exclusively.
      </p>

      {/* Bulk pricing examples — 25% off the total order over the minimum */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight">
          {PCT}% off orders over {formatCents(BULK_MIN_CENTS)}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The {PCT}% bulk discount applies to your entire order subtotal once it reaches{" "}
          {formatCents(BULK_MIN_CENTS)}. Example: a {formatCents(BULK_MIN_CENTS)} subtotal &times;{" "}
          {PCT}% off = {formatCents(bulkSavingsCents(BULK_MIN_CENTS))} off, so you pay{" "}
          {formatCents(bulkDiscountedTotalCents(BULK_MIN_CENTS))}. Illustrative totals (USD):
        </p>

        <div className="mt-4 overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-3 text-left font-medium text-foreground">Order subtotal</th>
                <th className="px-4 py-3 text-left font-medium text-foreground">Bulk discount ({PCT}%)</th>
                <th className="px-4 py-3 text-left font-medium text-foreground">You pay</th>
              </tr>
            </thead>
            <tbody>
              {EXAMPLES.map((sub) => (
                <tr key={sub} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-foreground">{formatCents(sub)}</td>
                  <td className="px-4 py-3 text-muted-foreground">− {formatCents(bulkSavingsCents(sub))}</td>
                  <td className="px-4 py-3 font-medium text-foreground">{formatCents(bulkDiscountedTotalCents(sub))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ordering instructions */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight">How to Place a Bulk Order</h2>
        <ol className="mt-4 space-y-2 text-sm text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">1.</span> Add the required compounds and
            quantities to your cart via the standard product catalogue.
          </li>
          <li>
            <span className="font-medium text-foreground">2.</span> Proceed to checkout. Orders
            totalling {formatCents(BULK_MIN_CENTS)} or more automatically receive {PCT}% off the
            total and are routed for wholesale processing.
          </li>
          <li>
            <span className="font-medium text-foreground">3.</span> Provide your institutional or
            laboratory purchase order number at checkout if applicable.
          </li>
          <li>
            <span className="font-medium text-foreground">4.</span> You will receive an order
            confirmation with an estimated dispatch date.
          </li>
        </ol>
      </div>

      {/* Verbatim bulk notice — required verbatim */}
      <p className="mt-10 rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
        {"Bulk/wholesale orders may require additional processing time. Estimated delivery window: 2–3 weeks."}
      </p>

      {/* Contact */}
      <p className="mt-8 text-sm text-muted-foreground">
        For institutional account enquiries or purchase order processing, contact our research
        supply team at{" "}
        <a
          href="mailto:bulk@helyxpeptides.com"
          className="underline underline-offset-4 hover:text-foreground"
        >
          bulk@helyxpeptides.com
        </a>
        .
      </p>

      <DisclaimerBar className="mt-10" />
    </div>
  );
}
