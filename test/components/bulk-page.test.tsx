// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import BulkPage from "@/app/bulk/page";
import { bulkLotPriceCents } from "@/lib/pricing";
import { formatCents } from "@/lib/money";

const SAMPLE_VIAL_CENTS = 5000; // $50.00 vial

describe("BulkPage", () => {
  it("shows the verbatim bulk notice", () => {
    render(<BulkPage />);
    expect(
      screen.getByText(
        "Bulk/wholesale orders may require additional processing time. Estimated delivery window: 2–3 weeks.",
      ),
    ).toBeTruthy();
  });

  it("renders a sample 100-vial lot total without discount language", () => {
    render(<BulkPage />);
    // bulkLotPriceCents(5000) = 425000 → "$4,250.00"
    const expectedTotal = formatCents(bulkLotPriceCents(SAMPLE_VIAL_CENTS));
    expect(expectedTotal).toBe("$4,250.00");
    expect(screen.getByText(expectedTotal)).toBeTruthy();
  });

  it("does not render savings or discount language", () => {
    render(<BulkPage />);
    const text = document.body.textContent?.toLowerCase() ?? "";
    expect(text).not.toContain("save");
    expect(text).not.toContain("% off");
    expect(text).not.toContain("you save");
    expect(text).not.toContain("discount");
  });
});
