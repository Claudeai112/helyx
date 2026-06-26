import { readFileSync } from "node:fs";
import { describe, it, expect } from "vitest";

describe("route consolidation", () => {
  it("homepage renders the unified Storefront (not the category tabs)", () => {
    const page = readFileSync("app/page.tsx", "utf8");
    expect(page).toMatch(/from "@\/components\/storefront\/storefront"/);
    expect(page).not.toMatch(/CatalogBrowser/);
    expect(page).toMatch(/<Suspense/); // useSearchParams boundary
  });
  it("/stacks is its own listing page (bundles live on a separate page)", () => {
    const stacks = readFileSync("app/stacks/page.tsx", "utf8");
    expect(stacks).toMatch(/getAllStacks/);
    expect(stacks).toMatch(/StackCard/);
    expect(stacks).not.toMatch(/redirect\(/);
  });
  it("/shop redirects into the unified storefront", () => {
    expect(readFileSync("app/shop/page.tsx", "utf8")).toMatch(/redirect\(/);
  });
  it("category route aliases old slugs and redirects (fixes Healing 404)", () => {
    const cat = readFileSync("app/category/[slug]/page.tsx", "utf8");
    expect(cat).toMatch(/healing.*healing-recovery/);
    expect(cat).toMatch(/redirect\(/);
    expect(cat).not.toMatch(/notFound\(\)/);
  });
  it("navbar links resolve into the storefront, no dead /category/healing", () => {
    const nav = readFileSync("components/navbar.tsx", "utf8");
    expect(nav).toMatch(/\/\?purpose=healing-recovery/);
    expect(nav).not.toMatch(/\/category\/healing/);
  });
});
