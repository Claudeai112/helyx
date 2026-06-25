import { notFound } from "next/navigation";
import { getStackBySlug } from "@/lib/catalog";
import { ConsultCTA } from "@/components/commerce/consult-cta";
import { PriceDisplay } from "@/components/ui/price-display";
import { DisclaimerBar } from "@/components/ui/disclaimer-bar";
import { stackComponentSumCents } from "@/lib/product-view";
import { stackPriceCents } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function StackPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const stack = await getStackBySlug(slug);
  if (!stack) notFound();
  const sum = stackComponentSumCents(stack.items);
  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="text-4xl font-semibold text-foreground">{stack.name}</h1>
      <p className="mt-2 text-lg text-muted-foreground">{stack.tagline}</p>
      <div className="mt-6"><PriceDisplay priceCents={stackPriceCents(sum, stack.discountBps)} compareAtCents={sum} /></div>
      <p className="mt-8 text-muted-foreground">{stack.overview}</p>
      <h2 className="mt-8 text-xl font-semibold text-foreground">Suggested protocol</h2>
      <p className="mt-3 text-muted-foreground">{stack.protocol}</p>
      <ul className="mt-6 space-y-1 text-muted-foreground">
        {stack.items.map((i) => <li key={i.product.slug}>• {i.product.name}</li>)}
      </ul>
      <div className="mt-8"><ConsultCTA productName={stack.name} status="ACTIVE" /></div>
      <DisclaimerBar className="mt-6" />
    </div>
  );
}
