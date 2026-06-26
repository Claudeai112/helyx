// Bulk/wholesale: vial-count tiers (no peptide-type requirement). Discounts
// start at 25 vials and top out at 200 vials, applied to the order subtotal.
//   25+ vials  -> 15% off
//   50+ vials  -> 20% off
//   100+ vials -> 30% off
//   200+ vials -> 40% off
export type BulkTier = { minVials: number; bps: number };
export const BULK_TIERS: BulkTier[] = [
  { minVials: 200, bps: 4000 },
  { minVials: 100, bps: 3000 },
  { minVials: 50, bps: 2000 },
  { minVials: 25, bps: 1500 },
];

// Best applicable discount (basis points) for the given vial count; 0 if none.
export function bulkDiscountBps(totalVials: number): number {
  for (const t of BULK_TIERS) {
    if (totalVials >= t.minVials) return t.bps;
  }
  return 0;
}

export function qualifiesForBulk(totalVials: number): boolean {
  return bulkDiscountBps(totalVials) > 0;
}

export function bulkDiscountedTotalCents(subtotalCents: number, totalVials: number): number {
  return Math.round(subtotalCents * (1 - bulkDiscountBps(totalVials) / 10000));
}

export function bulkSavingsCents(subtotalCents: number, totalVials: number): number {
  return subtotalCents - bulkDiscountedTotalCents(subtotalCents, totalVials);
}

// The next (higher) tier the order doesn't yet qualify for, or null if at the top.
export function nextBulkTier(totalVials: number): BulkTier | null {
  const currentBps = bulkDiscountBps(totalVials);
  const ascending = [...BULK_TIERS].sort((a, b) => a.bps - b.bps);
  return ascending.find((t) => t.bps > currentBps) ?? null;
}
