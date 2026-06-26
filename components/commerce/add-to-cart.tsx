"use client";
import { useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { type VariantOption } from "@/components/commerce/variant-selector";
import { AddToCartButton } from "@/components/commerce/add-to-cart-button";
import { formatCents } from "@/lib/money";

export function AddToCart({
  variants,
  slug,
  name,
}: {
  variants: VariantOption[];
  slug: string;
  name: string;
}) {
  const [selectedId, setSelectedId] = useState<string>(variants[0]?.id ?? "");
  const [qty, setQty] = useState<number>(1);
  const selected = variants.find((v) => v.id === selectedId) ?? variants[0];
  const { add } = useCart();

  return (
    <div className="flex flex-col gap-4">
      {variants.length > 1 && (
        <label className="block text-sm">
          <span className="mb-1 block text-muted-foreground">Vial strength</span>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground"
          >
            {variants.map((v) => (
              <option key={v.id} value={v.id}>
                {v.label} · {formatCents(v.priceCents)}
              </option>
            ))}
          </select>
        </label>
      )}

      <div className="text-2xl font-semibold text-foreground">
        {formatCents(selected?.priceCents ?? 0)}
      </div>

      <label className="block text-sm">
        <span className="mb-1 block text-muted-foreground">Quantity</span>
        <div className="inline-flex items-center rounded-md border border-border">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-3 py-2 text-foreground hover:bg-secondary"
          >
            −
          </button>
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Math.floor(Number(e.target.value) || 1)))}
            aria-label="Quantity"
            className="w-14 border-x border-border bg-card px-2 py-2 text-center text-sm text-foreground"
          />
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQty((q) => q + 1)}
            className="px-3 py-2 text-foreground hover:bg-secondary"
          >
            +
          </button>
        </div>
      </label>

      <AddToCartButton
        size="lg"
        className="w-full"
        onAdd={() =>
          add({
            variantId: selected.id,
            slug,
            name,
            unitPriceCents: selected.priceCents,
            quantity: qty,
            variants,
          })
        }
      />
    </div>
  );
}
