# Unified Storefront + Filters Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Replace category tabs with one unified, filterable storefront (left sidebar + search + sort + mobile drawer), fix the broken category routes, and add a slow DNA rotation to the logo — with no aesthetic or product-card changes.

**Architecture:** A server page builds a serialisable `StorefrontItem[]` (card data + filter facets + search haystack + merchandising flags) and renders a client `Storefront` that filters/sorts/searches in real time via pure functions. Old routes redirect into the unified storefront. Logo gains a CSS `rotateY` loop.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind v4, Vitest.

## Global Constraints

- **Do NOT redesign** aesthetic/theme/backgrounds or **product-card styling**. Reuse existing tokens, `ProductCard`, `StackCard`, `SectionShell`, grid classes. Only nav/filter/organization/logo/route changes.
- 5-per-row grid at `xl`: `grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4`.
- No visible discounts; compliance guard (`test/compliance-copy.test.ts`) stays green.
- Category slugs (exact): `glp-1, metabolic-fat-loss, healing-recovery, muscle-gh, longevity, cognitive, hormonal-reproductive, sleep-recovery, skin-cosmetic, supplies`.
- `prefers-reduced-motion`: logo rotation disabled.
- TDD, frequent commits, DRY, YAGNI.

---

## File Structure
- `lib/merchandising.ts` (new) — popular/new/rank curation.
- `lib/storefront-filter.ts` (new) — filter/search/sort pure functions + types.
- `components/storefront/storefront.tsx` (new) — client storefront (sidebar + grid + search + sort + mobile drawer).
- `app/page.tsx` (modify) — build items, render `Storefront`; remove `CatalogBrowser`; keep `StacksSection` with `id="stacks"`.
- `components/sections/home/stacks.tsx` (modify) — ensure `id="stacks"` anchor.
- `components/navbar.tsx` (modify) — nav links → unified storefront filter deep-links.
- `app/shop/page.tsx`, `app/category/[slug]/page.tsx`, `app/stacks/page.tsx` (modify) — redirects.
- `components/brand/helyx-logo.tsx` + `app/globals.css` (modify) — rotation.

---

### Task 1: Merchandising curation

**Files:** Create `lib/merchandising.ts`; Test `test/merchandising.test.ts`

**Interfaces — Produces:** `isPopular(slug: string): boolean`, `isNew(slug: string): boolean`, `popularityRank(slug: string): number` (lower = more popular).

- [ ] **Step 1: Write failing test**
```ts
import { describe, it, expect } from "vitest";
import { isPopular, isNew, popularityRank } from "@/lib/merchandising";
describe("merchandising", () => {
  it("flags popular and new sets", () => {
    expect(isPopular("tirzepatide")).toBe(true);
    expect(isPopular("adipotide")).toBe(false);
    expect(isNew("retatrutide")).toBe(true);
    expect(isNew("bpc-157")).toBe(false);
  });
  it("ranks popular ahead of non-popular", () => {
    expect(popularityRank("tirzepatide")).toBeLessThan(popularityRank("adipotide"));
  });
});
```
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement**
```ts
const POPULAR_ORDER = [
  "tirzepatide", "retatrutide", "semaglutide", "cagrilintide",
  "bpc-157", "tb-500", "ghk-cu", "nad-plus", "ipamorelin", "mots-c",
];
const POPULAR = new Set(POPULAR_ORDER);
const NEW = new Set(["retatrutide", "cagrilintide", "5-amino-1mq", "ss-31", "foxo4"]);
export function isPopular(slug: string): boolean { return POPULAR.has(slug); }
export function isNew(slug: string): boolean { return NEW.has(slug); }
export function popularityRank(slug: string): number {
  const i = POPULAR_ORDER.indexOf(slug);
  return i === -1 ? 1000 : i; // popular first (0..9), the rest tie at 1000 (stable sort keeps catalog order)
}
```
- [ ] **Step 4: Run** → PASS.
- [ ] **Step 5: Commit** — `git commit -m "feat: merchandising curation (popular/new/rank)"`

---

### Task 2: Storefront filter/search/sort pure functions

**Files:** Create `lib/storefront-filter.ts`; Test `test/storefront-filter.test.ts`

