"use client";
import { StackCard } from "@/components/commerce/stack-card";
import { Reveal } from "@/components/reveal";
import { SectionShell, SectionHeader } from "@/components/sections/_shared";

type StackData = {
  slug: string;
  name: string;
  tagline: string;
  priceCents: number;
  compareAtCents: number;
  contents?: string[];
};

export function StacksSection({ stacks }: { stacks: StackData[] }) {
  if (!stacks.length) return null;
  return (
    <SectionShell id="stacks" className="bg-secondary/40">
      <Reveal>
        <SectionHeader
          tag="Protocol stacks"
          title="Curated research bundles"
          description="Pre-assembled combinations of complementary peptides for multi-target research programmes. Bundled pricing versus individual compound ordering."
        />
      </Reveal>
      <div className="mx-auto grid max-w-[1200px] gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stacks.map((stack, i) => (
          <Reveal key={stack.slug} delay={(i % 3) * 80}>
            <StackCard stack={stack} />
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
