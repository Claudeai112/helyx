// @vitest-environment jsdom
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ProductCardData } from "@/components/commerce/product-card";

const { getUpsellItems, add, cartItems } = vi.hoisted(() => ({
  getUpsellItems: vi.fn(),
  add: vi.fn(),
  cartItems: { current: [] as { slug: string }[] },
}));

vi.mock("@/app/actions/upsell", () => ({ getUpsellItems }));
vi.mock("@/components/cart/cart-provider", () => ({
  useCart: () => ({ items: cartItems.current, add }),
}));

import { CartUpsell } from "@/components/commerce/cart-upsell";

const syringes: ProductCardData = {
  slug: "insulin-syringes",
  name: "Insulin Syringes",
  subtitle: "Single-use graduated lab syringes",
  status: "ACTIVE",
  minPriceCents: 1200,
  minVariantId: "v-syr-30",
  variants: [
    { id: "v-syr-30", label: "0.5 mL · pack of 30", mg: 30, priceCents: 1200 },
    { id: "v-syr-100", label: "0.5 mL · pack of 100", mg: 100, priceCents: 2900 },
  ],
};

describe("CartUpsell", () => {
  beforeEach(() => {
    add.mockReset();
    cartItems.current = [];
    getUpsellItems.mockResolvedValue([syringes]);
  });

  it("renders recommended supplies and adds them to the cart", async () => {
    render(<CartUpsell />);
    expect(await screen.findByText("Insulin Syringes")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /add/i }));
    expect(add).toHaveBeenCalledWith(
      expect.objectContaining({ slug: "insulin-syringes", variantId: "v-syr-30", unitPriceCents: 1200 }),
    );
  });

  it("hides items already in the cart", async () => {
    cartItems.current = [{ slug: "insulin-syringes" }];
    render(<CartUpsell />);
    // Give the effect a tick; nothing should render since the only rec is in-cart.
    await waitFor(() => expect(getUpsellItems).toHaveBeenCalled());
    expect(screen.queryByText("Insulin Syringes")).toBeNull();
  });
});
