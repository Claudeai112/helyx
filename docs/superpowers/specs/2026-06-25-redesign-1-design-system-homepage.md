# Helyx Peptides — Redesign Spec #1: Design System Reset + Homepage Storefront

**Date:** 2026-06-25
**Status:** Design — pending user review
**Scope:** First of several redesign specs. Replaces the flashy WebGL/animation
aesthetic with a clean, professional, light-first medical/biotech storefront, and
reframes the brand from prescription-telehealth to **professional peptide research
supply**. Builds the homepage-as-shop. Product pages, cart/checkout/payment, the
reference calculators, and ambassador/SMS/popup are later specs.

---

## 1. Framing & compliance (the model reframe)

Helyx Peptides is positioned as a **professional peptide research supply company** —
not a direct-to-consumer medical-treatment brand. This is a deliberate shift from
the prior prescription-telehealth framing.

Copy rules across all rendered surfaces:
- **Educational, research-focused** product and page copy. **No medical or
  therapeutic claims.** No promised outcomes (e.g. weight-loss results), no
  "cure/treat," no efficacy guarantees.
- **No self-administration content** — no injection instructions, no dosing
  schedules, no cycle-building/"design your cycle" language.
- **No consultation/prescription/provider language** anywhere in marketing copy.
- **Research-use disclaimer** present sitewide (footer + fine print), professionally
  worded: *"For research use only. Not for human consumption. Products are intended
  for laboratory and research purposes."*
- **No access code / authorization gate.** Checkout is open standard ecommerce
  (add to cart → checkout → pay; the cart + payment are a later spec). With no
  gate, the compliance boundary is **entirely** the research-supply controls:
  genuine RUO labeling, research-framed/claim-free copy, no self-administration or
  dosing content, and the reference calculator staying a concentration/
  reconstitution reference only. The prior access-code engine (`lib/codes`,
  `lib/rx-auth`, redeem flow) becomes **dormant/retired** — not wired into the new
  checkout.

### Compliance guard change (test inversion)
`test/compliance-copy.test.ts` currently FORBIDS "research use only" / "not for human
consumption" (correct for the old prescription model). Under the research-supply
model these become the EXPECTED labels. This spec **rewrites that guard** to instead
forbid the opposite risks — human-use/therapeutic/self-administration language:
forbidden substrings (case-insensitive, tightly scoped to avoid false positives):
`"for human use"`, `"intended for human"`, `"inject yourself"`, `"how to inject"`,
`"your dose"`, `"dose yourself"`, `"weight loss results"`, `"cure "`, `"treats "`,
`"consult your doctor"`, `"prescription required"`. The RUO disclaimer string must be
present in the DisclaimerBar.

---

## 2. Scope

**In scope:** layout/animation reset (strip the WebGL + motion infra and heavy deps);
new light-first clinical design system + typography; static logo; clean header/nav +
footer; homepage-as-shop (all 8 sections); clean product & stack cards; a minimal
client-side cart store (add-to-cart + header count); the copy/disclaimer reframe;
SEO/metadata; the compliance-guard inversion.

**Deferred to later specs:** product-page redesign + research/reconstitution content;
cart page + open checkout (no access code) + Stripe payment; the
reference calculators (concentration / reconstitution / bulk-pricing); ambassador
application; SMS opt-in + discount popup; full product-description reframe in
`lib/seed-data.ts` (the homepage shows names + short descriptors + price, which are
already neutral; deep descriptions are reframed when product pages are rebuilt).

---

## 3. Design system

**Palette — light-first clinical, medical-blue accent** (tokens in `app/globals.css`):
- Surfaces: `--background` `#FFFFFF`, `--surface` `#F7F8FA`, `--card` `#FFFFFF`.
- Text: `--foreground` `#1A2230` (deep slate), `--muted-foreground` `#5B6675`.
- Borders: `--border` `#E6E9EE` (soft grey).
- Accent: `--primary` medical blue `#1E5CA8` (hover `#184E8F`), `--primary-foreground`
  white. A single restrained accent — used for links, primary buttons, key highlights.
- One grounding dark band allowed (footer): slate `#10151E`.
- Retire the glow/teal/nova tokens; keep the shadcn token NAMES (components depend on
  them) but set clean light values. Remove the radial vignette / glow utilities.

**Typography:** body **Inter**, headings **IBM Plex Sans** (via `next/font/google`).
Easy to read, properly spaced, minimal capitalization (sentence case headings). No
overly stylized type, no all-caps display, no letter-spacing tricks.

**Motion (allowed only):** page-load fade-in, on-scroll card/section fade-in
(Intersection Observer based), button hover states, smooth page transitions. A new
lightweight `Reveal` replaces the GSAP one. **Forbidden:** animated backgrounds, glow,
particles, custom cursor, parallax/scroll-driven scenes, continuous motion. The logo
is **static**.

**Layout:** generous whitespace, simple grids, clear hierarchy, mobile-first. Max
content width ~1200px. Fast: removing the 3D/animation stack significantly shrinks the
bundle.

---

## 4. Global chrome

**`app/layout.tsx` reset** — remove `GlobalWebglBackground`, `AmbientBackground`,
`LenisProvider`, `CustomCursor`, `PageTransition`, `ScrollTimeline`, the dim/vignette
overlays. Keep a plain `<body>` with `Navbar` + `main` + `Footer`. Update fonts to
Inter + IBM Plex Sans. Update metadata to "Helyx Peptides — research supply" framing.

