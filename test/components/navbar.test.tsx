// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CartProvider } from "@/components/cart/cart-provider";
import { Navbar } from "@/components/navbar";
describe("Navbar", () => {
  it("renders brand + research-supply nav, no consultation links", () => {
    render(<CartProvider><Navbar /></CartProvider>);
    expect(screen.getByText(/helyx/i)).toBeTruthy();
    for (const label of [/shop/i, /glp.?1/i, /healing/i, /fat loss/i, /stacks/i, /bulk/i, /ambassador/i, /faq/i]) {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    }
    expect(screen.queryByText(/consultation/i)).toBeNull();
  });
});
