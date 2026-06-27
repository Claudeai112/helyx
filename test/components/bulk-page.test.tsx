// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import BulkPage from "@/app/bulk/page";

describe("BulkPage", () => {
  it("shows the verbatim bulk notice", () => {
    render(<BulkPage />);
    expect(
      screen.getByText(
        "Bulk/wholesale orders may require additional processing time. Estimated delivery window: 2–3 weeks.",
      ),
    ).toBeTruthy();
  });

  it("does not show bulk discount tiers", () => {
    render(<BulkPage />);
    const text = document.body.textContent ?? "";
    expect(text).not.toContain("discount tier");
    expect(text).not.toContain("Discount off subtotal");
  });

  it("renders the bulk inquiry form", () => {
    render(<BulkPage />);
    expect(screen.getByText("Submit bulk inquiry")).toBeTruthy();
  });

  it("states shipping is paid by the customer", () => {
    render(<BulkPage />);
    expect(document.body.textContent ?? "").toContain("Shipping is paid by the customer");
  });
});
