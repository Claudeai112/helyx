import { describe, it, expect } from "vitest";
import { filterAndSort, applyFilters, EMPTY_FILTER, type StorefrontItem } from "@/lib/storefront-filter";

const mk = (o: {
  slug: string; cat?: string; price?: number; mgs?: number[]; pop?: boolean; isNew?: boolean; rank?: number; hay?: string;
}): StorefrontItem => ({
  card: { slug: o.slug, name: o.slug, subtitle: "", status: "ACTIVE", imageUrl: null, minPriceCents: o.price ?? 100, minCompareAtCents: null, minVariantId: "v", variants: [] },
  categorySlug: o.cat ?? "glp-1", categoryName: o.cat ?? "glp-1",
  mgs: o.mgs ?? [5], minPriceCents: o.price ?? 100, haystack: (o.hay ?? o.slug).toLowerCase(),
  isPopular: !!o.pop, isNew: !!o.isNew, popularityRank: o.rank ?? 1000,
});

const items = [
  mk({ slug: "a", cat: "glp-1", price: 200, mgs: [10], pop: true, rank: 0, hay: "tirzepatide glp metabolic" }),
  mk({ slug: "b", cat: "healing-recovery", price: 100, mgs: [5], isNew: true, rank: 1000, hay: "bpc healing recovery" }),
  mk({ slug: "c", cat: "longevity", price: 300, mgs: [50], rank: 1000, hay: "nad longevity" }),
];

describe("storefront filter", () => {
  it("filters by category (multi, OR)", () => {
    const r = applyFilters(items, { ...EMPTY_FILTER, categories: ["healing-recovery", "longevity"] });
    expect(r.map((i) => i.card.slug).sort()).toEqual(["b", "c"]);
  });
  it("filters by price range, mg, popular, new", () => {
    expect(applyFilters(items, { ...EMPTY_FILTER, priceMax: 150 }).map((i) => i.card.slug)).toEqual(["b"]);
    expect(applyFilters(items, { ...EMPTY_FILTER, mgs: [50] }).map((i) => i.card.slug)).toEqual(["c"]);
    expect(applyFilters(items, { ...EMPTY_FILTER, popularOnly: true }).map((i) => i.card.slug)).toEqual(["a"]);
    expect(applyFilters(items, { ...EMPTY_FILTER, newOnly: true }).map((i) => i.card.slug)).toEqual(["b"]);
  });
  it("search matches haystack (description keywords)", () => {
    expect(applyFilters(items, { ...EMPTY_FILTER, query: "healing" }).map((i) => i.card.slug)).toEqual(["b"]);
    expect(applyFilters(items, { ...EMPTY_FILTER, query: "glp" }).map((i) => i.card.slug)).toEqual(["a"]);
  });
  it("sorts by price and popularity", () => {
    expect(filterAndSort(items, { ...EMPTY_FILTER, sort: "price-asc" }).map((i) => i.card.slug)).toEqual(["b", "a", "c"]);
    expect(filterAndSort(items, { ...EMPTY_FILTER, sort: "popularity" }).map((i) => i.card.slug)[0]).toBe("a");
  });
});
