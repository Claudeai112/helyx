import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Bulk Orders",
  description: "Bulk peptide research supply orders for institutions and laboratories.",
};

export default function BulkPage() {
  return (
    <div className="mx-auto max-w-[900px] px-6 pb-24 pt-20">
      <h1 className="text-3xl font-semibold tracking-tight">Bulk Orders</h1>
      <p className="mt-4 text-muted-foreground">
        Helyx Peptides offers volume pricing for qualified research institutions, academic
        laboratories, and pharmaceutical companies requiring bulk quantities.
      </p>
      <p className="mt-4 text-muted-foreground">
        To request a bulk order quote, please{" "}
        <Link href="/consultation" className="underline underline-offset-4 hover:text-foreground">
          contact us
        </Link>
        . Minimum order quantities and pricing tiers vary by compound.
      </p>
    </div>
  );
}
