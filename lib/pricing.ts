// Bulk/wholesale: tiered discount on the order subtotal, based on total vials
// and the number of distinct peptide types in the order.
//   100+ vials & 5+ types  -> 20% off
//   300+ vials & 10+ types -> 25% off
//   500+ vials & 15+ types -> 40% off
export type BulkTier = { minVials: number; minTypes: number; bps: number };
export const BULK_TIERS: BulkTier[] = [
  { minVials: 500, minTypes: 15, bps: 4000 },
  { minVials: 300, minTypes: 10, bps: 2500 },
  { minVials: 100, minTypes: 5, bps: 2000 },
];

// Best applicable discount (basis points) for the given totals; 0 if none qualifies.
export function bulkDiscountBps(totalVials: number, distinctTypes: number): number {
  for (const t of BULK_TIERS) {
    if (totalVials >= t.minVials && distinctTypes >= t.minTypes) return t.bps;
  }
  return 0;
}

export function qualifiesForBulk(totalVials: number, distinctTypes: number): boolean {
  return bulkDiscountBps(totalVials, distinctTypes) > 0;
}

export function bulkDiscountedTotalCents(subtotalCents: number, totalVials: number, distinctTypes: number): number {
  const bps = bulkDiscountBps(totalVials, distinctTypes);
  return Math.round(subtotalCents * (1 - bps / 10000));
}

export function bulkSavingsCents(subtotalCents: number, totalVials: number, distinctTypes: number): number {
  return subtotalCents - bulkDiscountedTotalCents(subtotalCents, totalVials, distinctTypes);
}
