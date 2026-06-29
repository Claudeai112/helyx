import type { ProductCardData } from "@/components/commerce/product-card";
import { productImage } from "@/lib/product-images";
import { isInStock } from "@/lib/stock";

type VariantLike = { id: string; label: string; mg?: number; priceCents: number; compareAtCents?: number | null };
type ProductLike = {
  slug: string; name: string; subtitle: string;
  status: "ACTIVE" | "COMING_SOON" | "WAITLIST"; imageUrl?: string | null;
  variants: VariantLike[];
};

export function toProductCardData(p: ProductLike, categorySlug?: string | null): ProductCardData {
  const cheapest = p.variants.reduce<VariantLike | null>(
    (min, v) => (min === null || v.priceCents < min.priceCents ? v : min), null,
  );
  return {
    slug: p.slug, name: p.name, subtitle: p.subtitle, status: p.status,
    imageUrl: p.imageUrl ?? productImage(p.slug),
    minPriceCents: cheapest?.priceCents ?? 0,
    minCompareAtCents: cheapest?.compareAtCents ?? null,
    minVariantId: cheapest?.id ?? "",
    inStock: isInStock(p.slug, categorySlug),
    variants: p.variants
      .sort((a, b) => (a.mg ?? 0) - (b.mg ?? 0))
      .map((v) => ({ id: v.id, label: v.label, mg: v.mg, priceCents: v.priceCents })),
  };
}

type StackItemLike = { product: { variants: { priceCents: number }[] } };

export function stackComponentSumCents(items: StackItemLike[]): number {
  return items.reduce((sum, item) => {
    const cheapest = item.product.variants.reduce(
      (min, v) => Math.min(min, v.priceCents), Infinity);
    return sum + (Number.isFinite(cheapest) ? cheapest : 0);
  }, 0);
}
