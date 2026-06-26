"use client";
import { useState } from "react";
import Link from "next/link";
import { AddToCartButton } from "@/components/commerce/add-to-cart-button";
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
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md">
      {/* Whole card is clickable -> product page (stretched link behind the controls) */}
      <Link href={`/product/${slug}`} className="absolute inset-0 z-0" aria-label={`View ${name}`} />
      <div className="block aspect-[4/3] bg-secondary">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- static local thumbnail; next/image not configured
          <img
            src={imageUrl}
            alt={`${name} research vial`}
            className="h-full w-full object-contain"
            loading="lazy"
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="font-heading text-base font-semibold text-foreground">{name}</p>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary">
          ✓ Third-party tested
        </span>
        <select
          className="relative z-10 mt-auto w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground"
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
        {/* Compliant quantity cost preview — total for a 3-vial research quantity (no cycle/dosing) */}
        <p className="mt-1 text-xs text-muted-foreground">
          3-vial research quantity ≈ {formatCents((selected?.priceCents ?? 0) * 3)}
        </p>
        <AddToCartButton
          className="relative z-10 mt-3 w-full"
          onAdd={() => add({ variantId: selected.id, slug, name, unitPriceCents: selected.priceCents, quantity: 1, variants: variants.map((v) => ({ id: v.id, label: v.label, priceCents: v.priceCents })) })}
        />
        <Link href={`/product/${slug}`} className="relative z-10 mt-2 text-center text-sm text-muted-foreground hover:text-primary">
          Learn More
        </Link>
      </div>
    </div>
  );
}
