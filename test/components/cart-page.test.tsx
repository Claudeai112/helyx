// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

// vi.mock is hoisted above imports, so the mutable cart state must be created
// via vi.hoisted. Each test sets `cartState.current` before rendering; the
// mocked useCart reads it. This lets the empty-state tests and the populated
// test coexist in one file without the real localStorage-backed provider.
type MockCart = {
  items: { variantId: string; slug: string; name: string; unitPriceCents: number; quantity: number }[];
  remove: ReturnType<typeof vi.fn>;
  add: ReturnType<typeof vi.fn>;
  subtotalCents: number;
  count: number;
};
const { cartState } = vi.hoisted(() => ({
  cartState: { current: null as unknown as MockCart },
}));

vi.mock("@/components/cart/cart-provider", () => ({
  CartProvider: ({ children }: { children: React.ReactNode }) => children,
  useCart: () => cartState.current,
}));

import { CartProvider } from "@/components/cart/cart-provider";
import CartPage from "@/app/cart/page";

function emptyCart(): MockCart {
  return { items: [], remove: vi.fn(), add: vi.fn(), subtotalCents: 0, count: 0 };
}

describe("CartPage (neutral research-supply cart)", () => {
  beforeEach(() => {
    cartState.current = emptyCart();
  });

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

  it("shows item name, price, and Remove button for a populated cart", () => {
    cartState.current = {
      items: [
        { variantId: "v1", slug: "bpc-157", name: "BPC-157", unitPriceCents: 5900, quantity: 2 },
      ],
      remove: vi.fn(),
      add: vi.fn(),
      subtotalCents: 11800,
      count: 2,
    };
    render(
      <CartProvider>
        <CartPage />
      </CartProvider>,
    );
    // item name
    expect(screen.getByText("BPC-157")).toBeTruthy();
    // line price text (Qty: 2 × $59.00)
    expect(screen.getByText(/qty:\s*2/i)).toBeTruthy();
    // line total + subtotal both render formatCents(11800) → "$118.00"
    expect(screen.getAllByText("$118.00").length).toBeGreaterThan(0);
    // Remove button
    expect(screen.getByRole("button", { name: /remove bpc-157/i })).toBeTruthy();
  });
});
