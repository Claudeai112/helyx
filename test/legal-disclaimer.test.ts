import { readFileSync } from "node:fs";
import { describe, it, expect } from "vitest";

describe("medical disclaimer page", () => {
  it("frames products as prescription, not research-only", () => {
    const src = readFileSync("app/legal/medical-disclaimer/page.tsx", "utf8").toLowerCase();
    expect(src).toContain("licensed");
    expect(src).not.toContain("not for human consumption");
  });
});
