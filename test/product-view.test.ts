import { describe, it, expect } from "vitest";
import { toProductCardData } from "@/lib/product-view";

describe("toProductCardData", () => {
  it("derives the minimum variant price and its id", () => {
    const data = toProductCardData({
      slug: "x", name: "X", subtitle: "y", status: "ACTIVE", imageUrl: null,
      variants: [
        { id: "v-expensive", label: "10mg", mg: 10, priceCents: 9900, compareAtCents: 11900 },
        { id: "v-cheap", label: "5mg", mg: 5, priceCents: 5900, compareAtCents: 6900 },
      ],
    });
    expect(data.minPriceCents).toBe(5900);
    expect(data.minCompareAtCents).toBe(6900);
    expect(data.minVariantId).toBe("v-cheap");
  });
  it("handles no variants", () => {
    const data = toProductCardData({
      slug: "x", name: "X", subtitle: "y", status: "ACTIVE", imageUrl: null, variants: [],
    });
    expect(data.minPriceCents).toBe(0);
    expect(data.minVariantId).toBe("");
  });
  it("carries all variants sorted by mg", () => {
    const card = toProductCardData({
      slug: "x", name: "X", subtitle: "s", status: "ACTIVE", imageUrl: null,
      variants: [
        { id: "b", label: "10mg vial", mg: 10, priceCents: 200, compareAtCents: null },
        { id: "a", label: "5mg vial", mg: 5, priceCents: 100, compareAtCents: null },
      ],
    });
    expect(card.variants.map((v) => v.mg)).toEqual([5, 10]);
    expect(card.variants[0].id).toBe("a");
  });
});
