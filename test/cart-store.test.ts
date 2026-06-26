import { describe, it, expect } from "vitest";
import { addToCart, removeFromCart, changeVariant, setQuantity, cartPeptideVials, cartPeptideTypes, cartCount, cartSubtotalCents } from "@/lib/cart-store";
const a = { variantId: "v1", slug: "bpc-157", name: "BPC-157", unitPriceCents: 5900, quantity: 1 };
describe("cart store", () => {
  it("adds and merges quantities by variant", () => {
    let items = addToCart([], a);
    items = addToCart(items, a);
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(2);
    expect(cartCount(items)).toBe(2);
    expect(cartSubtotalCents(items)).toBe(11800);
  });
  it("removes by variant", () => {
    const items = removeFromCart(addToCart([], a), "v1");
    expect(items).toHaveLength(0);
  });
  it("changes a line to a different MG variant (updates id + unit price, keeps qty)", () => {
    const line = {
      variantId: "v1", slug: "bpc-157", name: "BPC-157", unitPriceCents: 4500, quantity: 3,
      variants: [{ id: "v1", label: "5mg vial", priceCents: 4500 }, { id: "v2", label: "10mg vial", priceCents: 6100 }],
    };
    const next = changeVariant([line], "v1", "v2");
    expect(next[0].variantId).toBe("v2");
    expect(next[0].unitPriceCents).toBe(6100);
    expect(next[0].quantity).toBe(3);
  });
  it("sets a line quantity (clamped to >= 1)", () => {
    expect(setQuantity([a], "v1", 5)[0].quantity).toBe(5);
    expect(setQuantity([a], "v1", 0)[0].quantity).toBe(1);
    expect(setQuantity([a], "v1", -3)[0].quantity).toBe(1);
  });
  it("counts peptide vials + distinct types, excluding supplies and stacks", () => {
    const items = [
      { variantId: "p1", slug: "bpc-157", name: "BPC-157", unitPriceCents: 4500, quantity: 60 },
      { variantId: "p2", slug: "tb-500", name: "TB-500", unitPriceCents: 3800, quantity: 40 },
      { variantId: "bac", slug: "bac-water", name: "BAC Water", unitPriceCents: 1400, quantity: 10 }, // supply
      { variantId: "stack:wolverine", slug: "wolverine", name: "Wolverine", unitPriceCents: 6700, quantity: 5 }, // stack
    ];
    expect(cartPeptideVials(items)).toBe(100); // 60 + 40 (supply + stack excluded)
    expect(cartPeptideTypes(items)).toBe(2); // bpc-157, tb-500
  });
});