**Dependencies removed:** `three`, `@react-three/fiber`, `@react-three/drei`,
`@react-three/postprocessing`, `gsap`, `@gsap/react`, `lenis`, `split-type`. Delete
`components/webgl/*`, `ambient-background`, `lenis-provider`, `custom-cursor`,
`page-transition`, `scroll-stage`, `magnetic-button`, `split-heading`, `tilt-card`,
and the unused agency sections (`ads-work`, `portfolio`, `process`, `services`,
`results`, `cta`). Keep `framer-motion` only if used for the subtle allowed
fade/hover; otherwise prefer CSS — decide during build, default to CSS + a tiny
Intersection-Observer `Reveal`.

**Logo** — new static `HelyxLogo`: a clean "Helyx Peptides" wordmark with a simple
geometric mark (e.g. a minimal hexagon/molecule glyph in medical blue). No animation.

**Header** — sticky, light, bordered-bottom: logo (left); nav: Shop, GLP-1, Healing,
Fat Loss, Stacks, Bulk Orders, Ambassador, FAQ; right: account link + cart icon with
live item count. Collapses to a clean mobile menu (hamburger → simple panel).

**Footer** — slate band: brand + short blurb, column links (shop categories, company,
legal: Terms/Privacy/Refund/Shipping), email signup field, and the RUO research-use
fine print.

---

## 5. Homepage as the shop (`app/page.tsx`)

Exact section order:
1. **Header** (global).
2. **Featured GLP-1** — a clean banner/row spotlighting Tirzepatide, Semaglutide,
   Retatrutide, Cagrilintide (cards with image, name, short research descriptor,
   price, Add to cart).
3. **Product grid** — the full catalog as clean cards (filterable later; static grid
   now), grouped or paginated sensibly.
4. **Popular stacks** — Wolverine (BPC-157 + TB-500), GLP-1 (Retatrutide +
   Cagrilintide), Recovery (BPC-157 + GHK-Cu): image, contents, bundle price, savings,
   Add to cart.
5. **Bulk ordering section** — concise pitch + "Bulk Orders" CTA (bulk pricing detail
   is a later spec; this is the entry point).
6. **Educational / research section** — research-framed informational content
   (handling, storage, what peptides are in research contexts), no claims.
7. **Email & SMS signup** — clean inline capture (email now; SMS field present, full
   SMS opt-in logic later).
8. **Footer** (global).

Reads as a premium storefront, not a landing page. `force-dynamic` (reads catalog).

---

## 6. Components (built / reset)

- `components/ui/*`: refreshed `Button` (medical-blue primary, clean secondary/ghost),
  `Badge`, `PriceDisplay` (single price + optional compare-at/savings),
  `DisclaimerBar` (RUO copy).
- `components/commerce/product-card.tsx`: image area, name, one-line research
  descriptor, `PriceDisplay`, **Add to cart** button (Base UI `Button`). No
  consultation CTA.
- `components/commerce/stack-card.tsx`: image, contents list, bundle price + savings,
  Add to cart.
- `components/sections/*`: rebuilt clean homepage sections (featured, grid, stacks,
  bulk, education, signup) replacing the agency sections.
- `components/reveal.tsx`: rewritten as a dependency-free Intersection-Observer
  fade-in wrapper (respects `prefers-reduced-motion`).
- `components/marketing/email-capture.tsx`: restyled to the clean aesthetic (existing
  server action + validation reused).

---

## 7. Minimal cart store

A lightweight client cart so Add-to-cart feels real now:
- `lib/cart-store.ts` (or a React context): cart items in `localStorage`, `addItem`,
  `removeItem`, `count`, `subtotal` (reuses `lib/money` + `lib/cart` math).
- Header shows live item count.
- **No cart page, checkout, payment, or access-code wiring in this spec** — that's the
  next spec. Add-to-cart updates the store + count and shows a subtle confirmation.

---

## 8. Data & copy

Reuse the existing Prisma catalog + queries (`lib/catalog`, seeded products/stacks).
Product **names, short descriptors, and prices** are shown on the homepage and are
already neutral/research-appropriate. The **DisclaimerBar** copy is replaced with the
RUO text. Homepage section copy (education, bulk, signup) is written research-framed,
no claims. Deep product descriptions in `lib/seed-data.ts` are reframed in the
product-page spec.

---

## 9. SEO / metadata

Update `app/layout.tsx` metadata + `lib/seo.ts` Organization to the research-supply
framing ("Helyx Peptides — peptide research supplies"). Keep sitemap/robots/JSON-LD;
adjust descriptions to research-focused, claim-free wording.

---

## 10. Testing

- Rewritten `test/compliance-copy.test.ts` (forbids human-use/therapeutic/self-admin
  language; asserts RUO disclaimer present).
- Component tests: product card (renders name/price/Add-to-cart, no consultation
  wording), disclaimer bar (RUO text), cart store (add/remove/count/subtotal).
- `Reveal` respects reduced motion.
- `next build` succeeds; bundle no longer includes three/gsap/lenis.
- Follow TDD per project conventions; verify in a real browser (Playwright headless)
  that the homepage loads with **zero client errors** and no CSP violations — the
  lesson from the WebGL/HDRI incident.

---

## 11. Success criteria

1. The homepage looks like a clean, professional, light medical-supply storefront —
   no animated background, glow, particles, or flashy motion; only subtle fade-ins.
2. Homepage functions as the shop in the specified 8-section order, with working
   Add-to-cart updating a header cart count.
3. Brand reads as **Helyx Peptides** research supply; copy is educational/research-
   framed with the RUO disclaimer and **no** medical/consultation/self-injection
   language.
4. The 3D/animation dependency stack is removed; bundle is smaller; build is green.
5. Tests pass (incl. the inverted compliance guard); homepage verified in a real
   browser with zero client errors.
