# Catalog + Compact Storefront Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the catalog (~45 products + 6 stacks, MG-selectable) and reformat the storefront into a compact, category-segmented, single-price shopping experience — without changing the existing light clinical design.

**Architecture:** Reuse the existing Prisma `Category/Product/ProductVariant/Stack` models and `lib/catalog` queries. Add pure-function libs for bulk pricing and reconstitution math. Extend `ProductCardData` to carry all MG variants so a compact card can switch price live. Replace the flat homepage grid with a category-tabbed browser. All copy stays research-framed; no dosing/cycle calculator.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, TailwindCSS v4, Prisma 7 + Postgres (Neon), Vitest, Base UI (`@base-ui/react`).

## Global Constraints

- **DO NOT redesign.** Keep the existing light clinical design system verbatim: tokens in `app/globals.css` (`--background #FFFFFF`, `--foreground #1A2230`, `--primary #1E5CA8`, `--border #E6E9EE`), Inter + IBM Plex Sans, the restored animated double-helix logo. **Change layout/structure only.** No new colors, no dark theme, no restyled primitives.
- **No visible discounts anywhere:** exactly one price per selected MG. Never render compare-at, strikethrough, "you save," %-off, subscription-discount, or bundle/bulk "savings" UI. Bundles and bulk show plain prices only.
- **Compliance (research-supply):** research-framed copy; no medical/therapeutic claims, no promised outcomes, no "expected effects/results," no self-administration/dosing content, no human cycle durations. RUO disclaimer present sitewide. **No dosage/cycle calculator** of any kind. The compliance guard `test/compliance-copy.test.ts` must stay green over all new copy.
- **Reconstitution reference is lab math only:** concentration (mg/mL), total mg per vial, vials required for a research quantity, cost per vial. **No** desired-dose, insulin units, injection frequency, schedule, or reorder date.
- **Category labels research-framed** (e.g. "Skin & Cosmetic Research", not "Beauty").
- **Compact grid: exactly 5 products per row at `xl`** (`xl:grid-cols-5`), stepping 4/3/2/1 down-breakpoint. Browse via sticky category tabs + accordion to minimize scroll.
- **Bulk:** `$1000` subtotal (`BULK_MIN_CENTS = 100000`) triggers wholesale handling; 100-vial price = `(single vial price × 100) − 15%`; bulk notice: *"Bulk/wholesale orders may require additional processing time. Estimated delivery window: 2–3 weeks."*
- **Pricing GATE:** retail prices are researched ~10% under market and **approved by the user before any reseed** (`prisma db seed`) runs. Building the seed file is fine; running it against Neon waits for approval.
- TDD, frequent commits, DRY, YAGNI. Catalog source of truth = spec §3 (`docs/superpowers/specs/2026-06-25-redesign-2-catalog-storefront.md`).

---

## File Structure

- `lib/pricing.ts` (new) — bulk math + constants.
- `lib/reconstitution.ts` (new) — concentration/vials math.
- `lib/retail-pricing.ts` (new) — `"<slug>:<mg>" → priceCents` map (approval gate).
- `lib/seed-data.ts` (rewrite) — full catalog: 10 categories, ~45 products + MG variants, 6 stacks.
- `lib/product-view.ts` (modify) — add `variants` to `ProductCardData`.
- `components/commerce/product-card.tsx` (modify) — MG dropdown + live single price + quick add + Learn More.
- `components/commerce/reconstitution-reference.tsx` (new) — lab reference (client).
- `components/commerce/provider-pathway.tsx` (new) — "work with a licensed provider" callout.
- `components/sections/home/catalog-browser.tsx` (new) — sticky category tabs + 5-per-row grids + accordion.
- `app/page.tsx` (modify) — use catalog browser; GLP-1 is one segment.
- `app/bulk/page.tsx` (rewrite) — bulk rules + 100-vial plain-price display + notice.
- `app/product/[slug]/page.tsx` (modify) — MG price, research copy, reference, pathway.
- `app/stacks/[slug]/page.tsx` (modify) — single bundle price; no cycle/calculator.
- Tests alongside in `test/`.

---

### Task 1: Bulk pricing math

**Files:**
- Create: `lib/pricing.ts`
- Test: `test/pricing.test.ts`

