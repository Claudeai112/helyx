import type { Metadata } from "next";
import { DisclaimerBar } from "@/components/ui/disclaimer-bar";
import { BulkOrderForm } from "@/components/bulk/bulk-order-form";

export const metadata: Metadata = {
  title: "Bulk Orders",
  description: "Bulk peptide research supply orders for institutions and laboratories.",
};

export default function BulkPage() {
  return (
    <div className="mx-auto max-w-[900px] px-6 pb-24 pt-20">
      <h1 className="text-3xl font-semibold tracking-tight">Bulk Research Supply Orders</h1>

      <p className="mt-4 text-muted-foreground">
        Qualified research institutions, academic laboratories, and pharmaceutical companies may
        request bulk research supply through the form below. Our team will follow up with pricing
        and availability for the compounds and quantities you need.
      </p>

      <p className="mt-4 text-muted-foreground">
        Bulk ordering is intended for institutional and laboratory research procurement only. All
        compounds are supplied for in-vitro and non-clinical research use exclusively.
      </p>

      {/* Bulk inquiry form */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight">Request a Bulk Quote</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Tell us what your laboratory needs and our research-supply team will follow up with bulk
          pricing and availability.
        </p>
        <div className="mt-4">
          <BulkOrderForm />
        </div>
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
          href="mailto:info@helyxpeps.com"
          className="underline underline-offset-4 hover:text-foreground"
        >
          info@helyxpeps.com
        </a>
        .
      </p>

      <DisclaimerBar className="mt-10" />
    </div>
  );
}
