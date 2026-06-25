import { describe, it, expect } from "vitest";
import { retailPriceCents } from "@/lib/retail-pricing";

describe("retail pricing", () => {
  it("returns the mapped price in cents for a known slug+mg", () => {
    expect(retailPriceCents("tirzepatide", 10)).toBe(8700);
    expect(retailPriceCents("bpc-157", 5)).toBe(4500);
    expect(retailPriceCents("nad-plus", 500)).toBe(7000);
  });
  it("supports decimal mg and IU/mL strengths", () => {
    expect(retailPriceCents("igf-1-lr3", 0.1)).toBe(3400);
    expect(retailPriceCents("hcg", 5000)).toBe(2500);
    expect(retailPriceCents("sterile-water", 3)).toBe(900);
  });
  it("returns 0 for an unknown key", () => {
    expect(retailPriceCents("does-not-exist", 5)).toBe(0);
  });
});
