"use client";
import { useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { VariantSelector, type VariantOption } from "@/components/commerce/variant-selector";
import { Button } from "@/components/ui/button";

export function AddToCart({
  variants,
  slug,
  name,
}: {
  variants: VariantOption[];
  slug: string;
  name: string;
}) {
  const [selected, setSelected] = useState<VariantOption>(variants[0]);
  const { add } = useCart();

  return (
    <div className="flex flex-col gap-4">
      {variants.length > 1 && (
        <VariantSelector variants={variants} onChange={setSelected} />
      )}
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
          })
        }
      >
        Add to cart
      </Button>
    </div>
  );
}
