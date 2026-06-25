import { readFileSync } from "node:fs";
import { describe, it, expect } from "vitest";

const stackPage = readFileSync(
  new URL("../../app/stacks/[slug]/page.tsx", import.meta.url),
  "utf-8"
);

const productPage = readFileSync(
  new URL("../../app/product/[slug]/page.tsx", import.meta.url),
  "utf-8"
);

describe("stack detail page — no discount copy", () => {
  it("does not use compareAtCents", () => {
    expect(stackPage).not.toContain("compareAtCents");
  });

  it('does not contain the word "save"', () => {
    expect(stackPage.toLowerCase()).not.toContain("save");
  });

  it('does not contain the word "cycle"', () => {
    expect(stackPage.toLowerCase()).not.toContain("cycle");
  });

  it('does not contain the word "calculator"', () => {
    expect(stackPage.toLowerCase()).not.toContain("calculator");
  });
});

describe("product page — required imports", () => {
  it("imports ReconstitutionReference", () => {
    expect(productPage).toContain("ReconstitutionReference");
  });

  it("imports ProviderPathway", () => {
    expect(productPage).toContain("ProviderPathway");
  });
});
