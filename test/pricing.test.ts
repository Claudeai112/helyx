import { describe, it, expect } from "vitest";
import {
  bulkDiscountBps,
  bulkDiscountedTotalCents,
  bulkSavingsCents,
  qualifiesForBulk,
} from "@/lib/pricing";

describe("bulk pricing tiers", () => {
  it("returns the right tier discount for vials + types", () => {
    expect(bulkDiscountBps(99, 5)).toBe(0); // too few vials
    expect(bulkDiscountBps(100, 4)).toBe(0); // too few types
    expect(bulkDiscountBps(100, 5)).toBe(2000); // 20%
    expect(bulkDiscountBps(300, 10)).toBe(2500); // 25%
    expect(bulkDiscountBps(500, 15)).toBe(4000); // 40%
  });
  it("uses the best tier whose BOTH thresholds are met", () => {
    expect(bulkDiscountBps(500, 10)).toBe(2500); // 500 vials but only 10 types -> 25%
    expect(bulkDiscountBps(300, 15)).toBe(2500); // 15 types but only 300 vials -> 25%
    expect(bulkDiscountBps(600, 20)).toBe(4000); // both top thresholds -> 40%
  });
  it("qualifies once any tier applies", () => {
    expect(qualifiesForBulk(100, 5)).toBe(true);
    expect(qualifiesForBulk(99, 5)).toBe(false);
  });
  it("applies the tier discount to the subtotal", () => {
    expect(bulkDiscountedTotalCents(500000, 100, 5)).toBe(400000);  // 20% off $5,000 -> $4,000
    expect(bulkDiscountedTotalCents(500000, 300, 10)).toBe(375000); // 25% off -> $3,750
    expect(bulkDiscountedTotalCents(500000, 500, 15)).toBe(300000); // 40% off -> $3,000
    expect(bulkDiscountedTotalCents(500000, 50, 5)).toBe(500000);   // no discount
  });
  it("reports savings", () => {
    expect(bulkSavingsCents(500000, 500, 15)).toBe(200000); // $2,000 off
    expect(bulkSavingsCents(500000, 1, 1)).toBe(0);
  });
});
