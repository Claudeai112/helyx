import { readFileSync } from "node:fs";
import { describe, it, expect } from "vitest";

describe("brand", () => {
  it("layout metadata names Helyx, not Nova", () => {
    const layout = readFileSync("app/layout.tsx", "utf8");
    expect(layout).toContain("Helyx");
    expect(layout).not.toContain("Nova Marketing");
  });

  it("uses research-supply metadata and removes the animation infra", () => {
    const layout = readFileSync("app/layout.tsx", "utf8");
    expect(layout).toContain("Helyx Peptides");
    expect(layout).toMatch(/research suppl/i);
    expect(layout).not.toMatch(/GlobalWebglBackground|AmbientBackground|LenisProvider|CustomCursor|PageTransition|ScrollTimeline/);
  });
});
