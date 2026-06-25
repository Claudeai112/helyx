import { describe, it, expect } from "vitest";
import { stackComponentSumCents } from "@/lib/product-view";

describe("stackComponentSumCents", () => {
  it("sums the cheapest variant of each product", () => {
    const sum = stackComponentSumCents([
      { product: { variants: [{ priceCents: 5900 }, { priceCents: 9900 }] } },
      { product: { variants: [{ priceCents: 8900 }] } },
    ]);
    expect(sum).toBe(14800);
  });
});
