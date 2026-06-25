export const dynamic = "force-dynamic";
import { getAllProducts, getAllStacks } from "@/lib/catalog";
import { toProductCardData, stackComponentSumCents } from "@/lib/product-view";
import { stackPriceCents } from "@/lib/money";
import { CatalogBrowser } from "@/components/sections/home/catalog-browser";
import { StacksSection } from "@/components/sections/home/stacks";
import { BulkSection } from "@/components/sections/home/bulk";
import { EducationSection } from "@/components/sections/home/education";
import { SignupSection } from "@/components/sections/home/signup";
import { DisclaimerBar } from "@/components/ui/disclaimer-bar";
import type { ProductCardData } from "@/components/commerce/product-card";

export default async function Home() {
  let products: Awaited<ReturnType<typeof getAllProducts>> = [];
  let stacks: Awaited<ReturnType<typeof getAllStacks>> = [];
  try {
    [products, stacks] = await Promise.all([getAllProducts(), getAllStacks()]);
  } catch {}

  // Build productsByCategory grouped by category slug
  const productsByCategory: Record<string, ProductCardData[]> = {};
  for (const p of products) {
    const slug = p.category?.slug ?? "other";
    if (!productsByCategory[slug]) productsByCategory[slug] = [];
    productsByCategory[slug].push(toProductCardData(p));
  }

  // Build ordered category list from products (ordered by category.order)
  const categoryMap = new Map<string, { slug: string; name: string; order: number }>();
  for (const p of products) {
    if (p.category && !categoryMap.has(p.category.slug)) {
      categoryMap.set(p.category.slug, {
        slug: p.category.slug,
        name: p.category.name,
        order: p.category.order,
      });
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
      <CatalogBrowser categories={categories} productsByCategory={productsByCategory} />
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
