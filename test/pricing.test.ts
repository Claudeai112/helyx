import { describe, it, expect } from "vitest";
import {
  bulkDiscountedTotalCents,
  bulkSavingsCents,
  qualifiesForBulk,
  BULK_MIN_VIALS,
  BULK_MIN_TYPES,
} from "@/lib/pricing";

describe("bulk pricing", () => {
  it("qualifies only with 100+ vials across 5+ peptide types", () => {
    expect(BULK_MIN_VIALS).toBe(100);
    expect(BULK_MIN_TYPES).toBe(5);
    expect(qualifiesForBulk(99, 5)).toBe(false); // too few vials
    expect(qualifiesForBulk(100, 4)).toBe(false); // too few types
    expect(qualifiesForBulk(100, 5)).toBe(true);
  });
  it("applies 15% off a qualifying order total", () => {
    expect(bulkDiscountedTotalCents(500000, 100, 5)).toBe(425000); // $5,000 -> $4,250
  });
  it("does not discount non-qualifying orders", () => {
    expect(bulkDiscountedTotalCents(500000, 50, 5)).toBe(500000); // too few vials
    expect(bulkDiscountedTotalCents(500000, 100, 3)).toBe(500000); // too few types
  });
  it("reports the savings amount for a qualifying order", () => {
    expect(bulkSavingsCents(1000000, 100, 5)).toBe(150000); // $1,500 off $10,000
    expect(bulkSavingsCents(1000000, 10, 1)).toBe(0);
  });
});
