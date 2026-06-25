import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { SectionShell, SectionHeader } from "@/components/sections/_shared";

export function BulkSection() {
  return (
    <SectionShell id="bulk" className="bg-secondary/40">
      <Reveal>
        <SectionHeader
          tag="Bulk supply"
          title="Research-scale quantities"
          description="Volume pricing for academic laboratories, CROs, and licensed research institutions. Custom formulations, COA documentation, and cold-chain logistics available on request."
        />
        <div className="text-center">
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
