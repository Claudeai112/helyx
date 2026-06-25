// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { DisclaimerBar } from "@/components/ui/disclaimer-bar";

describe("DisclaimerBar", () => {
  it("renders the exact compliance disclaimer", () => {
    render(<DisclaimerBar />);
    expect(
      screen.getByText(/Prescription products require an online consultation/i),
    ).toBeTruthy();
  });
  it("never uses forbidden research-only language", () => {
    const { container } = render(<DisclaimerBar />);
    expect(container.textContent?.toLowerCase()).not.toContain("not for human consumption");
  });
});
