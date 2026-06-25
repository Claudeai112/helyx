// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ProductCard } from "@/components/commerce/product-card";

describe("ProductCard", () => {
  it("links to the product page and shows price", () => {
    render(<ProductCard product={{
      slug: "bpc-157", name: "BPC-157", subtitle: "Body-protection compound",
      status: "ACTIVE", minPriceCents: 5900,
    }} />);
    const link = screen.getByRole("link", { name: /bpc-157/i });
    expect(link.getAttribute("href")).toBe("/product/bpc-157");
    expect(screen.getByText("$59.00")).toBeTruthy();
  });
});
