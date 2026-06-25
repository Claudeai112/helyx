// @vitest-environment jsdom
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { HelyxLogo } from "@/components/brand/helyx-logo";
describe("HelyxLogo", () => {
  it("renders a static accessible logo with no motion", () => {
    const { container } = render(<HelyxLogo />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("aria-label")).toMatch(/helyx/i);
    expect(container.innerHTML).not.toMatch(/animate|motion/i);
  });
});
