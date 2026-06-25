# Helyx Peptides — Redesign Spec #3: Unified Storefront, Sidebar Filters, Logo Rotation, Route Fixes

**Date:** 2026-06-25
**Status:** Design — approved approach (logo = slow DNA rotation; stacks = separate section)
**Scope:** Replace the category-tab storefront with ONE unified, filterable storefront (left sidebar + search + sort + mobile drawer), fix the broken category routes (Healing 404), and give the logo a slow continuous DNA rotation. **No aesthetic or product-card changes.**

---

## 1. Constraints (hard)

- **Do NOT redesign** the aesthetic, theme, backgrounds, or **product-card styling**. Only change: navigation structure, filtering system, product organization, logo animation, and the broken category route.
- Reuse the existing light clinical design tokens, `ProductCard`, `StackCard`, section shells, and grid classes verbatim.
- Keep the no-visible-discounts rule and the research-supply compliance posture (guard stays green).

---

## 2. Healing 404 + route consolidation

**Root cause:** the navbar links to `/category/healing` and `/category/fat-loss`, but the catalog slugs are `healing-recovery` and `metabolic-fat-loss`, so those routes 404.

**Fix (via consolidation):**
- The unified storefront at `/` replaces the per-category pages. The navbar's category links become **filter deep-links** into `/` (e.g. `/?purpose=healing-recovery`).
- `app/shop/page.tsx` → redirect to `/`.
- `app/category/[slug]/page.tsx` → redirect to `/?purpose=<slug>`, with **old-slug aliases** so legacy links resolve: `healing→healing-recovery`, `fat-loss→metabolic-fat-loss`, `recovery→healing-recovery`, `muscle-growth→muscle-gh`, `glp-1→glp-1` (unchanged). Unknown slug → redirect to `/`.
- `app/stacks/page.tsx` → redirect to `/#stacks` (the stacks section on the unified page). `app/stacks/[slug]` detail pages stay.
- Navbar links updated: `Shop → /`, `GLP-1 → /?purpose=glp-1`, `Healing → /?purpose=healing-recovery`, `Fat Loss → /?purpose=metabolic-fat-loss`, `Stacks → /#stacks`, plus existing `Bulk`, `Ambassador`, `FAQ`. All resolve (no 404s).

---

## 3. Unified storefront (`app/page.tsx` + new `Storefront` client component)

- `app/page.tsx` (server, force-dynamic) loads all products + stacks, maps them to a serialisable shape, and renders `<Storefront items={...} categories={...} />` followed by the existing `StacksSection`, `BulkSection`, `EducationSection`, `SignupSection`, `DisclaimerBar`. **Remove `CatalogBrowser`** (the tabs).
- `components/storefront/storefront.tsx` (`"use client"`): holds filter/search/sort state and renders a two-column layout — **left sidebar filters** + **product grid** — plus a mobile filter-drawer toggle. Reads an initial `purpose` from the URL query (`useSearchParams`) to pre-select a category filter (powers the nav deep-links).
- Grid: the existing compact card in a **5-per-row** grid (`grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4`). Card styling unchanged.

### Storefront item shape (passed from the page)
```ts
type StorefrontItem = {
  card: ProductCardData;            // for rendering (unchanged card)
  categorySlug: string;
  categoryName: string;
  mgs: number[];                    // variant strengths
  minPriceCents: number;
  haystack: string;                 // lowercased name+subtitle+overview+benefits+category for search
  isPopular: boolean;
  isNew: boolean;
  popularityRank: number;           // lower = more popular
};
```

---

## 4. Sidebar filters + smart filtering

**Sidebar (left, desktop; drawer on mobile) — all multi-select / real-time / client-side:**
- **Purpose / Category** — checkboxes for the 10 categories (Fat Loss, Healing & Recovery, Longevity, Cognitive, Muscle Growth, Sleep, Skin/Hair, Libido/Hormonal, GLP-1, Supplies). Multi-select (OR within the group).
- **Price range** — min/max numeric inputs (or two-handle range); item matches if `minPriceCents` within range.
- **MG strength** — checkboxes of the distinct mg values across the catalog; item matches if any of its `mgs` is selected (OR).
- **Popular products** — toggle; restrict to `isPopular`.
- **New arrivals** — toggle; restrict to `isNew`.
- **Clear all** button.

