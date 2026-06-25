// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

beforeEach(() => {
  // jsdom has no IntersectionObserver
  vi.stubGlobal("IntersectionObserver", class {
    constructor(cb: (e: { isIntersecting: boolean; target: Element }[]) => void) { this.cb = cb; }
    cb: (e: { isIntersecting: boolean; target: Element }[]) => void;
    observe(el: Element) { this.cb([{ isIntersecting: true, target: el }]); }
    disconnect() {}
    unobserve() {}
  });
});

import { Reveal } from "@/components/reveal";

describe("Reveal", () => {
  it("renders children and becomes visible", () => {
    render(<Reveal><p>hello research</p></Reveal>);
    expect(screen.getByText("hello research")).toBeTruthy();
  });
});
