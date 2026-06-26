"use client";
import { useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { type VariantOption } from "@/components/commerce/variant-selector";
import { Button } from "@/components/ui/button";
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

      <Button
        size="lg"
        className="w-full"
        onClick={() =>
          add({
            variantId: selected.id,
            slug,
            name,
            unitPriceCents: selected.priceCents,
            quantity: 1,
            variants,
          })
        }
      >
        Add to cart
      </Button>
    </div>
  );
}