**Search bar** (top of grid): case-insensitive substring over `haystack`, so keyword/description queries work — "fat loss", "recovery", "sleep", "GLP", "healing", etc. match name/description/category.

**Sort dropdown:** Price (low→high), Price (high→low), Popularity (`popularityRank` asc), Newest (`isNew` first, then `popularityRank`), Best selling (`popularityRank` asc — proxy; no sales data).

Filtering/sort/search are **pure functions** (`lib/storefront-filter.ts`) so they're unit-tested; the component wires state to them. Multiple active filters combine with AND across groups, OR within a group. Results update in real time as state changes (no submit button). A result count + empty-state message are shown.

---

## 5. Merchandising data (`lib/merchandising.ts`)

No sales data exists, so "popular / new / best-selling" are a **static curation** (no DB change, no reseed):
- `POPULAR: Set<slug>` — GLP-1 class + the marquee recovery/longevity peptides (tirzepatide, retatrutide, semaglutide, cagrilintide, bpc-157, tb-500, ghk-cu, nad-plus, ipamorelin, mots-c).
- `NEW: Set<slug>` — a small recent set (retatrutide, cagrilintide, 5-amino-1mq, ss-31, foxo4).
- `popularityRank(slug): number` — POPULAR slugs ranked first (by a fixed order), then the rest alphabetically. Pure + tested.

---

## 6. Stacks (separate section below the grid)

Keep the existing `StacksSection` rendered **below** the unified product grid (the user's choice). It is NOT affected by the product filters. Anchor it with `id="stacks"` so `/?…#stacks` / nav "Stacks" scrolls to it. No card-style changes.

---

## 7. Mobile responsiveness

- Below `lg`, the sidebar is hidden and a **"Filters" button** opens a collapsible drawer (slide-in panel or disclosure) containing the same filter controls. Closing applies (filters are live, so they apply as toggled). Preserve the compact grid (2–3 cols on small screens).
- Use existing tokens; a simple state-driven panel (no new design language).

---

## 8. Logo — slow DNA rotation

- `components/brand/helyx-logo.tsx` + `app/globals.css`: add a **slow continuous `rotateY`** twist to the helix mark (≈12s linear loop, with a small `perspective`) so it reads as a rotating DNA strand. Keep the existing on-load draw-in; keep the rung pulse subtle. Subtle, premium, non-distracting.
- **`prefers-reduced-motion`: no rotation/animation** (static mark). Applies in navbar + footer.

---

## 9. Testing

- `lib/storefront-filter.ts` pure functions: filter by category (multi), price range, mg (multi), popular, new; search over haystack; each sort order. Unit-tested.
- `lib/merchandising.ts`: popular/new membership + rank ordering. Unit-tested.
- `Storefront` component (jsdom): renders sidebar + 5-per-row grid; toggling a category filter narrows results; typing in search narrows results; sort reorders; mobile drawer toggle present.
- Redirects: `/shop`, `/category/healing` (alias), `/stacks` resolve without 404 (build + a route check).
- Compliance guard stays green; `next build` green; headless check of `/` (sidebar + grid render, filter narrows, zero console errors) and one redirect.

---

## 10. Success criteria

1. No 404s — Healing and all category/nav/filter links resolve into the unified storefront.
2. One unified storefront: all products in a single 5-per-row filterable grid; no category tabs.
3. Left sidebar with all specified filters; multi-select, real-time, search (incl. description keywords), and sort all work; mobile filter drawer.
4. Logo rotates slowly (DNA twist), subtle and looping, reduced-motion safe.
5. No aesthetic or product-card changes; compliance guard green; build green; deployed and verified.
