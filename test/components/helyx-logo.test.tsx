// @vitest-environment jsdom
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { HelyxLogo } from "@/components/brand/helyx-logo";
describe("HelyxLogo", () => {
  it("renders the accessible animated double-helix mark", () => {
    const { container } = render(<HelyxLogo />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("aria-label")).toMatch(/helyx/i);
    // Two helix strands + base-pair rungs make up the DNA mark.
    expect(container.querySelectorAll(".helyx-strand").length).toBe(2);
    expect(container.querySelectorAll(".helyx-rung").length).toBe(4);
  });
  it("is mark-only (callers supply the wordmark)", () => {
    const { container } = render(<HelyxLogo />);
    expect(container.textContent).not.toMatch(/peptides/i);
  });
});
