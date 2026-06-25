// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PriceDisplay } from "@/components/ui/price-display";

describe("PriceDisplay", () => {
  it("shows the price", () => {
    render(<PriceDisplay priceCents={12900} />);
    expect(screen.getByText("$129.00")).toBeTruthy();
  });
  it("shows percent off when compareAt is higher", () => {
    render(<PriceDisplay priceCents={12000} compareAtCents={15000} />);
    expect(screen.getByText("$120.00")).toBeTruthy();
    expect(screen.getByText(/20% off/i)).toBeTruthy();
  });
});
