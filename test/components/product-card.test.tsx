// @vitest-environment jsdom
import { render, screen, fireEvent } from "@testing-library/react";
import { it, expect } from "vitest";
import { CartProvider } from "@/components/cart/cart-provider";
import { ProductCard } from "@/components/commerce/product-card";

const data = {
  slug: "bpc-157", name: "BPC-157", subtitle: "s", status: "ACTIVE" as const, imageUrl: "/images/products/bpc-157.png",
  minPriceCents: 100, minCompareAtCents: null, minVariantId: "a",
  variants: [
    { id: "a", label: "5mg vial", mg: 5, priceCents: 100 },
    { id: "b", label: "10mg vial", mg: 10, priceCents: 200 },
  ],
};

it("updates price when MG changes and exposes quick add + learn more", () => {
  render(<CartProvider><ProductCard product={data} /></CartProvider>);
  expect(screen.getByText("$1.00")).toBeTruthy();
  fireEvent.change(screen.getByRole("combobox"), { target: { value: "b" } });
  expect(screen.getByText("$2.00")).toBeTruthy();
  expect(screen.getByRole("button", { name: /add to cart/i })).toBeTruthy();
  expect(screen.getByRole("link", { name: /learn more/i })).toBeTruthy();
});
it("renders no discount/savings text", () => {
  render(<CartProvider><ProductCard product={data} /></CartProvider>);
  expect(screen.queryByText(/save|% off|was /i)).toBeNull();
});
