import { describe, it, expect } from "vitest";
import { toProductCardData } from "@/lib/product-view";

describe("toProductCardData", () => {
  it("derives the minimum variant price and its id", () => {
    const data = toProductCardData({
      slug: "x", name: "X", subtitle: "y", status: "ACTIVE", imageUrl: null,
      variants: [
        { id: "v-expensive", priceCents: 9900, compareAtCents: 11900 },
        { id: "v-cheap", priceCents: 5900, compareAtCents: 6900 },
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
});
