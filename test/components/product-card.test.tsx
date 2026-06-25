// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CartProvider } from "@/components/cart/cart-provider";
import { ProductCard } from "@/components/commerce/product-card";
describe("ProductCard", () => {
  it("links to the product, shows price, and an Add to cart action (no consultation)", () => {
    render(<CartProvider><ProductCard product={{
      slug: "bpc-157", name: "BPC-157", subtitle: "Research peptide",
      status: "ACTIVE", minPriceCents: 5900, minVariantId: "v1",
    }} /></CartProvider>);
    expect(screen.getByRole("link", { name: /bpc-157/i }).getAttribute("href")).toBe("/product/bpc-157");
    expect(screen.getByText("$59.00")).toBeTruthy();
    expect(screen.getByRole("button", { name: /add to cart/i })).toBeTruthy();
    expect(screen.queryByText(/consultation/i)).toBeNull();
  });
});
