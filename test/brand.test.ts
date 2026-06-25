import { readFileSync } from "node:fs";
import { describe, it, expect } from "vitest";

describe("brand", () => {
  it("layout metadata names Heman Peptide, not Nova", () => {
    const layout = readFileSync("app/layout.tsx", "utf8");
    expect(layout).toContain("Heman Peptide");
    expect(layout).not.toContain("Nova Marketing");
  });
});
