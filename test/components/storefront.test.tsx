// @vitest-environment jsdom
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
vi.mock("next/navigation", () => ({ useSearchParams: () => new URLSearchParams("") }));
import { CartProvider } from "@/components/cart/cart-provider";
import { Storefront } from "@/components/storefront/storefront";
import type { StorefrontItem } from "@/lib/storefront-filter";

const mk = (slug: string, cat: string, hay: string): StorefrontItem => ({
  card: { slug, name: slug, subtitle: "", status: "ACTIVE", imageUrl: null, minPriceCents: 100, minCompareAtCents: null, minVariantId: "v", variants: [{ id: "v", label: "5mg", mg: 5, priceCents: 100 }] },
  categorySlug: cat, categoryName: cat, mgs: [5], minPriceCents: 100, haystack: hay, isPopular: false, isNew: false, popularityRank: 1,
});
const items = [mk("tirzepatide","glp-1","tirzepatide glp"), mk("bpc-157","healing-recovery","bpc healing recovery")];
const categories = [{ slug: "glp-1", name: "GLP-1" }, { slug: "healing-recovery", name: "Healing & Recovery" }];

it("renders grid and narrows by category + search", () => {
  render(<CartProvider><Storefront items={items} categories={categories} /></CartProvider>);
  expect(screen.getByText("tirzepatide")).toBeTruthy();
  expect(screen.getByText("bpc-157")).toBeTruthy();
  fireEvent.click(screen.getByRole("checkbox", { name: /healing & recovery/i }));
  expect(screen.queryByText("tirzepatide")).toBeNull();
  expect(screen.getByText("bpc-157")).toBeTruthy();
  fireEvent.change(screen.getByRole("searchbox"), { target: { value: "glp" } });
  expect(screen.queryByText("bpc-157")).toBeNull(); // category still healing, search glp → none
});
it("has a 5-per-row grid and a mobile filters toggle", () => {
  const { container } = render(<CartProvider><Storefront items={items} categories={categories} /></CartProvider>);
  expect(container.querySelector('[class*="xl:grid-cols-5"]')).toBeTruthy();
  expect(screen.getByRole("button", { name: /filters/i })).toBeTruthy();
});
