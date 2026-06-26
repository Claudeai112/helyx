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

  it("lists the three discount tiers", () => {
    render(<BulkPage />);
    const text = document.body.textContent ?? "";
    expect(text).toContain("20%");
    expect(text).toContain("25%");
    expect(text).toContain("40%");
    expect(text).toContain("100+"); // vials threshold
    expect(text).toContain("15+"); // top peptide-type threshold
  });

  it("states shipping is paid by the customer", () => {
    render(<BulkPage />);
    expect(document.body.textContent ?? "").toContain("Shipping is paid by the customer");
  });
});
