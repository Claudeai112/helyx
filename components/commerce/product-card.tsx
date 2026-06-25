"use client";
import Link from "next/link";
import { PriceDisplay } from "@/components/ui/price-display";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-provider";

export type ProductCardData = {
  slug: string; name: string; subtitle: string;
  status: "ACTIVE" | "COMING_SOON" | "WAITLIST"; imageUrl?: string | null;
  minPriceCents: number; minCompareAtCents?: number | null; minVariantId: string;
  variants: { id: string; label: string; mg?: number; priceCents: number }[];
};

export function ProductCard({ product }: { product: ProductCardData }) {
  const { add } = useCart();
  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-sm">
      <Link href={`/product/${product.slug}`} className="block aspect-[4/3] bg-secondary" aria-hidden tabIndex={-1}>
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- static local thumbnail; next/image not configured
          <img
            src={product.imageUrl}
            alt={`${product.name} research vial`}
            className="h-full w-full object-contain"
            loading="lazy"
          />
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <Link href={`/product/${product.slug}`} className="font-heading text-base font-semibold text-foreground hover:text-primary">{product.name}</Link>
        <p className="mt-1 text-sm text-muted-foreground">{product.subtitle}</p>
        <div className="mt-3"><PriceDisplay priceCents={product.minPriceCents} compareAtCents={product.minCompareAtCents} /></div>
        <Button
          className="mt-4 w-full"
          onClick={() => add({ variantId: product.minVariantId, slug: product.slug, name: product.name, unitPriceCents: product.minPriceCents, quantity: 1 })}
        >
          Add to cart
        </Button>
      </div>
    </div>
  );
}
