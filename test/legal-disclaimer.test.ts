import { readFileSync } from "node:fs";
import { describe, it, expect } from "vitest";

describe("medical disclaimer page", () => {
  it("frames products as research-use only, not prescription", () => {
    const src = readFileSync("app/legal/medical-disclaimer/page.tsx", "utf8").toLowerCase();
    expect(src).toContain("research use only");
    expect(src).toContain("consumption");
    expect(src).not.toContain("prescription");
    expect(src).not.toContain("licensed healthcare");
    expect(src).not.toContain("consultation");
  });
});
