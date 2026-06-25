import { notFound } from "next/navigation";
import { getProductsByCategory, getAllCategories } from "@/lib/catalog";
import { ProductCard } from "@/components/commerce/product-card";
import { DisclaimerBar } from "@/components/ui/disclaimer-bar";
import { toProductCardData } from "@/lib/product-view";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const categories = await getAllCategories();
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();
  const products = await getProductsByCategory(slug);
  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      <h1 className="text-4xl font-semibold text-foreground">{category.name}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{category.description}</p>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => <ProductCard key={p.slug} product={toProductCardData(p)} />)}
      </div>
      <DisclaimerBar className="mt-16" />
    </div>
  );
}
