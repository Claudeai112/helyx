import { describe, it, expect } from "vitest";
import { addToCart, removeFromCart, cartCount, cartSubtotalCents } from "@/lib/cart-store";
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
});
