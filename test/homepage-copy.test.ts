import { readFileSync } from "node:fs";
import { describe, it, expect } from "vitest";

// Inverted research-supply guard: the homepage must NOT contain
// human-use / therapeutic / self-admin / injectable phrases.
const FORBIDDEN = [
  "for human use",
  "intended for human",
  "inject yourself",
  "how to inject",
  "your dose",
  "dose yourself",
  "weight loss results",
  "consult your doctor",
  "prescription required",
  "bacteriostatic",
  "therapeutic",
  "self-administer",
  "self-inject",
];

describe("homepage source compliance", () => {
  it("contains no forbidden human-use / therapeutic copy", () => {
    const src = readFileSync("app/page.tsx", "utf8").toLowerCase();
    for (const phrase of FORBIDDEN) expect(src).not.toContain(phrase);
  });

  it("imports the home section components", () => {
    const src = readFileSync("app/page.tsx", "utf8");
    expect(src).toContain("storefront/storefront");
    expect(src).toContain("sections/home/bulk");
    expect(src).toContain("sections/home/education");
    expect(src).toContain("sections/home/signup");
  });
});
