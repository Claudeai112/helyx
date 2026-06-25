import Link from "next/link";
import { PriceDisplay } from "@/components/ui/price-display";
import { Badge } from "@/components/ui/badge";

export type ProductCardData = {
  slug: string;
  name: string;
  subtitle: string;
  status: "ACTIVE" | "COMING_SOON" | "WAITLIST";
  imageUrl?: string | null;
  minPriceCents: number;
  minCompareAtCents?: number | null;
};

export function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col rounded-2xl border border-border bg-card/40 p-5 transition-colors hover:border-primary/40"
    >
      <div className="mb-4 flex items-center justify-between">
        <Badge>Rx</Badge>
        {product.status === "WAITLIST" && <Badge variant="muted">Waitlist</Badge>}
        {product.status === "COMING_SOON" && <Badge variant="muted">Coming soon</Badge>}
      </div>
      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary">
        {product.name}
      </h3>
      <p className="mb-4 text-sm text-muted-foreground">{product.subtitle}</p>
      <div className="mt-auto">
        <PriceDisplay
          priceCents={product.minPriceCents}
          compareAtCents={product.minCompareAtCents}
        />
      </div>
    </Link>
  );
}
