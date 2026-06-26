"use client";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-provider";
import { formatCents } from "@/lib/money";
import { stackImage } from "@/lib/stack-images";

export type StackCardData = {
  slug: string;
  name: string;
  tagline: string;
  priceCents: number;
  contents?: string[];
};

export function StackCard({ stack }: { stack: StackCardData }) {
  const { add } = useCart();
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-sm">
      <div className="flex h-[260px] items-center justify-center bg-secondary">
        {stackImage(stack.slug) ? (
          // eslint-disable-next-line @next/next/no-img-element -- static local bundle image; next/image not configured
          <img
            src={stackImage(stack.slug) as string}
            alt={`${stack.name} stack — bundled research vials`}
            className="h-full w-full object-contain"
            loading="lazy"
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-heading text-base font-semibold text-foreground">{stack.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{stack.tagline}</p>
        {stack.contents && stack.contents.length > 0 && (
          <ul className="mt-3 space-y-1">
            {stack.contents.map((item) => (
              <li key={item} className="text-sm text-muted-foreground">
                {item}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto pt-3">
          <span className="text-lg font-semibold text-foreground">
            {formatCents(stack.priceCents)}
          </span>
        </div>
        <Button
          className="mt-4 w-full"
          onClick={() => add({ variantId: `stack:${stack.slug}`, slug: stack.slug, name: stack.name, unitPriceCents: stack.priceCents, quantity: 1 })}
        >
          Add to cart
        </Button>
      </div>
    </div>
  );
}
