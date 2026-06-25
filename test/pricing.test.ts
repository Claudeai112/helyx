import { describe, it, expect } from "vitest";
import { bulkLotPriceCents, bulkPerVialCents, qualifiesForBulk, BULK_MIN_CENTS } from "@/lib/pricing";

describe("bulk pricing", () => {
  it("100-vial lot = (vial x 100) - 15%", () => {
    expect(bulkLotPriceCents(5000)).toBe(425000); // 5000*100=500000, -15% = 425000
  });
  it("per-vial bulk price is the lot divided by 100, rounded", () => {
    expect(bulkPerVialCents(5000)).toBe(4250);
  });
  it("qualifies for bulk at or above $1000 subtotal", () => {
    expect(BULK_MIN_CENTS).toBe(100000);
    expect(qualifiesForBulk(99999)).toBe(false);
    expect(qualifiesForBulk(100000)).toBe(true);
  });
});
