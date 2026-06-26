// Bulk/wholesale: a qualifying order is 100+ vials across 5+ different peptide
// types; qualifying orders receive 15% off the order total.
export const BULK_DISCOUNT_BPS = 1500; // 15% off total order
export const BULK_MIN_VIALS = 100; // minimum total vials
export const BULK_MIN_TYPES = 5; // minimum distinct peptide types

export function qualifiesForBulk(totalVials: number, distinctTypes: number): boolean {
  return totalVials >= BULK_MIN_VIALS && distinctTypes >= BULK_MIN_TYPES;
}

export function bulkDiscountedTotalCents(subtotalCents: number, totalVials: number, distinctTypes: number): number {
  return qualifiesForBulk(totalVials, distinctTypes)
    ? Math.round(subtotalCents * (1 - BULK_DISCOUNT_BPS / 10000))
    : subtotalCents;
}

export function bulkSavingsCents(subtotalCents: number, totalVials: number, distinctTypes: number): number {
  return subtotalCents - bulkDiscountedTotalCents(subtotalCents, totalVials, distinctTypes);
}
