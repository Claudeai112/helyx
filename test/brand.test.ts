import { readFileSync } from "node:fs";
import { describe, it, expect } from "vitest";

describe("brand", () => {
  it("layout metadata names Pure Peps, not Nova", () => {
    const layout = readFileSync("app/layout.tsx", "utf8");
    expect(layout).toContain("Pure Peps");
    expect(layout).not.toContain("Nova Marketing");
  });
});
