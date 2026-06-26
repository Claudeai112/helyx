import { describe, it, expect } from "vitest";
import { bulkDiscountedTotalCents, bulkSavingsCents, qualifiesForBulk, BULK_MIN_CENTS } from "@/lib/pricing";

describe("bulk pricing", () => {
  it("qualifies for bulk at or above $1000 subtotal", () => {
    expect(BULK_MIN_CENTS).toBe(100000);
    expect(qualifiesForBulk(99999)).toBe(false);
    expect(qualifiesForBulk(100000)).toBe(true);
  });
  it("applies 25% off the total order once it qualifies", () => {
    expect(bulkDiscountedTotalCents(100000)).toBe(75000);  // $1000 -> $750
    expect(bulkDiscountedTotalCents(200000)).toBe(150000); // $2000 -> $1500
  });
  it("does not discount orders below the minimum", () => {
    expect(bulkDiscountedTotalCents(99999)).toBe(99999);
  });
  it("reports the savings amount", () => {
    expect(bulkSavingsCents(200000)).toBe(50000); // $500 off $2000
    expect(bulkSavingsCents(50000)).toBe(0);
  });
});
