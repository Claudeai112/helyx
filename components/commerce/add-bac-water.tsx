"use client";
import { useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { formatCents } from "@/lib/money";

type BacVariant = { id: string; label: string; priceCents: number };

// Obvious reconstitution add-on shown on peptide product pages.
export function AddBacWater({ variants }: { variants: BacVariant[] }) {
  const [selectedId, setSelectedId] = useState<string>(variants[0]?.id ?? "");
  const selected = variants.find((v) => v.id === selectedId) ?? variants[0];
  const { add } = useCart();
  if (!variants.length) return null;

  return (
    <div className="mt-6 rounded-xl border-2 border-primary/30 bg-primary/5 p-4">
      <p className="font-heading text-sm font-semibold text-foreground">
        Add BAC water for reconstitution
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Most lyophilised research peptides require a reconstitution solvent. Add BAC water to your order.
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          aria-label="BAC water size"
          className="rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground"
        >
          {variants.map((v) => (
            <option key={v.id} value={v.id}>
              {v.label} · {formatCents(v.priceCents)}
            </option>
          ))}
        </select>
        <Button
          onClick={() =>
            add({
              variantId: selected.id,
              slug: "bac-water",
              name: "BAC Water",
              unitPriceCents: selected.priceCents,
              quantity: 1,
              variants,
            })
          }
        >
          Add BAC water
        </Button>
      </div>
    </div>
  );
}
