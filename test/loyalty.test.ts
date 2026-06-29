import { describe, it, expect } from "vitest";
import { loyaltyProgress, freeVialDiscountCents, VIALS_PER_REWARD } from "@/lib/loyalty";

describe("loyalty progress", () => {
  it("starts empty", () => {
    const p = loyaltyProgress(0);
    expect(p.earnedRewards).toBe(0);
    expect(p.availableRewards).toBe(0);
    expect(p.progressInCycle).toBe(0);
    expect(p.untilNext).toBe(VIALS_PER_REWARD);
  });

  it("tracks mid-cycle progress", () => {
    const p = loyaltyProgress(7);
    expect(p.progressInCycle).toBe(7);
    expect(p.untilNext).toBe(3);
    expect(p.earnedRewards).toBe(0);
  });

  it("earns a reward at exactly 10", () => {
    const p = loyaltyProgress(10);
    expect(p.earnedRewards).toBe(1);
    expect(p.availableRewards).toBe(1);
    expect(p.progressInCycle).toBe(0);
  });

  it("subtracts redeemed rewards from available", () => {
    const p = loyaltyProgress(23, 2);
    expect(p.earnedRewards).toBe(2);
    expect(p.redeemedRewards).toBe(2);
    expect(p.availableRewards).toBe(0);
    expect(p.progressInCycle).toBe(3);
  });

  it("never shows negative available rewards", () => {
    expect(loyaltyProgress(10, 5).availableRewards).toBe(0);
  });
});

describe("free vial discount", () => {
  it("picks the cheapest eligible (peptide) vial", () => {
    const d = freeVialDiscountCents([
      { priceCents: 5900, eligible: true },
      { priceCents: 2200, eligible: true },
      { priceCents: 700, eligible: false }, // a supply — not eligible
    ]);
    expect(d).toBe(2200);
  });

  it("ignores supplies entirely", () => {
    const d = freeVialDiscountCents([
      { priceCents: 700, eligible: false },
      { priceCents: 1200, eligible: false },
    ]);
    expect(d).toBe(0);
  });

  it("returns 0 when there are no lines", () => {
    expect(freeVialDiscountCents([])).toBe(0);
  });
});
