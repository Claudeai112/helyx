import type { Metadata } from "next";
import { DisclaimerBar } from "@/components/ui/disclaimer-bar";
import { BULK_TIERS } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Bulk Orders",
  description: "Bulk peptide research supply orders for institutions and laboratories.",
};

// Tiers displayed low-to-high.
const TIERS = [...BULK_TIERS].sort((a, b) => a.minVials - b.minVials);

export default function BulkPage() {
  return (
    <div className="mx-auto max-w-[900px] px-6 pb-24 pt-20">
      <h1 className="text-3xl font-semibold tracking-tight">Bulk Research Supply Orders</h1>

      <p className="mt-4 text-muted-foreground">
        Qualified research institutions, academic laboratories, and pharmaceutical companies may
        place bulk orders through the standard checkout process. The bulk discount is applied to the
        order subtotal (each compound&apos;s standard price × quantity) and scales with the total
        number of vials in the order.
      </p>

      <p className="mt-4 text-muted-foreground">
        Bulk ordering is intended for institutional and laboratory research procurement only. All
        compounds are supplied for in-vitro and non-clinical research use exclusively.
      </p>

      {/* Tiered bulk discounts */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight">Bulk discount tiers</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Discounts apply automatically based on the total number of vials in your order:
        </p>

        <div className="mt-4 overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-3 text-left font-medium text-foreground">Vials</th>
                <th className="px-4 py-3 text-left font-medium text-foreground">Discount off subtotal</th>
              </tr>
            </thead>
            <tbody>
              {TIERS.map((t) => (
                <tr key={t.bps} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-foreground">{t.minVials}+</td>
                  <td className="px-4 py-3 font-medium text-foreground">{t.bps / 100}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          The best tier whose vial threshold is met is applied.
        </p>
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
            <span className="font-medium text-foreground">2.</span> The applicable tier discount is
            calculated automatically from your cart&apos;s total vials and number of different peptide
            types; qualifying orders are routed for wholesale processing.
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

      <p className="mt-4 text-sm text-muted-foreground">
        Shipping is paid by the customer on all orders, including bulk and wholesale.
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
