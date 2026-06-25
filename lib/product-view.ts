import type { ProductCardData } from "@/components/commerce/product-card";

type VariantLike = { priceCents: number; compareAtCents?: number | null };
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
  };
}
