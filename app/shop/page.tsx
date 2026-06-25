import { getAllProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/commerce/product-card";
import { DisclaimerBar } from "@/components/ui/disclaimer-bar";
import { toProductCardData } from "@/lib/product-view";

export const dynamic = "force-dynamic";

export const metadata = { title: "Shop Peptides" };

export default async function ShopPage() {
  const products = await getAllProducts();
  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      <h1 className="text-4xl font-semibold text-foreground">Shop Peptides</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Research-grade peptide compounds for laboratory use. Sold for research use only.
      </p>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => <ProductCard key={p.slug} product={toProductCardData(p)} />)}
      </div>
      <DisclaimerBar className="mt-16" />
    </div>
  );
}
