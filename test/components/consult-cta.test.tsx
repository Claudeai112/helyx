// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ConsultCTA } from "@/components/commerce/consult-cta";

describe("ConsultCTA", () => {
  it("prompts a consultation for active products", () => {
    render(<ConsultCTA productName="Tirzepatide" status="ACTIVE" />);
    expect(screen.getByRole("link", { name: /start consultation/i })).toBeTruthy();
  });
  it("shows waitlist for non-active products", () => {
    render(<ConsultCTA productName="Retatrutide" status="WAITLIST" />);
    expect(screen.getByText(/join waitlist/i)).toBeTruthy();
  });
  it("NEVER offers a direct add-to-cart purchase", () => {
    const { container } = render(<ConsultCTA productName="X" status="ACTIVE" />);
    expect(container.textContent?.toLowerCase()).not.toContain("add to cart");
    expect(container.textContent?.toLowerCase()).not.toContain("buy now");
  });
});
