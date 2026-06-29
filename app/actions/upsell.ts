"use server";
import { getRelatedProducts } from "@/lib/catalog";
import { toProductCardData } from "@/lib/product-view";
import type { ProductCardData } from "@/components/commerce/product-card";

// Accessory products recommended at checkout, in display order.
const UPSELL_SLUGS = ["insulin-syringes", "alcohol-prep-pads", "vial-holder"];

export async function getUpsellItems(): Promise<ProductCardData[]> {
  try {
    const products = await getRelatedProducts(UPSELL_SLUGS);
    const bySlug = new Map(products.map((p) => [p.slug, p]));
    // Preserve the curated order and skip any that aren't seeded yet.
    return UPSELL_SLUGS.flatMap((slug) => {
      const p = bySlug.get(slug);
      return p ? [toProductCardData(p)] : [];
    });
  } catch {
    return [];
  }
}
