// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CartProvider } from "@/components/cart/cart-provider";
import CartPage from "@/app/cart/page";

describe("CartPage (neutral research-supply cart)", () => {
  it("shows empty-state message when cart is empty", () => {
    render(
      <CartProvider>
        <CartPage />
      </CartProvider>,
    );
    expect(screen.getByText(/your cart is empty/i)).toBeTruthy();
  });

  it("has a link to /shop in empty state", () => {
    render(
      <CartProvider>
        <CartPage />
      </CartProvider>,
    );
    const link = screen.getByRole("link", { name: /shop/i });
    expect(link.getAttribute("href")).toBe("/shop");
  });

  it("shows a disabled checkout button with coming-soon note", () => {
    render(
      <CartProvider>
        <CartPage />
      </CartProvider>,
    );
    const btn = screen.getByRole("button", { name: /proceed to checkout/i });
    expect(btn).toBeTruthy();
    expect((btn as HTMLButtonElement).disabled).toBe(true);
    expect(screen.getByText(/coming soon/i)).toBeTruthy();
  });

  it("contains NO access-code or consultation language", () => {
    const { container } = render(
      <CartProvider>
        <CartPage />
      </CartProvider>,
    );
    const text = container.textContent?.toLowerCase() ?? "";
    expect(text).not.toContain("access code");
    expect(text).not.toContain("consultation");
    expect(text).not.toContain("prescription");
    expect(text).not.toContain("approved");
    expect(text).not.toContain("redeem");
  });

  it("renders the RUO disclaimer bar", () => {
    render(
      <CartProvider>
        <CartPage />
      </CartProvider>,
    );
    expect(screen.getByText(/for research use only/i)).toBeTruthy();
  });
});
