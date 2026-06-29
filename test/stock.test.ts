import { describe, it, expect } from "vitest";
import { isInStock, IN_STOCK_SLUGS } from "@/lib/stock";

describe("stock status", () => {
  it("marks the listed peptides as in stock", () => {
    for (const slug of ["semaglutide", "tirzepatide", "bpc-157", "pt-141", "cjc-1295-no-dac"]) {
      expect(isInStock(slug)).toBe(true);
    }
  });

  it("treats unlisted peptides as made to order", () => {
    expect(isInStock("nad-plus")).toBe(false);
    expect(isInStock("epitalon")).toBe(false);
  });

  it("treats research supplies as in stock", () => {
    expect(isInStock("sterile-water", "supplies")).toBe(true);
    expect(isInStock("insulin-syringes", "supplies")).toBe(true);
  });

  it("lists exactly the eleven requested peptide slugs", () => {
    expect(IN_STOCK_SLUGS.size).toBe(11);
  });
});
