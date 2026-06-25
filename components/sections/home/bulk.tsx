import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { SectionShell } from "@/components/sections/_shared";

export function BulkSection() {
  return (
    <SectionShell id="bulk" className="bg-secondary/40">
      <Reveal>
        <div className="mx-auto max-w-[800px] text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
            Bulk supply
          </p>
          <h2 className="mb-4 font-heading text-[clamp(1.75rem,3.5vw,2.75rem)] font-semibold text-foreground">
            Research-scale quantities
          </h2>
          <p className="mb-8 max-w-[600px] mx-auto text-base text-muted-foreground">
            Volume pricing for academic laboratories, CROs, and licensed research
            institutions. Custom formulations, COA documentation, and cold-chain
            logistics available on request.
          </p>
          <Link
            href="/bulk"
            className={buttonVariants({ size: "lg" })}
          >
            Enquire about bulk supply
          </Link>
        </div>
      </Reveal>
    </SectionShell>
  );
}
