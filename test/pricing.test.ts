import { describe, it, expect } from "vitest";
import {
  bulkDiscountBps,
  bulkDiscountedTotalCents,
  bulkSavingsCents,
  qualifiesForBulk,
} from "@/lib/pricing";

describe("bulk pricing tiers", () => {
  it("returns the right tier discount for vials + types", () => {
    expect(bulkDiscountBps(99, 3)).toBe(0); // too few vials
    expect(bulkDiscountBps(100, 2)).toBe(0); // too few types
    expect(bulkDiscountBps(100, 3)).toBe(1500); // 15%
    expect(bulkDiscountBps(200, 4)).toBe(2000); // 20%
    expect(bulkDiscountBps(300, 5)).toBe(2500); // 25%
    expect(bulkDiscountBps(400, 6)).toBe(3000); // 30%
    expect(bulkDiscountBps(500, 7)).toBe(4000); // 40%
  });
  it("uses the best tier whose BOTH thresholds are met", () => {
    expect(bulkDiscountBps(500, 4)).toBe(2000); // 500 vials but only 4 types -> 20%
    expect(bulkDiscountBps(500, 6)).toBe(3000); // 6 types -> 30%
    expect(bulkDiscountBps(250, 9)).toBe(2000); // 9 types but only 250 vials -> 20%
  });
  it("qualifies once any tier applies", () => {
    expect(qualifiesForBulk(100, 3)).toBe(true);
    expect(qualifiesForBulk(99, 3)).toBe(false);
  });
  it("applies the tier discount to the subtotal", () => {
    expect(bulkDiscountedTotalCents(500000, 100, 3)).toBe(425000); // 15% off $5,000 -> $4,250
    expect(bulkDiscountedTotalCents(500000, 500, 7)).toBe(300000); // 40% off -> $3,000
    expect(bulkDiscountedTotalCents(500000, 50, 3)).toBe(500000); // no discount
  });
  it("reports savings", () => {
    expect(bulkSavingsCents(500000, 500, 7)).toBe(200000); // $2,000 off
    expect(bulkSavingsCents(500000, 1, 1)).toBe(0);
  });
});
