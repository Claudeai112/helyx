import { getAllStacks } from "@/lib/catalog";
import { StackCard } from "@/components/commerce/stack-card";
import { DisclaimerBar } from "@/components/ui/disclaimer-bar";
import { stackComponentSumCents } from "@/lib/product-view";
import { stackPriceCents } from "@/lib/money";

export const dynamic = "force-dynamic";

export const metadata = { title: "Peptide Stacks" };

export default async function StacksPage() {
  const stacks = await getAllStacks();
  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      <h1 className="text-4xl font-semibold text-foreground">Peptide Stacks</h1>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stacks.map((s) => {
          const sum = stackComponentSumCents(s.items);
          return <StackCard key={s.slug} stack={{
            slug: s.slug, name: s.name, tagline: s.tagline,
            priceCents: stackPriceCents(sum, s.discountBps),
          }} />;
        })}
      </div>
      <DisclaimerBar className="mt-16" />
    </div>
  );
}