**Interfaces:**
- Produces: `BULK_VIAL_QTY = 100`, `BULK_DISCOUNT_BPS = 1500`, `BULK_MIN_CENTS = 100000`, `bulkLotPriceCents(vialPriceCents: number): number`, `bulkPerVialCents(vialPriceCents: number): number`, `qualifiesForBulk(subtotalCents: number): boolean`.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import { bulkLotPriceCents, bulkPerVialCents, qualifiesForBulk, BULK_MIN_CENTS } from "@/lib/pricing";

describe("bulk pricing", () => {
  it("100-vial lot = (vial x 100) - 15%", () => {
    expect(bulkLotPriceCents(5000)).toBe(425000); // 5000*100=500000, -15% = 425000
  });
  it("per-vial bulk price is the lot divided by 100, rounded", () => {
    expect(bulkPerVialCents(5000)).toBe(4250);
  });
  it("qualifies for bulk at or above $1000 subtotal", () => {
    expect(BULK_MIN_CENTS).toBe(100000);
    expect(qualifiesForBulk(99999)).toBe(false);
    expect(qualifiesForBulk(100000)).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails** — `npx vitest run test/pricing.test.ts` → FAIL (module not found).

- [ ] **Step 3: Write minimal implementation**

```ts
export const BULK_VIAL_QTY = 100;
export const BULK_DISCOUNT_BPS = 1500; // 15%
export const BULK_MIN_CENTS = 100000; // $1000

export function bulkLotPriceCents(vialPriceCents: number): number {
  return Math.round(vialPriceCents * BULK_VIAL_QTY * (1 - BULK_DISCOUNT_BPS / 10000));
}
export function bulkPerVialCents(vialPriceCents: number): number {
  return Math.round(bulkLotPriceCents(vialPriceCents) / BULK_VIAL_QTY);
}
export function qualifiesForBulk(subtotalCents: number): boolean {
  return subtotalCents >= BULK_MIN_CENTS;
}
```

- [ ] **Step 4: Run test to verify it passes** — `npx vitest run test/pricing.test.ts` → PASS.

- [ ] **Step 5: Commit** — `git add lib/pricing.ts test/pricing.test.ts && git commit -m "feat: bulk pricing math (100-vial lot, $1000 threshold)"`

---

### Task 2: Reconstitution reference math

**Files:**
- Create: `lib/reconstitution.ts`
- Test: `test/reconstitution.test.ts`

**Interfaces:**
- Produces: `concentrationMgPerMl(mgPerVial: number, solventMl: number): number` (0 if solventMl ≤ 0), `vialsRequired(totalMgNeeded: number, mgPerVial: number): number` (ceil; 0 if mgPerVial ≤ 0).

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import { concentrationMgPerMl, vialsRequired } from "@/lib/reconstitution";

describe("reconstitution reference", () => {
  it("concentration = mg per vial / solvent mL", () => {
    expect(concentrationMgPerMl(10, 2)).toBe(5);
  });
  it("guards divide-by-zero", () => {
    expect(concentrationMgPerMl(10, 0)).toBe(0);
    expect(vialsRequired(100, 0)).toBe(0);
  });
  it("vials required rounds up", () => {
    expect(vialsRequired(25, 10)).toBe(3);
  });
});
```

- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement**

```ts
export function concentrationMgPerMl(mgPerVial: number, solventMl: number): number {
  if (solventMl <= 0) return 0;
  return mgPerVial / solventMl;
}
export function vialsRequired(totalMgNeeded: number, mgPerVial: number): number {
  if (mgPerVial <= 0) return 0;
  return Math.ceil(totalMgNeeded / mgPerVial);
}
```

- [ ] **Step 4: Run** → PASS.
- [ ] **Step 5: Commit** — `git commit -m "feat: reconstitution/concentration reference math"`

---

### Task 3: Retail price list (APPROVAL GATE)

**Files:**
- Create: `lib/retail-pricing.ts`
- Test: `test/retail-pricing.test.ts`

**Interfaces:**
- Produces: `retailPriceCents(slug: string, mg: number): number` reading a `Record<string, number>` keyed `"<slug>:<mg>"`.

Source every product+MG from spec §3. Research representative current market retail for the anchor SKUs (Tirzepatide, Semaglutide, Retatrutide, BPC-157, TB-500, NAD+, GHK-Cu) and set retail ~10% below average market; apply a consistent retail model across the rest. **Do not derive from the internal cost sheet.** Controller presents the full computed list to the user for approval before any reseed.

- [ ] **Step 1: Write the failing test** — assert representative keys exist and are positive, e.g.

```ts
import { describe, it, expect } from "vitest";
import { retailPriceCents } from "@/lib/retail-pricing";
import { products } from "@/lib/seed-data";

describe("retail pricing", () => {
  it("has a positive price for every catalog variant", () => {
    for (const p of products) for (const v of p.variants) {
      expect(retailPriceCents(p.slug, v.mg)).toBeGreaterThan(0);
    }
  });
});
```

- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** the map for every variant in spec §3 (one line each, `"<slug>:<mg>": <cents>`), plus the lookup fn. (Depends on Task 4's `mg` field — implement Tasks 3 and 4 together if needed; the reviewer treats them as one gated data deliverable.)
- [ ] **Step 4: Run** → PASS.
- [ ] **Step 5: Commit** — `git commit -m "feat: retail price list (pending user approval)"`

---

### Task 4: Full catalog seed data

**Files:**
- Modify (rewrite): `lib/seed-data.ts`
- Test: `test/seed-data.test.ts`

**Interfaces:**
- `SeedVariant` gains `mg: number` (numeric strength; used by pricing + reconstitution) keeping `label`, `sku`, and reading `priceCents` from `retailPriceCents(slug, mg)`.
- Categories (10, research-framed, `order` 1..10): `glp-1`, `metabolic-fat-loss`, `healing-recovery`, `muscle-gh`, `longevity`, `cognitive`, `hormonal-reproductive`, `sleep-recovery`, `skin-cosmetic`, `supplies`.
- Products + MG variants + 6 stacks exactly per spec §3. Research-framed `researchOverview`, `reconstitution`, storage, `relatedSlugs`. No human results / dosing / cycle copy.

Shape (one product example — fill the rest from spec §3):

```ts
export type SeedVariant = { label: string; sku: string; mg: number; subscriptionEligible: boolean };
// priceCents resolved at seed time via retailPriceCents(product.slug, variant.mg)
{
  slug: "bpc-157", name: "BPC-157", subtitle: "Body-protection compound peptide",
  categorySlug: "healing-recovery",
  researchOverview: "BPC-157 is a synthetic pentadecapeptide studied in pre-clinical models for tissue-repair and angiogenesis pathways.",
  benefits: ["Studied for tissue-repair signaling", "Investigated in gut and tendon research models"],
  reconstitution: "For research use, reconstitute the lyophilised peptide in an appropriate sterile research solvent. Store refrigerated; minimise freeze-thaw cycles.",
  status: "ACTIVE",
  variants: [
    { label: "5mg vial", sku: "HX-BPC-5", mg: 5, subscriptionEligible: false },
    { label: "10mg vial", sku: "HX-BPC-10", mg: 10, subscriptionEligible: false },
  ],
  relatedSlugs: ["tb-500", "ghk-cu"],
}
```

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import { categories, products, stacks } from "@/lib/seed-data";

describe("catalog seed", () => {
  it("has the 10 research-framed categories", () => {
    expect(categories.map((c) => c.slug)).toEqual([
      "glp-1","metabolic-fat-loss","healing-recovery","muscle-gh","longevity",
      "cognitive","hormonal-reproductive","sleep-recovery","skin-cosmetic","supplies",
    ]);
  });
  it("every product has >=1 MG variant with a numeric mg and unique sku", () => {
    const skus = new Set<string>();
    for (const p of products) {
      expect(p.variants.length).toBeGreaterThan(0);
      for (const v of p.variants) { expect(typeof v.mg).toBe("number"); expect(skus.has(v.sku)).toBe(false); skus.add(v.sku); }
    }
  });
  it("has the 6 stacks", () => {
    expect(stacks.map((s) => s.slug).sort()).toEqual(
      ["glow","glp1-advanced","glp1-combo","klow","performance","wolverine"]
    );
  });
});
```

- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** the full catalog from spec §3 (every product + MG). Update `prisma/seed.ts` if it reads `priceCents` directly — resolve `priceCents: retailPriceCents(slug, v.mg)` when building variant rows. Keep `compareAtCents` unset (no discounts).
- [ ] **Step 4: Run** → PASS. Also `npx tsc --noEmit`.
- [ ] **Step 5: Commit** — `git commit -m "feat: full research catalog seed (45 products, 6 stacks, MG variants)"`

---

### Task 5: ProductCardData carries all variants

**Files:**
- Modify: `components/commerce/product-card.tsx:7-11` (type), `lib/product-view.ts`
- Test: `test/product-view.test.ts`

**Interfaces:**
- `ProductCardData` gains `variants: { id: string; label: string; mg: number; priceCents: number }[]` (sorted by `mg` asc). Keep `minPriceCents`/`minVariantId` for fallback.
- Produces: `toProductCardData` maps all variants.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import { toProductCardData } from "@/lib/product-view";

it("carries all variants sorted by mg", () => {
  const card = toProductCardData({
    slug: "x", name: "X", subtitle: "s", status: "ACTIVE", imageUrl: null,
    variants: [
      { id: "b", label: "10mg vial", mg: 10, priceCents: 200, compareAtCents: null },
      { id: "a", label: "5mg vial", mg: 5, priceCents: 100, compareAtCents: null },
    ],
  });
  expect(card.variants.map((v) => v.mg)).toEqual([5, 10]);
  expect(card.variants[0].id).toBe("a");
});
```

- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** — add `mg` to `VariantLike`, build `variants` sorted by `mg`, keep existing min fields.
- [ ] **Step 4: Run** → PASS + `npx tsc --noEmit`.
- [ ] **Step 5: Commit** — `git commit -m "feat: product card data carries all MG variants"`

---

### Task 6: Compact MG-dropdown product card

**Files:**
- Modify: `components/commerce/product-card.tsx`
- Test: `test/components/product-card.test.tsx`

**Interfaces:** Consumes `ProductCardData` (with `variants`). Renders: image, name, native `<select>` of MG labels, a single price that updates with selection (`formatCents`), **Add to cart** (adds selected variant), **Learn More** (→ `/product/<slug>`). No compare-at/savings. Reuse existing tokens/classes — no new styles.

- [ ] **Step 1: Write the failing test** (jsdom)

```tsx
// @vitest-environment jsdom
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CartProvider } from "@/components/cart/cart-provider";
import { ProductCard } from "@/components/commerce/product-card";

const data = {
  slug: "bpc-157", name: "BPC-157", subtitle: "s", status: "ACTIVE" as const, imageUrl: "/images/products/bpc-157.png",
  minPriceCents: 100, minCompareAtCents: null, minVariantId: "a",
  variants: [
    { id: "a", label: "5mg vial", mg: 5, priceCents: 100 },
    { id: "b", label: "10mg vial", mg: 10, priceCents: 200 },
  ],
};

it("updates price when MG changes and exposes quick add + learn more", () => {
  render(<CartProvider><ProductCard product={data} /></CartProvider>);
  expect(screen.getByText("$1.00")).toBeTruthy();
  fireEvent.change(screen.getByRole("combobox"), { target: { value: "b" } });
  expect(screen.getByText("$2.00")).toBeTruthy();
  expect(screen.getByRole("button", { name: /add to cart/i })).toBeTruthy();
  expect(screen.getByRole("link", { name: /learn more/i })).toBeTruthy();
});
it("renders no discount/savings text", () => {
  render(<CartProvider><ProductCard product={data} /></CartProvider>);
  expect(screen.queryByText(/save|% off|was /i)).toBeNull();
});
```

- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** — `"use client"`; `useState` selected variant id (default `variants[0]`); native `<select>` styled with existing border/token classes; price via `formatCents(selected.priceCents)`; Add to cart calls `useCart().add({ variantId, slug, name, unitPriceCents, quantity: 1 })`; Learn More `<Link href={`/product/${slug}`}>`.
- [ ] **Step 4: Run** → PASS.
- [ ] **Step 5: Commit** — `git commit -m "feat: compact product card with MG dropdown + live price"`

---

### Task 7: Category-tabbed storefront browser

**Files:**
- Create: `components/sections/home/catalog-browser.tsx`
- Modify: `app/page.tsx`
- Test: `test/components/catalog-browser.test.tsx`

**Interfaces:** Consumes `{ categories: {slug,name}[]; productsByCategory: Record<string, ProductCardData[]> }`. Renders sticky horizontal **category tabs**; selecting a tab shows that category's **5-per-row** grid (`grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`). Long categories may use `Accordion`. GLP-1 is one tab among equals.

- [ ] **Step 1: Write the failing test** (jsdom) — renders tabs from categories; clicking a tab shows its products; asserts grid container has `xl:grid-cols-5`.

```tsx
// @vitest-environment jsdom
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CartProvider } from "@/components/cart/cart-provider";
import { CatalogBrowser } from "@/components/sections/home/catalog-browser";

const mk = (slug: string) => ({ slug, name: slug, subtitle: "", status: "ACTIVE" as const, imageUrl: null, minPriceCents: 100, minCompareAtCents: null, minVariantId: "a", variants: [{ id: "a", label: "5mg", mg: 5, priceCents: 100 }] });

it("tabs switch the visible category grid", () => {
  render(<CartProvider><CatalogBrowser
    categories={[{ slug: "glp-1", name: "GLP-1" }, { slug: "longevity", name: "Longevity" }]}
    productsByCategory={{ "glp-1": [mk("tirzepatide")], longevity: [mk("nad")] }}
  /></CartProvider>);
  expect(screen.getByRole("tab", { name: /glp-1/i })).toBeTruthy();
  fireEvent.click(screen.getByRole("tab", { name: /longevity/i }));
  expect(screen.getByText("nad")).toBeTruthy();
});
```

- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** — `"use client"`; `useState` active category; tab buttons (`role="tab"`); render active category's grid with the 5-col classes; reuse `ProductCard`. Keep existing section spacing utilities.
- [ ] **Step 4: Update `app/page.tsx`** — group `cards` by `category.slug` into `productsByCategory`; pass to `CatalogBrowser`; keep `StacksSection`, `BulkSection` (Task 8), `EducationSection`, `SignupSection`, `DisclaimerBar`. Remove `FeaturedGlp1` repeated featuring (GLP-1 is just a tab). Adjust `getAllProducts` mapping to include `category` (already in `productInclude`).
- [ ] **Step 5: Run** tests + `npx tsc --noEmit` → PASS.
- [ ] **Step 6: Commit** — `git commit -m "feat: category-tabbed 5-per-row storefront browser"`

---

### Task 8: Bulk page (rules + plain-price display)

**Files:**
- Modify (rewrite): `app/bulk/page.tsx`
- Test: `test/components/bulk-page.test.tsx`

**Interfaces:** Consumes `lib/pricing`. Explains bulk ordering through normal checkout, the `$1000` minimum, the 100-vial lot price (plain `formatCents` total + per-vial — **no "savings"**), and shows the notice verbatim: *"Bulk/wholesale orders may require additional processing time. Estimated delivery window: 2–3 weeks."*

- [ ] **Step 1: Write the failing test** — asserts the notice string and that a sample 100-vial total renders (e.g. for a $50 vial → `$4,250.00`), and that no "save"/"% off" text appears.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** using `bulkLotPriceCents`/`bulkPerVialCents`/`BULK_MIN_CENTS`. Static research-framed copy; RUO `DisclaimerBar`.
- [ ] **Step 4: Run** → PASS.
- [ ] **Step 5: Commit** — `git commit -m "feat: bulk ordering page (wholesale rules + plain pricing)"`

---

### Task 9: Reconstitution reference + provider pathway

**Files:**
- Create: `components/commerce/reconstitution-reference.tsx`, `components/commerce/provider-pathway.tsx`
- Test: `test/components/reconstitution-reference.test.tsx`

**Interfaces:** `ReconstitutionReference` (client) — inputs: vial strength (mg, prefilled per product), solvent volume (mL), target research quantity (mg). Outputs via `lib/reconstitution`: concentration (mg/mL), vials required. **No** dose/units/frequency/reorder fields. `ProviderPathway` — static callout: "Considering human use? Work with a licensed provider for screening and titration." + RUO line.

- [ ] **Step 1: Write the failing test** (jsdom) — entering 10 mg + 2 mL shows `5 mg/mL`; provider pathway renders the "licensed provider" copy; assert the component has no input labelled dose/units/frequency/reorder.

```tsx
// @vitest-environment jsdom
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ReconstitutionReference } from "@/components/commerce/reconstitution-reference";

it("computes concentration, exposes no dosing inputs", () => {
  render(<ReconstitutionReference mgPerVial={10} />);
  fireEvent.change(screen.getByLabelText(/solvent/i), { target: { value: "2" } });
  expect(screen.getByText(/5\s*mg\/mL/i)).toBeTruthy();
  expect(screen.queryByLabelText(/dose|units|frequency|reorder|injection/i)).toBeNull();
});
```

- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** both components (client; `useState`; `lib/reconstitution`).
- [ ] **Step 4: Run** → PASS.
- [ ] **Step 5: Commit** — `git commit -m "feat: reconstitution reference + provider-pathway callout"`

---

### Task 10: Product & stack pages

**Files:**
- Modify: `app/product/[slug]/page.tsx`, `app/stacks/[slug]/page.tsx`
- Test: `test/components/product-page-copy.test.ts` (static scan) + headless check in Task 11.

**Interfaces:** Product page shows MG dropdown + live price (reuse `AddToCart` with all variants incl. price-per-variant; ensure the variant selector shows the selected price), research overview/reconstitution/storage/related stacks, `ReconstitutionReference` (prefilled `mgPerVial` from the cheapest/first variant), `ProviderPathway`, RUO. Stack page: contents, research-framed explanation, single bundle price (`formatCents` only), Add to cart — **no cycle duration, no calculator integration**.

- [ ] **Step 1: Write the failing test** — static scan asserting `app/stacks/[slug]/page.tsx` contains no `compareAt`/"save"/"cycle"/"calculator" and product page imports `ReconstitutionReference` + `ProviderPathway`.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** the page edits. Drop any compare-at/savings rendering. `AddToCart`/`VariantSelector` already show price per chip; keep single-price.
- [ ] **Step 4: Run** tests + `npx tsc --noEmit` + `npm run -s lint` → PASS.
- [ ] **Step 5: Commit** — `git commit -m "feat: research-framed product + stack pages (MG price, reference, pathway)"`

---

### Task 11: Compliance guard, build, headless verification + reseed gate

**Files:**
- Modify: `test/compliance-copy.test.ts` (extend forbidden stems if needed: `"per injection"`, `"insulin unit"`, `"reorder date"`, `"injections required"`).
- Test: full suite + headless.

- [ ] **Step 1** Run `npm test` — fix any compliance-guard hits in new copy (reframe, don't suppress).
- [ ] **Step 2** `npx tsc --noEmit` and `npm run -s lint` → clean.
- [ ] **Step 3** `npm run build` → green.
- [ ] **Step 4 (GATE)** Present the `lib/retail-pricing.ts` list to the user; on approval run `npx prisma db push` (no schema change expected) and `npx prisma db seed` against Neon to reseed the catalog.
- [ ] **Step 5** Headless (Playwright, temporary) load of `/` and one `/product/<slug>` against `npm start`: assert zero console errors, the 5-per-row grid renders, MG dropdown changes price, no discount text, RUO present. Remove Playwright after.
- [ ] **Step 6: Commit** — `git commit -m "test: compliance guard + headless verification for catalog storefront"`

---

## Self-Review

**Spec coverage:** §2 layout → Tasks 6,7; §3 catalog → Tasks 3,4; §4 MG variants → Tasks 5,6; §5 pricing/bulk/no-discount → Tasks 1,3,8 + global constraint; §6 product pages/reference → Tasks 9,10; §7 homepage → Task 7; §8 testing → all + Task 11; compliance/provider → Tasks 9,10,11. No gaps.

**Placeholder scan:** catalog data intentionally references spec §3 (authoritative, committed) rather than re-transcribing 45 products — this is DRY, not a placeholder; the implementer copies exact names/MGs from §3.

**Type consistency:** `mg: number` added to `SeedVariant` (Task 4), `ProductCardData.variants[].mg` (Task 5), consumed by `ProductCard` (Task 6) and `retailPriceCents(slug, mg)` (Task 3) — consistent. `bulk*`/`concentration*`/`vialsRequired` signatures stable across Tasks 1,2,8,9.
