import type { ProductCardData } from "@/components/commerce/product-card";

type VariantLike = { id: string; priceCents: number; compareAtCents?: number | null };
type ProductLike = {
  slug: string; name: string; subtitle: string;
  status: "ACTIVE" | "COMING_SOON" | "WAITLIST"; imageUrl?: string | null;
  variants: VariantLike[];
};

export function toProductCardData(p: ProductLike): ProductCardData {
  const cheapest = p.variants.reduce<VariantLike | null>(
    (min, v) => (min === null || v.priceCents < min.priceCents ? v : min), null,
  );
  return {
    slug: p.slug, name: p.name, subtitle: p.subtitle, status: p.status, imageUrl: p.imageUrl,
    minPriceCents: cheapest?.priceCents ?? 0,
    minCompareAtCents: cheapest?.compareAtCents ?? null,
    minVariantId: cheapest?.id ?? "",
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
