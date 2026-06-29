export const dynamic = "force-dynamic";
import { Suspense } from "react";
import { getAllProducts } from "@/lib/catalog";
import { toProductCardData } from "@/lib/product-view";
import { isPopular, isNew, popularityRank } from "@/lib/merchandising";
import { Storefront } from "@/components/storefront/storefront";
import type { StorefrontItem } from "@/lib/storefront-filter";
import { BulkSection } from "@/components/sections/home/bulk";
import { EducationSection } from "@/components/sections/home/education";
import { SignupSection } from "@/components/sections/home/signup";
import { DisclaimerBar } from "@/components/ui/disclaimer-bar";

export default async function Home() {
  let products: Awaited<ReturnType<typeof getAllProducts>> = [];
  try {
    products = await getAllProducts();
  } catch {}

  // One unified, filterable item list (card data + filter facets + search haystack + merchandising).
  const items: StorefrontItem[] = products.map((p) => {
    const card = toProductCardData(p, p.category?.slug);
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

  return (
    <>
      <Suspense fallback={null}>
        <Storefront items={items} categories={categories} />
      </Suspense>
      <BulkSection />
      <EducationSection />
      <SignupSection />
      <section className="mx-auto max-w-[1200px] px-6 py-8">
        <DisclaimerBar />
      </section>
    </>
  );
}
