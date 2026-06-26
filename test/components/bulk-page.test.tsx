// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import BulkPage from "@/app/bulk/page";
import { bulkDiscountedTotalCents, BULK_MIN_VIALS, BULK_MIN_TYPES } from "@/lib/pricing";
import { formatCents } from "@/lib/money";

describe("BulkPage", () => {
  it("shows the verbatim bulk notice", () => {
    render(<BulkPage />);
    expect(
      screen.getByText(
        "Bulk/wholesale orders may require additional processing time. Estimated delivery window: 2–3 weeks.",
      ),
    ).toBeTruthy();
  });

  it("states the 100-vial / 5-type qualification and 15% off", () => {
    render(<BulkPage />);
    const text = document.body.textContent ?? "";
    expect(text).toContain("15%");
    expect(text).toContain(String(BULK_MIN_VIALS)); // 100 vials
    expect(text).toContain(String(BULK_MIN_TYPES)); // 5 types
  });

  it("renders an example discounted total for a qualifying order ($5,000 -> $4,250)", () => {
    render(<BulkPage />);
    const discounted = formatCents(bulkDiscountedTotalCents(500000, BULK_MIN_VIALS, BULK_MIN_TYPES));
    expect(discounted).toBe("$4,250.00");
    expect(screen.getAllByText(discounted).length).toBeGreaterThan(0);
  });
});
