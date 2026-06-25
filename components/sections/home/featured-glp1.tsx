"use client";
import { ProductCard, type ProductCardData } from "@/components/commerce/product-card";
import { Reveal } from "@/components/reveal";
import { SectionShell, SectionHeader } from "@/components/sections/_shared";

export function FeaturedGlp1({ products }: { products: ProductCardData[] }) {
  if (!products.length) return null;
  return (
    <SectionShell id="glp1" className="bg-secondary/40">
      <Reveal>
        <SectionHeader
          tag="GLP-1 peptides"
          title="Featured GLP-1 research compounds"
          description="High-purity GLP-1 class peptides supplied for in-vitro and pre-clinical research use. Each batch is third-party tested with a certificate of analysis."
        />
      </Reveal>
      <div className="mx-auto grid max-w-[1200px] gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product, i) => (
          <Reveal key={product.slug} delay={i * 60}>
            <ProductCard product={product} />
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
