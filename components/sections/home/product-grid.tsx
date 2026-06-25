"use client";
import { ProductCard, type ProductCardData } from "@/components/commerce/product-card";
import { Reveal } from "@/components/reveal";
import { SectionShell, SectionHeader } from "@/components/sections/_shared";

export function ProductGrid({ products }: { products: ProductCardData[] }) {
  if (!products.length) return null;
  return (
    <SectionShell id="products">
      <Reveal>
        <SectionHeader
          tag="Full catalog"
          title="Research-grade peptides"
          description="All compounds are synthesized at ≥ 98% purity and supplied exclusively for laboratory research. COA documentation included with every order."
        />
      </Reveal>
      <div className="mx-auto grid max-w-[1200px] gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product, i) => (
          <Reveal key={product.slug} delay={(i % 3) * 80}>
            <ProductCard product={product} />
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
