import { notFound } from "next/navigation";
import { getStackBySlug } from "@/lib/catalog";
import { AddToCart } from "@/components/commerce/add-to-cart";
import { DisclaimerBar } from "@/components/ui/disclaimer-bar";
import { stackComponentSumCents } from "@/lib/product-view";
import { stackPriceCents, formatCents } from "@/lib/money";
import { stackOutcomes } from "@/lib/stack-outcomes";
import { stackImage } from "@/lib/stack-images";

export const dynamic = "force-dynamic";

export default async function StackPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const stack = await getStackBySlug(slug);
  if (!stack) notFound();
  const sum = stackComponentSumCents(stack.items);
  const bundlePriceCents = stackPriceCents(sum, stack.discountBps);
  const img = stackImage(stack.slug);

  return (
    <div className="mx-auto max-w-5xl px-6 py-24">
      <div className="grid gap-12 lg:grid-cols-2">
        <div className="flex aspect-square items-center justify-center overflow-hidden rounded-3xl border border-border bg-secondary">
          {img ? (
            // eslint-disable-next-line @next/next/no-img-element -- static local bundle image; next/image not configured
            <img
              src={img}
              alt={`${stack.name} stack — bundled research vials`}
              className="h-full w-full object-contain p-6"
            />
          ) : null}
        </div>
        <div>
          <h1 className="text-4xl font-semibold text-foreground">{stack.name}</h1>
          <p className="mt-2 text-lg text-muted-foreground">{stack.tagline}</p>
          <div className="mt-6">
            <span className="text-2xl font-semibold text-foreground">{formatCents(bundlePriceCents)}</span>
          </div>
          <ul className="mt-6 space-y-1 text-muted-foreground">
            {stack.items.map((i) => (
              <li key={i.product.slug}>• {i.product.name}</li>
            ))}
          </ul>
          <div className="mt-6">
            <AddToCart
              variants={[{ id: `stack:${stack.slug}`, label: stack.name, priceCents: bundlePriceCents }]}
              slug={stack.slug}
              name={stack.name}
            />
          </div>
          <DisclaimerBar className="mt-6" />
        </div>
      </div>

      <section className="mt-16 max-w-2xl">
        <p className="text-muted-foreground">{stack.overview}</p>
        {stackOutcomes(stack.slug) ? (
          <>
            <h2 className="mt-8 text-xl font-semibold text-foreground">Studied outcomes</h2>
            <p className="mt-3 text-muted-foreground">{stackOutcomes(stack.slug)}</p>
          </>
        ) : null}
        <h2 className="mt-8 text-xl font-semibold text-foreground">Protocol notes</h2>
        <p className="mt-3 text-muted-foreground">{stack.protocol}</p>
      </section>
    </div>
  );
}
