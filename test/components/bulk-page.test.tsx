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

  it("lists the vial-count discount tiers", () => {
    render(<BulkPage />);
    const text = document.body.textContent ?? "";
    expect(text).toContain("15%");
    expect(text).toContain("20%");
    expect(text).toContain("30%");
    expect(text).toContain("40%");
    expect(text).toContain("25+"); // entry tier starts at 25 vials
    expect(text).toContain("200+"); // top tier at 200 vials
  });

  it("states shipping is paid by the customer", () => {
    render(<BulkPage />);
    expect(document.body.textContent ?? "").toContain("Shipping is paid by the customer");
  });
});
