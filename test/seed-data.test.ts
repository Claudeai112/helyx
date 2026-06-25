import { describe, it, expect } from "vitest";
import { categories, products, stacks } from "@/lib/seed-data";
import { retailPriceCents } from "@/lib/retail-pricing";

describe("catalog seed", () => {
  it("has the 10 research-framed categories", () => {
    expect(categories.map((c) => c.slug)).toEqual([
      "glp-1", "metabolic-fat-loss", "healing-recovery", "muscle-gh", "longevity",
      "cognitive", "hormonal-reproductive", "sleep-recovery", "skin-cosmetic", "supplies",
    ]);
  });

  it("every product has >=1 MG variant with a numeric mg and unique sku", () => {
    const skus = new Set<string>();
    for (const p of products) {
      expect(p.variants.length).toBeGreaterThan(0);
      for (const v of p.variants) {
        expect(typeof v.mg).toBe("number");
        expect(skus.has(v.sku)).toBe(false);
        skus.add(v.sku);
      }
    }
  });

  it("every variant has a non-zero retail price", () => {
    for (const p of products) {
      for (const v of p.variants) {
        expect(retailPriceCents(p.slug, v.mg)).toBeGreaterThan(0);
      }
    }
  });

  it("has the 6 stacks", () => {
    expect(stacks.map((s) => s.slug).sort()).toEqual(
      ["glow", "glp1-advanced", "glp1-combo", "klow", "performance", "wolverine"],
    );
  });
});
