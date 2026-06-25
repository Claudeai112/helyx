import { cn } from "@/lib/utils";
import { formatCents, percentOff } from "@/lib/money";

export function PriceDisplay({
  priceCents, compareAtCents, className,
}: { priceCents: number; compareAtCents?: number | null; className?: string }) {
  const showCompare = !!compareAtCents && compareAtCents > priceCents;
  return (
    <div className={cn("flex items-baseline gap-2", className)}>
      <span className="text-lg font-semibold text-foreground">{formatCents(priceCents)}</span>
      {showCompare && (
        <>
          <span className="text-sm text-muted-foreground line-through">
            {formatCents(compareAtCents!)}
          </span>
          <span className="rounded bg-accent px-1.5 py-0.5 text-xs font-medium text-accent-foreground">
            {percentOff(compareAtCents!, priceCents)}% off
          </span>
        </>
      )}
    </div>
  );
}
