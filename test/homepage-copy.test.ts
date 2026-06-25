import { readFileSync } from "node:fs";
import { describe, it, expect } from "vitest";

const FORBIDDEN = ["research purposes only", "research use only", "not for human consumption"];

describe("homepage source compliance", () => {
  it("contains no forbidden non-compliant copy", () => {
    const src = readFileSync("app/page.tsx", "utf8").toLowerCase();
    for (const phrase of FORBIDDEN) expect(src).not.toContain(phrase);
  });
});
