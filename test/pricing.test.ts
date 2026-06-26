import { describe, it, expect } from "vitest";
import {
  bulkDiscountBps,
  bulkDiscountedTotalCents,
  bulkSavingsCents,
  qualifiesForBulk,
  nextBulkTier,
} from "@/lib/pricing";

describe("bulk pricing tiers (vial-count only)", () => {
  it("returns the right tier discount for vial count", () => {
    expect(bulkDiscountBps(24)).toBe(0); // below entry
    expect(bulkDiscountBps(25)).toBe(1500); // 15%
    expect(bulkDiscountBps(50)).toBe(2000); // 20%
    expect(bulkDiscountBps(100)).toBe(3000); // 30%
    expect(bulkDiscountBps(200)).toBe(4000); // 40%
    expect(bulkDiscountBps(500)).toBe(4000); // caps at 40%
  });
  it("qualifies once any tier applies", () => {
    expect(qualifiesForBulk(25)).toBe(true);
    expect(qualifiesForBulk(24)).toBe(false);
  });
  it("applies the tier discount to the subtotal", () => {
    expect(bulkDiscountedTotalCents(500000, 25)).toBe(425000); // 15% off $5,000 -> $4,250
    expect(bulkDiscountedTotalCents(500000, 200)).toBe(300000); // 40% off -> $3,000
    expect(bulkDiscountedTotalCents(500000, 10)).toBe(500000); // no discount
  });
  it("reports savings", () => {
    expect(bulkSavingsCents(500000, 200)).toBe(200000); // $2,000 off
    expect(bulkSavingsCents(500000, 1)).toBe(0);
  });
  it("finds the next higher tier", () => {
    expect(nextBulkTier(0)?.minVials).toBe(25);
    expect(nextBulkTier(25)?.minVials).toBe(50);
    expect(nextBulkTier(100)?.minVials).toBe(200);
    expect(nextBulkTier(200)).toBeNull();
  });
});
