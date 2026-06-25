import type { Metadata } from "next";
import { EmailCapture } from "@/components/marketing/email-capture";

export const metadata: Metadata = {
  title: "Bulk Orders",
  description: "Bulk peptide research supply orders for institutions and laboratories.",
};

export default function BulkPage() {
  return (
    <div className="mx-auto max-w-[900px] px-6 pb-24 pt-20">
      <h1 className="text-3xl font-semibold tracking-tight">Bulk Research Supply Orders</h1>
      <p className="mt-4 text-muted-foreground">
        Helyx Peptides offers volume pricing for qualified research institutions, academic
        laboratories, and pharmaceutical companies requiring bulk quantities of research-grade
        peptides. Minimum order quantities and pricing tiers vary by compound.
      </p>
      <p className="mt-4 text-muted-foreground">
        To reach our research supply team directly, email{" "}
        <a
          href="mailto:bulk@helyxpeptides.com"
          className="underline underline-offset-4 hover:text-foreground"
        >
          bulk@helyxpeptides.com
        </a>
        .
      </p>
      <div className="mt-8">
        <p className="mb-3 text-sm font-medium text-foreground">
          Or leave your details and we&apos;ll follow up with volume pricing:
        </p>
        <EmailCapture source="bulk" />
      </div>
    </div>
  );
}
