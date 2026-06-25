export const dynamic = "force-dynamic";
import { getAllProducts, getAllStacks } from "@/lib/catalog";
import { toProductCardData, stackComponentSumCents } from "@/lib/product-view";
import { stackPriceCents } from "@/lib/money";
import { FeaturedGlp1 } from "@/components/sections/home/featured-glp1";
import { ProductGrid } from "@/components/sections/home/product-grid";
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
  const cards = products.map(toProductCardData);
  const glp1 = cards.filter((c) =>
    ["tirzepatide", "semaglutide", "retatrutide", "cagrilintide"].includes(c.slug)
  );
  const stackCards = stacks.map((s) => {
    const sum = stackComponentSumCents(s.items);
    return {
      slug: s.slug,
      name: s.name,
      tagline: s.tagline,
      priceCents: stackPriceCents(sum, s.discountBps),
      compareAtCents: sum,
      items: s.items,
    };
  });
  return (
    <>
      <FeaturedGlp1 products={glp1} />
      <ProductGrid products={cards} />
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