**Interfaces:**
- Consumes: `StorefrontItem` (below).
- Produces: `type SortKey = "price-asc"|"price-desc"|"popularity"|"newest"|"best-selling"`; `type FilterState = { categories: string[]; priceMin: number|null; priceMax: number|null; mgs: number[]; popularOnly: boolean; newOnly: boolean; query: string; sort: SortKey }`; `EMPTY_FILTER: FilterState`; `applyFilters(items, state): StorefrontItem[]`; `applySort(items, sort): StorefrontItem[]`; `filterAndSort(items, state): StorefrontItem[]`.

```ts
export type StorefrontItem = {
  card: import("@/components/commerce/product-card").ProductCardData;
  categorySlug: string; categoryName: string;
  mgs: number[]; minPriceCents: number; haystack: string;
  isPopular: boolean; isNew: boolean; popularityRank: number;
};
```

- [ ] **Step 1: Write failing tests** (representative)
```ts
import { describe, it, expect } from "vitest";
import { filterAndSort, applyFilters, EMPTY_FILTER } from "@/lib/storefront-filter";

const mk = (o: Partial<any>) => ({
  card: { slug: o.slug, name: o.name ?? o.slug, subtitle: "", status: "ACTIVE", imageUrl: null, minPriceCents: o.price ?? 100, minCompareAtCents: null, minVariantId: "v", variants: [] },
  categorySlug: o.cat ?? "glp-1", categoryName: o.cat ?? "glp-1",
  mgs: o.mgs ?? [5], minPriceCents: o.price ?? 100, haystack: (o.hay ?? o.slug ?? "").toLowerCase(),
  isPopular: !!o.pop, isNew: !!o.isNew, popularityRank: o.rank ?? 1000,
});
const items = [
  mk({ slug: "a", cat: "glp-1", price: 200, mgs: [10], pop: true, rank: 0, hay: "tirzepatide glp metabolic" }),
  mk({ slug: "b", cat: "healing-recovery", price: 100, mgs: [5], isNew: true, rank: 1000, hay: "bpc healing recovery" }),
  mk({ slug: "c", cat: "longevity", price: 300, mgs: [50], rank: 1000, hay: "nad longevity" }),
];

it("filters by category (multi, OR)", () => {
  const r = applyFilters(items, { ...EMPTY_FILTER, categories: ["healing-recovery", "longevity"] });
  expect(r.map((i) => i.card.slug).sort()).toEqual(["b", "c"]);
});
it("filters by price range, mg, popular, new", () => {
  expect(applyFilters(items, { ...EMPTY_FILTER, priceMax: 150 }).map(i=>i.card.slug)).toEqual(["b"]);
  expect(applyFilters(items, { ...EMPTY_FILTER, mgs: [50] }).map(i=>i.card.slug)).toEqual(["c"]);
  expect(applyFilters(items, { ...EMPTY_FILTER, popularOnly: true }).map(i=>i.card.slug)).toEqual(["a"]);
  expect(applyFilters(items, { ...EMPTY_FILTER, newOnly: true }).map(i=>i.card.slug)).toEqual(["b"]);
});
it("search matches haystack (description keywords)", () => {
  expect(applyFilters(items, { ...EMPTY_FILTER, query: "healing" }).map(i=>i.card.slug)).toEqual(["b"]);
  expect(applyFilters(items, { ...EMPTY_FILTER, query: "glp" }).map(i=>i.card.slug)).toEqual(["a"]);
});
it("sorts by price and popularity", () => {
  expect(filterAndSort(items, { ...EMPTY_FILTER, sort: "price-asc" }).map(i=>i.card.slug)).toEqual(["b","a","c"]);
  expect(filterAndSort(items, { ...EMPTY_FILTER, sort: "popularity" }).map(i=>i.card.slug)[0]).toBe("a");
});
```
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement**
```ts
import type { StorefrontItem } from ...; // keep type in this file (above)
export type SortKey = "price-asc"|"price-desc"|"popularity"|"newest"|"best-selling";
export type FilterState = { categories: string[]; priceMin: number|null; priceMax: number|null; mgs: number[]; popularOnly: boolean; newOnly: boolean; query: string; sort: SortKey };
export const EMPTY_FILTER: FilterState = { categories: [], priceMin: null, priceMax: null, mgs: [], popularOnly: false, newOnly: false, query: "", sort: "popularity" };

export function applyFilters(items: StorefrontItem[], s: FilterState): StorefrontItem[] {
  const q = s.query.trim().toLowerCase();
  return items.filter((it) => {
    if (s.categories.length && !s.categories.includes(it.categorySlug)) return false;
    if (s.priceMin != null && it.minPriceCents < s.priceMin) return false;
    if (s.priceMax != null && it.minPriceCents > s.priceMax) return false;
    if (s.mgs.length && !it.mgs.some((m) => s.mgs.includes(m))) return false;
    if (s.popularOnly && !it.isPopular) return false;
    if (s.newOnly && !it.isNew) return false;
    if (q && !it.haystack.includes(q)) return false;
    return true;
  });
}
export function applySort(items: StorefrontItem[], sort: SortKey): StorefrontItem[] {
  const a = [...items];
  switch (sort) {
    case "price-asc": a.sort((x, y) => x.minPriceCents - y.minPriceCents); break;
    case "price-desc": a.sort((x, y) => y.minPriceCents - x.minPriceCents); break;
    case "newest": a.sort((x, y) => Number(y.isNew) - Number(x.isNew) || x.popularityRank - y.popularityRank); break;
    case "popularity":
    case "best-selling": a.sort((x, y) => x.popularityRank - y.popularityRank); break;
  }
  return a;
}
export function filterAndSort(items: StorefrontItem[], s: FilterState): StorefrontItem[] {
  return applySort(applyFilters(items, s), s.sort);
}
```
(Price-asc test expects b,a,c — note c at 300 is last; a at 200 mid; b at 100 first. `Array.sort` is stable so ties keep order; fine.)
- [ ] **Step 4: Run** → PASS. `npx tsc --noEmit`.
- [ ] **Step 5: Commit** — `git commit -m "feat: storefront filter/search/sort pure functions"`

