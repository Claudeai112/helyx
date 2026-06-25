import { describe, it, expect } from "vitest";
import { categories, products, stacks } from "@/lib/seed-data";

const FORBIDDEN = ["research purposes only", "research use only", "not for human consumption"];

describe("seed catalog", () => {
  it("has the eight categories", () => {
    expect(categories.map((c) => c.slug)).toEqual(
      expect.arrayContaining([
        "glp-1", "fat-loss", "recovery", "muscle-growth",
        "longevity", "cognitive", "healing", "stacks",
      ]),
    );
  });
  it("seeds all featured peptides", () => {
    const slugs = products.map((p) => p.slug);
    for (const s of [
      "tirzepatide", "semaglutide", "retatrutide", "cagrilintide", "tesamorelin",
      "aod-9604", "bpc-157", "tb-500", "ghk-cu", "ipamorelin", "cjc-1295",
      "mots-c", "nad-plus", "dsip",
    ]) expect(slugs).toContain(s);
  });
  it("marks every product with a category and pricing", () => {
    for (const p of products) {
      expect(p.categorySlug).toBeTruthy();
      expect(p.variants.length).toBeGreaterThan(0);
      for (const v of p.variants) expect(v.priceCents).toBeGreaterThan(0);
    }
  });
  it("contains NO forbidden non-compliant copy", () => {
    const blob = JSON.stringify({ products, stacks, categories }).toLowerCase();
    for (const phrase of FORBIDDEN) expect(blob).not.toContain(phrase);
  });
  it("defines the four branded stacks", () => {
    expect(stacks.map((s) => s.slug)).toEqual(
      expect.arrayContaining(["wolverine", "glp-1-advanced", "recovery", "longevity"]),
    );
  });
});
