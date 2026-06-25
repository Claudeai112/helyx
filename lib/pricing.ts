export const BULK_VIAL_QTY = 100;
export const BULK_DISCOUNT_BPS = 1500; // 15%
export const BULK_MIN_CENTS = 100000; // $1000

export function bulkLotPriceCents(vialPriceCents: number): number {
  return Math.round(vialPriceCents * BULK_VIAL_QTY * (1 - BULK_DISCOUNT_BPS / 10000));
}

export function bulkPerVialCents(vialPriceCents: number): number {
  return Math.round(bulkLotPriceCents(vialPriceCents) / BULK_VIAL_QTY);
}

export function qualifiesForBulk(subtotalCents: number): boolean {
  return subtotalCents >= BULK_MIN_CENTS;
}
