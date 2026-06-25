"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { formatCents } from "@/lib/money";

export type VariantOption = { id: string; label: string; priceCents: number };

export function VariantSelector({
  variants,
  onChange,
}: {
  variants: VariantOption[];
  onChange?: (v: VariantOption) => void;
}) {
  const [selected, setSelected] = useState(variants[0]?.id);
  return (
    <div className="flex flex-wrap gap-2">
      {variants.map((v) => (
        <button
          key={v.id}
          type="button"
          onClick={() => {
            setSelected(v.id);
            onChange?.(v);
          }}
          className={cn(
            "rounded-lg border px-3 py-2 text-sm transition-colors",
            selected === v.id
              ? "border-primary text-primary"
              : "border-border text-muted-foreground",
          )}
        >
          {v.label} · {formatCents(v.priceCents)}
        </button>
      ))}
    </div>
  );
}
