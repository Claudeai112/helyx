// Bulk/wholesale: 15% off the total order once the subtotal reaches the minimum.
export const BULK_DISCOUNT_BPS = 1500; // 15% off total order
export const BULK_MIN_CENTS = 100000; // $1000 minimum subtotal

export function qualifiesForBulk(subtotalCents: number): boolean {
  return subtotalCents >= BULK_MIN_CENTS;
}

export function bulkDiscountedTotalCents(subtotalCents: number): number {
  return qualifiesForBulk(subtotalCents)
    ? Math.round(subtotalCents * (1 - BULK_DISCOUNT_BPS / 10000))
    : subtotalCents;
}

export function bulkSavingsCents(subtotalCents: number): number {
  return subtotalCents - bulkDiscountedTotalCents(subtotalCents);
}
