"use client";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { formatCents } from "@/lib/money";
import { getUpsellItems } from "@/app/actions/upsell";
import type { ProductCardData } from "@/components/commerce/product-card";

// "Complete your order" — recommends research-supply accessories on the cart
// page. Items already in the cart are filtered out.
export function CartUpsell() {
  const { items, add } = useCart();
  const [products, setProducts] = useState<ProductCardData[]>([]);

  useEffect(() => {
    let active = true;
    getUpsellItems().then((p) => active && setProducts(p));
    return () => {
      active = false;
    };
  }, []);

  const inCart = new Set(items.map((i) => i.slug));
  const recs = products.filter((p) => !inCart.has(p.slug));
  if (recs.length === 0) return null;

  return (
    <div className="mt-8 rounded-xl border border-border bg-card p-5">
      <h2 className="text-sm font-semibold text-foreground">Complete your order</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Research supplies that pair with your order.
      </p>
      <ul className="mt-4 divide-y divide-border">
        {recs.map((p) => (
          <UpsellRow key={p.slug} product={p} onAdd={add} />
        ))}
      </ul>
    </div>
  );
}

function UpsellRow({
  product,
  onAdd,
}: {
  product: ProductCardData;
  onAdd: ReturnType<typeof useCart>["add"];
}) {
  const [variantId, setVariantId] = useState(product.variants[0]?.id ?? "");
  const selected = product.variants.find((v) => v.id === variantId) ?? product.variants[0];

  return (
    <li className="flex items-center justify-between gap-4 py-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{product.name}</p>
        <p className="truncate text-xs text-muted-foreground">{product.subtitle}</p>
        {product.variants.length > 1 && (
          <select
            value={variantId}
            onChange={(e) => setVariantId(e.target.value)}
            aria-label={`Option for ${product.name}`}
            className="mt-1 rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground"
          >
            {product.variants.map((v) => (
              <option key={v.id} value={v.id}>
                {v.label} · {formatCents(v.priceCents)}
              </option>
            ))}
          </select>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <span className="text-sm font-semibold text-foreground">
          {formatCents(selected?.priceCents ?? 0)}
        </span>
        <button
          type="button"
          onClick={() =>
            selected &&
            onAdd({
              variantId: selected.id,
              slug: product.slug,
              name: product.name,
              unitPriceCents: selected.priceCents,
              quantity: 1,
              variants: product.variants.map((v) => ({
                id: v.id,
                label: v.label,
                priceCents: v.priceCents,
              })),
            })
          }
          className="rounded-full border border-border px-4 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
        >
          Add
        </button>
      </div>
    </li>
  );
}
