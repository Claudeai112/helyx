// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CartProvider } from "@/components/cart/cart-provider";
import { EducationSection } from "@/components/sections/home/education";

beforeEach(() => {
  // jsdom has no IntersectionObserver — stub it so Reveal mounts cleanly.
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(cb: (e: { isIntersecting: boolean; target: Element }[]) => void) {
        this.cb = cb;
      }
      cb: (e: { isIntersecting: boolean; target: Element }[]) => void;
      observe(el: Element) {
        this.cb([{ isIntersecting: true, target: el }]);
      }
      disconnect() {}
      unobserve() {}
    },
  );
});

describe("home sections", () => {
  it("education section is research-framed and claim-free", () => {
    render(<CartProvider><EducationSection /></CartProvider>);
    const text = document.body.textContent?.toLowerCase() ?? "";
    expect(text).toMatch(/research/);
    for (const banned of ["weight loss results", "cure ", "inject yourself", "bacteriostatic"]) {
      expect(text).not.toContain(banned);
    }
  });
});
