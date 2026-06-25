"use client";
import { useState } from "react";
import { ProductCard, type ProductCardData } from "@/components/commerce/product-card";
import { SectionShell, SectionHeader } from "@/components/sections/_shared";

export function CatalogBrowser({
  categories,
  productsByCategory,
}: {
  categories: { slug: string; name: string }[];
  productsByCategory: Record<string, ProductCardData[]>;
}) {
  const visibleCategories = categories.filter(
    (c) => (productsByCategory[c.slug]?.length ?? 0) > 0,
  );

  const [activeSlug, setActiveSlug] = useState<string>(
    visibleCategories[0]?.slug ?? "",
  );

  if (visibleCategories.length === 0) return null;

  const activeProducts = productsByCategory[activeSlug] ?? [];

  return (
    <SectionShell id="catalog">
      <SectionHeader
        tag="Research catalogue"
        title="Browse by category"
      />
      {/* Sticky category tab bar */}
      <div
        role="tablist"
        aria-label="Product categories"
        className="sticky top-16 z-10 -mx-6 mb-8 overflow-x-auto bg-background/90 px-6 py-3 backdrop-blur-sm"
      >
        <div className="flex gap-2 min-w-max">
          {visibleCategories.map((cat) => (
            <button
              key={cat.slug}
              role="tab"
              aria-selected={activeSlug === cat.slug}
              onClick={() => setActiveSlug(cat.slug)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors whitespace-nowrap ${
                activeSlug === cat.slug
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Product grid */}
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {activeProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
