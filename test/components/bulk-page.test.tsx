// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import BulkPage from "@/app/bulk/page";
import { bulkDiscountedTotalCents } from "@/lib/pricing";
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

  it("states the 25% off total order over the $1000 minimum", () => {
    render(<BulkPage />);
    const text = document.body.textContent ?? "";
    expect(text).toContain("25%");
    expect(text).toContain("$1,000.00");
  });

  it("renders an example discounted total ($1,000 -> $750)", () => {
    render(<BulkPage />);
    const discounted = formatCents(bulkDiscountedTotalCents(100000));
    expect(discounted).toBe("$750.00");
    expect(screen.getByText(discounted)).toBeTruthy();
  });
});