---

### Task 3: Storefront client component

**Files:** Create `components/storefront/storefront.tsx`; Test `test/components/storefront.test.tsx`

**Interfaces — Consumes:** `{ items: StorefrontItem[]; categories: { slug: string; name: string }[] }`.

Behaviour: `"use client"`. State = `FilterState` (init `EMPTY_FILTER`, but read `?purpose=` via `useSearchParams` to pre-set `categories`). Two-column layout: a **left sidebar** (desktop `lg:block`, hidden below `lg`) with the filter groups (category checkboxes from `categories`; price min/max number inputs; mg checkboxes built from the distinct sorted mgs across `items`; Popular toggle; New toggle; Clear all). Above the grid: a **search input** (binds `query`) and a **sort `<select>`** (the 5 `SortKey`s). The grid renders `filterAndSort(items, state)` mapping `ProductCard` (unchanged) in the 5-col grid. Show a result count and an empty state. A **"Filters" button** visible below `lg` toggles a `useState` drawer (a panel containing the same sidebar controls). Reuse existing token classes only.

- [ ] **Step 1: Write failing test** (jsdom; mock `next/navigation` useSearchParams to empty)
```tsx
// @vitest-environment jsdom
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
vi.mock("next/navigation", () => ({ useSearchParams: () => new URLSearchParams("") }));
import { CartProvider } from "@/components/cart/cart-provider";
import { Storefront } from "@/components/storefront/storefront";
import type { StorefrontItem } from "@/lib/storefront-filter";

const mk = (slug: string, cat: string, hay: string): StorefrontItem => ({
  card: { slug, name: slug, subtitle: "", status: "ACTIVE", imageUrl: null, minPriceCents: 100, minCompareAtCents: null, minVariantId: "v", variants: [{ id: "v", label: "5mg", mg: 5, priceCents: 100 }] },
  categorySlug: cat, categoryName: cat, mgs: [5], minPriceCents: 100, haystack: hay, isPopular: false, isNew: false, popularityRank: 1,
});
const items = [mk("tirzepatide","glp-1","tirzepatide glp"), mk("bpc-157","healing-recovery","bpc healing recovery")];
const categories = [{ slug: "glp-1", name: "GLP-1" }, { slug: "healing-recovery", name: "Healing & Recovery" }];

it("renders grid and narrows by category + search", () => {
  render(<CartProvider><Storefront items={items} categories={categories} /></CartProvider>);
  expect(screen.getByText("tirzepatide")).toBeTruthy();
  expect(screen.getByText("bpc-157")).toBeTruthy();
  fireEvent.click(screen.getByRole("checkbox", { name: /healing & recovery/i }));
  expect(screen.queryByText("tirzepatide")).toBeNull();
  expect(screen.getByText("bpc-157")).toBeTruthy();
  fireEvent.change(screen.getByRole("searchbox"), { target: { value: "glp" } });
  expect(screen.queryByText("bpc-157")).toBeNull(); // category still healing, search glp → none
});
it("has a 5-per-row grid and a mobile filters toggle", () => {
  const { container } = render(<CartProvider><Storefront items={items} categories={categories} /></CartProvider>);
  expect(container.querySelector('[class*="xl:grid-cols-5"]')).toBeTruthy();
  expect(screen.getByRole("button", { name: /filters/i })).toBeTruthy();
});
```
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** the component (search input `type="search"` → role searchbox; category checkboxes labelled by `name`; the grid via `filterAndSort`; mobile "Filters" button toggling a drawer). Keep markup minimal and token-styled.
- [ ] **Step 4: Run** → PASS. `npx tsc --noEmit`, `npm run -s lint`.
- [ ] **Step 5: Commit** — `git commit -m "feat: unified storefront with sidebar filters, search, sort, mobile drawer"`

