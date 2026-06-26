"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-provider";
import { formatCents } from "@/lib/money";

export type ProductCardData = {
  slug: string; name: string; subtitle: string;
  status: "ACTIVE" | "COMING_SOON" | "WAITLIST"; imageUrl?: string | null;
  minPriceCents: number; minCompareAtCents?: number | null; minVariantId: string;
  variants: { id: string; label: string; mg?: number; priceCents: number }[];
};

export function ProductCard({ product }: { product: ProductCardData }) {
  const { add } = useCart();
  const { slug, name, subtitle, imageUrl, variants } = product;
  const [selectedId, setSelectedId] = useState<string>(variants[0]?.id ?? "");
  const selected = variants.find((v) => v.id === selectedId) ?? variants[0];

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-sm">
      <Link href={`/product/${slug}`} className="block aspect-[4/3] bg-secondary" aria-hidden tabIndex={-1}>
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- static local thumbnail; next/image not configured
          <img
            src={imageUrl}
            alt={`${name} research vial`}
            className="h-full w-full object-contain"
            loading="lazy"
          />
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <p className="font-heading text-base font-semibold text-foreground">{name}</p>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        <select
          className="mt-auto w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          {variants.map((v) => (
            <option key={v.id} value={v.id}>{v.label}</option>
          ))}
        </select>
        <span className="mt-2 text-lg font-semibold text-foreground">
          {formatCents(selected?.priceCents ?? 0)}
        </span>
        <Button
          className="mt-3 w-full"
          onClick={() => add({ variantId: selected.id, slug, name, unitPriceCents: selected.priceCents, quantity: 1 })}
        >
          Add to cart
        </Button>
        <Link href={`/product/${slug}`} className="mt-2 text-center text-sm text-muted-foreground hover:text-primary">
          Learn More
        </Link>
      </div>
    </div>
  );
}
