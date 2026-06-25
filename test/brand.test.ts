import { readFileSync } from "node:fs";
import { describe, it, expect } from "vitest";

describe("brand", () => {
  it("layout metadata names Helyx, not Nova", () => {
    const layout = readFileSync("app/layout.tsx", "utf8");
    expect(layout).toContain("Helyx");
    expect(layout).not.toContain("Nova Marketing");
  });
});
