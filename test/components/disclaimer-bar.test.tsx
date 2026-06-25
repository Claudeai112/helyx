// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { DisclaimerBar } from "@/components/ui/disclaimer-bar";

describe("DisclaimerBar", () => {
  it("renders the RUO compliance disclaimer", () => {
    render(<DisclaimerBar />);
    expect(
      screen.getByText(/for research use only/i),
    ).toBeTruthy();
  });
  it("contains 'not for human consumption'", () => {
    const { container } = render(<DisclaimerBar />);
    expect(container.textContent?.toLowerCase()).toContain("not for human consumption");
  });
  it("does not contain the old prescription consultation sentence", () => {
    const { container } = render(<DisclaimerBar />);
    expect(container.textContent?.toLowerCase()).not.toContain("prescription products require an online consultation");
  });
});
