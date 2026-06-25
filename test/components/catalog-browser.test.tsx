// @vitest-environment jsdom
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CartProvider } from "@/components/cart/cart-provider";
import { CatalogBrowser } from "@/components/sections/home/catalog-browser";

const mk = (slug: string) => ({ slug, name: slug, subtitle: "", status: "ACTIVE" as const, imageUrl: null, minPriceCents: 100, minCompareAtCents: null, minVariantId: "a", variants: [{ id: "a", label: "5mg", mg: 5, priceCents: 100 }] });

it("tabs switch the visible category grid", () => {
  render(<CartProvider><CatalogBrowser
    categories={[{ slug: "glp-1", name: "GLP-1" }, { slug: "longevity", name: "Longevity" }]}
    productsByCategory={{ "glp-1": [mk("tirzepatide")], longevity: [mk("nad")] }}
  /></CartProvider>);
  expect(screen.getByRole("tab", { name: /glp-1/i })).toBeTruthy();
  fireEvent.click(screen.getByRole("tab", { name: /longevity/i }));
  expect(screen.getByText("nad")).toBeTruthy();
});

describe("CatalogBrowser grid", () => {
  it("grid container has xl:grid-cols-5 class", () => {
    const { container } = render(<CartProvider><CatalogBrowser
      categories={[{ slug: "glp-1", name: "GLP-1" }]}
      productsByCategory={{ "glp-1": [mk("tirzepatide")] }}
    /></CartProvider>);
    const grid = container.querySelector(".xl\\:grid-cols-5");
    expect(grid).toBeTruthy();
  });
});
