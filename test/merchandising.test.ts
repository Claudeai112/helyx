import { describe, it, expect } from "vitest";
import { isPopular, isNew, popularityRank } from "@/lib/merchandising";

describe("merchandising", () => {
  it("flags popular and new sets", () => {
    expect(isPopular("tirzepatide")).toBe(true);
    expect(isPopular("adipotide")).toBe(false);
    expect(isNew("retatrutide")).toBe(true);
    expect(isNew("bpc-157")).toBe(false);
  });
  it("ranks popular ahead of non-popular", () => {
    expect(popularityRank("tirzepatide")).toBeLessThan(popularityRank("adipotide"));
  });
});