---

### Task 4: Wire homepage to the storefront

**Files:** Modify `app/page.tsx`, `components/sections/home/stacks.tsx`; Test `test/components/home-wire.test.ts` (static scan)

- `app/page.tsx`: keep `force-dynamic`; load products + stacks; build `StorefrontItem[]`:
  - `card: toProductCardData(p)`; `categorySlug: p.category.slug`; `categoryName: p.category.name`;
  - `mgs`: `[...new Set(p.variants.map(v => parseFloat(v.label)).filter(n => Number.isFinite(n)))]` (DB variants have no `mg` column; parse the label, e.g. "10mg vial" → 10);
  - `minPriceCents: Math.min(...p.variants.map(v=>v.priceCents))`;
  - `haystack: [p.name, p.subtitle, p.researchOverview, ...p.benefits, p.category.name].join(" ").toLowerCase()`;
  - `isPopular: isPopular(p.slug)`, `isNew: isNew(p.slug)`, `popularityRank: popularityRank(p.slug)`.
  - Build `categories` list (slug+name) ordered by category order (dedupe from products).
  - Render `<Storefront items={items} categories={categories} />` then `<StacksSection .../>` (unchanged data), `<BulkSection/>`, `<EducationSection/>`, `<SignupSection/>`, `<DisclaimerBar/>`. **Remove `CatalogBrowser` import/usage.**
- `components/sections/home/stacks.tsx`: ensure the section wrapper has `id="stacks"` (so `#stacks` scroll works). (Check current `SectionShell id` — set to `stacks`.)
- [ ] **Step 1: Write failing test** — static scan asserting `app/page.tsx` imports `Storefront` and does NOT import `CatalogBrowser`, and `stacks.tsx` contains `id="stacks"`.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run** tests + `npx tsc --noEmit` + `npm run -s lint`. (`getProductBySlug`/`getAllProducts` already `include: { category: true, variants: true }`.)
- [ ] **Step 5: Commit** — `git commit -m "feat: homepage renders unified storefront (drop category tabs)"`

---

### Task 5: Route consolidation + navbar

**Files:** Modify `app/shop/page.tsx`, `app/category/[slug]/page.tsx`, `app/stacks/page.tsx`, `components/navbar.tsx`; Test `test/routes.test.ts` (static scan)

