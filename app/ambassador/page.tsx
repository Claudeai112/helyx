import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ambassador Program",
  description: "Join the Helyx Peptides ambassador program for researchers and institutions.",
};

export default function AmbassadorPage() {
  return (
    <div className="mx-auto max-w-[900px] px-6 pb-24 pt-20">
      <h1 className="text-3xl font-semibold tracking-tight">Ambassador Program</h1>
      <p className="mt-4 text-muted-foreground">
        The Helyx Peptides ambassador program for researchers, lab directors, and institutions
        is currently in development. Check back soon for details on our partnership opportunities.
      </p>
    </div>
  );
}
