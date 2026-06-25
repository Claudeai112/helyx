// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Footer } from "@/components/footer";
describe("Footer", () => {
  it("shows legal links and the research-use disclaimer", () => {
    render(<Footer />);
    expect(screen.getByText(/terms/i)).toBeTruthy();
    expect(screen.getByText(/privacy/i)).toBeTruthy();
    expect(screen.getByText(/for research use only/i)).toBeTruthy();
  });
});
