import Link from "next/link";
import { PriceDisplay } from "@/components/ui/price-display";
import { Badge } from "@/components/ui/badge";

export function StackCard({ stack }: {
  stack: { slug: string; name: string; tagline: string; priceCents: number; compareAtCents: number };
}) {
  return (
    <Link href={`/stacks/${stack.slug}`}
      className="flex flex-col rounded-2xl border border-border bg-card/40 p-6 transition-colors hover:border-primary/40">
      <Badge>Bundle</Badge>
      <h3 className="mt-3 text-xl font-semibold text-foreground">{stack.name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{stack.tagline}</p>
      <div className="mt-4"><PriceDisplay priceCents={stack.priceCents} compareAtCents={stack.compareAtCents} /></div>
    </Link>
  );
}
