import { describe, it, expect } from "vitest";
import { cartSubtotalCents, cartItemCount, canCheckout } from "@/lib/cart";

const lines = [
  { variantId: "a", quantity: 2, unitPriceCents: 12900 },
  { variantId: "b", quantity: 1, unitPriceCents: 9900 },
];

describe("cart math", () => {
  it("sums subtotal in cents", () => {
    expect(cartSubtotalCents(lines)).toBe(35700);
    expect(cartSubtotalCents([])).toBe(0);
  });
  it("counts items", () => {
    expect(cartItemCount(lines)).toBe(3);
  });
  it("BLOCKS checkout without a redeemed code", () => {
    expect(canCheckout({ redeemedCodeId: null })).toBe(false);
    expect(canCheckout({ redeemedCodeId: "c1" })).toBe(true);
  });
});
