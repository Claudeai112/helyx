export const dynamic = "force-dynamic";
import { Suspense } from "react";
import { getAllProducts, getAllStacks } from "@/lib/catalog";
import { toProductCardData, stackComponentSumCents } from "@/lib/product-view";
import { stackPriceCents } from "@/lib/money";
import { isPopular, isNew, popularityRank } from "@/lib/merchandising";
import { Storefront } from "@/components/storefront/storefront";
import type { StorefrontItem } from "@/lib/storefront-filter";
import { StacksSection } from "@/components/sections/home/stacks";
import { BulkSection } from "@/components/sections/home/bulk";
import { EducationSection } from "@/components/sections/home/education";
import { SignupSection } from "@/components/sections/home/signup";
import { DisclaimerBar } from "@/components/ui/disclaimer-bar";

export default async function Home() {
  let products: Awaited<ReturnType<typeof getAllProducts>> = [];
  let stacks: Awaited<ReturnType<typeof getAllStacks>> = [];
  try {
    [products, stacks] = await Promise.all([getAllProducts(), getAllStacks()]);
  } catch {}

  // One unified, filterable item list (card data + filter facets + search haystack + merchandising).
  const items: StorefrontItem[] = products.map((p) => {
    const card = toProductCardData(p);
    const mgs = [...new Set(p.variants.map((v) => parseFloat(v.label)).filter((n) => Number.isFinite(n)))]
      .sort((a, b) => a - b);
    const haystack = [p.name, p.subtitle, p.researchOverview, ...(p.benefits ?? []), p.category?.name ?? ""]
      .join(" ").toLowerCase();
    return {
      card,
      categorySlug: p.category?.slug ?? "other",
      categoryName: p.category?.name ?? "Other",
      mgs,
      minPriceCents: card.minPriceCents,
      haystack,
      isPopular: isPopular(p.slug),
      isNew: isNew(p.slug),
      popularityRank: popularityRank(p.slug),
    };
  });

  // Ordered category list (by category.order) for the sidebar filter.
  const categoryMap = new Map<string, { slug: string; name: string; order: number }>();
  for (const p of products) {
    if (p.category && !categoryMap.has(p.category.slug)) {
      categoryMap.set(p.category.slug, { slug: p.category.slug, name: p.category.name, order: p.category.order });
    }
  }
  const categories = [...categoryMap.values()]
    .sort((a, b) => a.order - b.order)
    .map(({ slug, name }) => ({ slug, name }));

  const stackCards = stacks.map((s) => {
    const sum = stackComponentSumCents(s.items);
    return {
      slug: s.slug,
      name: s.name,
      tagline: s.tagline,
      priceCents: stackPriceCents(sum, s.discountBps),
      contents: s.items.map((i) => i.product.name),
    };
  });

  return (
    <>
      <Suspense fallback={null}>
        <Storefront items={items} categories={categories} />
      </Suspense>
      <StacksSection stacks={stackCards} />
      <BulkSection />
      <EducationSection />
      <SignupSection />
      <section className="mx-auto max-w-[1200px] px-6 py-8">
        <DisclaimerBar />
      </section>
    </>
  );
}
