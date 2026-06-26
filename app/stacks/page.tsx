import { getAllStacks } from "@/lib/catalog";
import { StackCard } from "@/components/commerce/stack-card";
import { DisclaimerBar } from "@/components/ui/disclaimer-bar";
import { stackComponentSumCents } from "@/lib/product-view";
import { stackPriceCents } from "@/lib/money";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Research Stacks & Bundles",
  description: "Curated multi-peptide research bundles for laboratory use.",
};

export default async function StacksPage() {
  let stacks: Awaited<ReturnType<typeof getAllStacks>> = [];
  try {
    stacks = await getAllStacks();
  } catch {}

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">Research Stacks & Bundles</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Pre-assembled combinations of complementary research peptides for multi-target
        research programmes. Supplied for laboratory and research use only.
      </p>
      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {stacks.map((s) => {
          const sum = stackComponentSumCents(s.items);
          return (
            <StackCard
              key={s.slug}
              stack={{
                slug: s.slug,
                name: s.name,
                tagline: s.tagline,
                priceCents: stackPriceCents(sum, s.discountBps),
                contents: s.items.map((i) => i.product.name),
              }}
            />
          );
        })}
      </div>
      <DisclaimerBar className="mt-12" />
    </div>
  );
}