- `app/shop/page.tsx`: replace body with `import { redirect } from "next/navigation"; export default function Page(){ redirect("/"); }`.
- `app/category/[slug]/page.tsx`: map alias then redirect:
```ts
import { redirect } from "next/navigation";
const ALIAS: Record<string,string> = { healing: "healing-recovery", "fat-loss": "metabolic-fat-loss", recovery: "healing-recovery", "muscle-growth": "muscle-gh" };
const VALID = new Set(["glp-1","metabolic-fat-loss","healing-recovery","muscle-gh","longevity","cognitive","hormonal-reproductive","sleep-recovery","skin-cosmetic","supplies"]);
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const target = ALIAS[slug] ?? slug;
  redirect(VALID.has(target) ? `/?purpose=${target}` : "/");
}
```
- `app/stacks/page.tsx`: `redirect("/#stacks")` (keep `app/stacks/[slug]` detail page untouched).
- `components/navbar.tsx`: update `NAV` to `[{href:"/",label:"Shop"},{href:"/?purpose=glp-1",label:"GLP-1"},{href:"/?purpose=healing-recovery",label:"Healing"},{href:"/?purpose=metabolic-fat-loss",label:"Fat Loss"},{href:"/#stacks",label:"Stacks"},{href:"/bulk",label:"Bulk Orders"},{href:"/ambassador",label:"Ambassador"},{href:"/faq",label:"FAQ"}]`.
- [ ] **Step 1: Write failing test** — static scan: `app/shop/page.tsx` and `app/stacks/page.tsx` contain `redirect(`; `app/category/[slug]/page.tsx` contains the alias map + `redirect`; navbar NAV contains `/?purpose=healing-recovery` and no `/category/healing`.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run** tests + `npx tsc --noEmit`.
- [ ] **Step 5: Commit** — `git commit -m "fix: consolidate routes into unified storefront (fixes Healing 404)"`

---

### Task 6: Logo slow DNA rotation

**Files:** Modify `app/globals.css`, `components/brand/helyx-logo.tsx`; Test `test/components/helyx-logo.test.tsx` (extend)

- `app/globals.css`: add
```css
.helyx-mark { animation: helyx-rotate 12s linear infinite; transform-origin: center; }
@keyframes helyx-rotate { from { transform: perspective(240px) rotateY(0deg); } to { transform: perspective(240px) rotateY(360deg); } }
@media (prefers-reduced-motion: reduce) { .helyx-mark { animation: none; } }
```
- `components/brand/helyx-logo.tsx`: add `helyx-mark` to the root `<svg>` className (compose with the passed `className`). Keep existing strand/rung/node classes.
- [ ] **Step 1: Write failing test** — extend the logo test: `container.querySelector("svg")?.getAttribute("class")` includes `helyx-mark`; keep the existing aria-label + 2-strand/4-rung assertions.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run** logo test + design-tokens test (ensure `#28e0c8` still only in the component, not globals.css — the rotation keyframe adds no teal) → PASS.
- [ ] **Step 5: Commit** — `git commit -m "feat: slow DNA rotation on the logo (reduced-motion safe)"`

---

### Task 7: Verify, build, headless, deploy

- [ ] **Step 1** `npm test` (full suite green; compliance guard green).
- [ ] **Step 2** `npx tsc --noEmit`, `npm run -s lint`, `npm run build` → clean.
- [ ] **Step 3** Headless (temp Playwright) against `npm start`: load `/` — sidebar + 5-per-row grid render, toggling a category checkbox narrows the grid, typing in search narrows it, zero console errors; load `/category/healing` and assert it lands on `/` (no 404); load `/shop` → `/`. Remove Playwright after.
- [ ] **Step 4** Merge branch → `main`, push (Netlify deploy), verify live: `/` renders the storefront; `/category/healing` resolves (no 404); logo present.
- [ ] **Step 5: Commit** any fixes.

---

## Self-Review
- **Spec coverage:** Healing/route fix → T5; logo rotation → T6; remove tabs/unified → T3,T4; sidebar filters → T2,T3; smart filtering/search/sort → T2,T3; 5-per-row → T3 (global constraint); description keyword filtering → T2 (haystack); mobile drawer → T3; merchandising → T1; stacks separate section → T4. Covered.
- **Type consistency:** `StorefrontItem`/`FilterState`/`SortKey` defined in `lib/storefront-filter.ts` (T2) and consumed by `Storefront` (T3) and `app/page.tsx` (T4). `isPopular/isNew/popularityRank` (T1) consumed in T4. `mgs` derived via label parse in T4 (DB has no mg column).
- **No placeholders:** pure-function + wiring code is complete; the component (T3) has its full test + precise behaviour spec.
