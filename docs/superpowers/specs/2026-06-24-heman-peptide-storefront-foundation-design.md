# Heman Peptide — Spec #1: Storefront Foundation

**Date:** 2026-06-24
**Status:** Design — pending user review
**Scope:** First of ~8 specs. Builds the brand, catalog, product pages, cart/checkout
scaffolding, data model, and supporting pages for a **prescription-telehealth peptide
brand**. Everything else (Rx consult workflow, patient portal, ambassador program, admin,
marketing automation, blog, wholesale) is deferred to later specs.

---

## 1. Business & Compliance Model (the frame everything inherits)

Heman Peptide is a **prescription telehealth brand**, not a research-chemical reseller.
Every product is a prescription item fulfilled through a contracted, US-licensed
telehealth provider + compounding/dispensing pharmacy. Nothing is sold direct-to-consumer
for self-administration.

The purchase path for any product is therefore a **consultation gate**, not a raw
add-to-cart:

```
Browse catalog → Product page → "Start Consultation" → Intake questionnaire
  → Licensed provider review → Prescription issued → Pharmacy fills → Payment → Ship
```

This spec builds the **left half** of that path (browse → product → consult handoff) plus
the data model for the whole path. The provider-review workflow and pharmacy integration
are **Spec #2**.

### Three reframes from the original brief (deliberate, not optional)

1. **No "research use only / not for human consumption" language anywhere.** It is legally
   incoherent in an Rx model and contradicts the licensed-provider framing. Replaced with:
   *"Prescription product. Available only after consultation with a licensed provider. Use
   exactly as directed by your provider."*
2. **No public dosage/insulin-unit calculator.** A public "design your own cycle" tool
   facilitates unsupervised self-administration. Dosing is provider-directed. A
   reconstitution/measurement helper for a patient's **already-prescribed** dose lives in
   the authenticated patient portal (later spec), not in the public storefront.
3. **No "100-vial" consumer bulk pricing.** A single patient script cannot dispense 100
   vials. True wholesale is B2B-to-clinics — a licensed-distributor activity with its own
   compliance requirements, deferred to a dedicated spec.

### Content/claims rules baked into every product description

- Educational, research-framed language. **No efficacy guarantees, no medical claims, no
  off-label promotion.**
- Benefits described as areas of study, not promised outcomes.
- Every page carries a footer disclaimer: *"Prescription products require an online
  consultation and approval by a licensed healthcare provider. Individual eligibility is
  determined by the provider. This site does not provide medical advice."*

---

## 2. Tech Stack

Existing repo (reused): **Next.js 16.2.3 (App Router), React 19, TailwindCSS v4,
TypeScript, Framer Motion 12, GSAP + @gsap/react, Three.js / R3F, Lenis, Base UI,
shadcn-style components, lucide-react.**

Added in this spec:
- **Prisma ORM + PostgreSQL** — data layer.
- **Stripe** (`stripe` + `@stripe/stripe-js`) — wired in **test mode**, checkout gated (no
  live charge in this spec; charge happens post-approval in Spec #2).
- **Zod** — input validation for forms/server actions.

> ⚠️ Per `AGENTS.md`: this Next.js build may differ from training data. Read the relevant
> guide in `node_modules/next/dist/docs/` before writing routing/data-fetching code.

---

## 3. Brand & Design System

Dark luxury biotech aesthetic — minimal, high-end, scientific, trustworthy. Mobile-first.

- **Design tokens** (`app/globals.css` + Tailwind theme): near-black base (`#050510`-ish),
  a single luminous accent (clinical teal/cyan or a restrained gold — final pick during
  build), subtle gradients, generous spacing, high-contrast typography.
- **Typography:** reuse `Space_Grotesk` (display) + `Inter` (body) already loaded.
- **Reused animation infrastructure:** `LenisProvider`, `AmbientBackground`,
  `GlobalWebglBackground`, `PageTransition`, `reveal`, `split-heading`, `magnetic-button`,
  `tilt-card`. Marketing-agency-specific copy/sections get replaced, infra stays.
- **Component library:** Button, Card, Badge, Accordion (have), plus new Product Card,
  Category Tile, Price Display, Consult CTA, Disclaimer Bar, Email Capture, Testimonial,
  FAQ item. Each is a focused, independently-testable unit.

Rebrand `layout.tsx` metadata + `Navbar`/`Footer`/`nova-logo` from "Nova Marketing" to
Heman Peptide.

---

## 4. Data Model (Prisma / PostgreSQL)

Modeled now even where the workflow lands later, so the schema is stable.

- **Category** — slug, name, description, ordering, hero copy. Seeded: GLP-1 Peptides,
  Fat Loss, Recovery, Muscle Growth, Longevity, Cognitive, Healing, Stacks/Bundles.
- **Product** — slug, name, subtitle, `categoryId`, research overview, benefits (areas of
  study), reconstitution notes, status (`ACTIVE`/`COMING_SOON`/`WAITLIST`), `isRx`
  (true for all here), SEO fields, imagery refs, related-product refs.
- **ProductVariant** — strength/size (e.g. "10mg vial"), SKU, `priceCents` (placeholder
  MSRP), compare-at price (informational only), `subscriptionEligible`.
- **Stack** — branded bundles (Wolverine, GLP-1 Advanced, Recovery, Longevity), composed
  of products, bundle discount, protocol overview.
- **User** — auth scaffold (account shell; full auth can be its own concern). Email, name,
  role (`CUSTOMER`/`PROVIDER`/`ADMIN`), timestamps.
- **Cart** + **CartItem** — session/user cart; items reference variants.
- **Order** + **OrderItem** — created in `PENDING_CONSULT` state; cannot advance to `PAID`
  without a linked approved Prescription (enforced in Spec #2 workflow; modeled now).
- **Consult** — intake submission shell (status: `SUBMITTED`/`IN_REVIEW`/`APPROVED`/
  `DENIED`). Workflow in Spec #2; entity + status enum defined now.
- **Prescription** — links Consult → approved Product(s)/dose; gates Order payment.
- **EmailCapture** — email, optional phone, source, consent flags, timestamp.

Migrations + a `seed.ts` populating categories, all featured peptides as Rx products with
realistic compliant descriptions, variants with placeholder pricing, and the four stacks.

### Featured peptides to seed (all Rx, behind the gate)

GLP-1 / metabolic: Tirzepatide, Semaglutide, Retatrutide, Cagrilintide, Tesamorelin,
AOD-9604. Recovery/healing: BPC-157, TB-500, GHK-Cu. Growth/performance: Ipamorelin,
CJC-1295. Longevity/cognitive: MOTS-c, NAD+, DSIP. Stacks: Wolverine (BPC-157 + TB-500),
GLP-1 Advanced (Retatrutide + Cagrilintide), Recovery (BPC-157 + GHK-Cu), Longevity
(MOTS-c + NAD+).

---

## 5. Pages & Routes (this spec)

- `/` **Homepage** — hero (GLP-1 + trending), CTAs ("Shop Peptides", "View GLP-1
  Collection", "Start a Consultation", "Ambassador Program" → waitlist stub), featured
  stacks, trending carousel, research/education section, email/SMS opt-in, testimonials,
  FAQ (with FAQ schema), footer w/ legal nav + disclaimer.
- `/shop` — all products, filter by category.
- `/category/[slug]` — category landing + products.
- `/product/[slug]` — research overview, benefits, reconstitution info, variant/price
  selector, **"Start Consultation"** CTA (handoff stub → Spec #2), related products,
  "frequently paired" (cross-sell, no medical bundling claims).
- `/stacks` and `/stacks/[slug]` — branded stacks.
- `/cart` — cart view; checkout button routes into the consult gate (cannot complete here).
- **Legal:** `/legal/terms`, `/legal/privacy`, `/legal/refund`, `/legal/shipping`,
  `/legal/medical-disclaimer`.
- **API/actions:** product/category queries (server components), email-capture action
  (Zod-validated), cart actions, Stripe checkout-session scaffold (test mode, gated).

---

## 6. Email Capture

Reusable opt-in component (inline + footer placements) writing to `EmailCapture` with
explicit consent flags (email + optional SMS). **No popups, exit-intent, or discount wheel
in this spec** — that's the marketing-automation spec. Stores leads compliantly now.

---

## 7. SEO Foundation

Per-page metadata via Next metadata API, `sitemap.ts`, `robots.ts`, JSON-LD scaffolding
(Organization, Product, FAQPage), clean semantic markup. Content/blog engine is a later
spec; this establishes the technical SEO base.

---

## 8. Pricing Logic

- Seed prices are **configurable placeholder MSRPs** set by the business/pharmacy — **not**
  auto-scraped from competitors (indefensible and brittle in an Rx model).
- Data model supports: standard price, compare-at (informational), subscription-eligible
  flag, bundle discount on stacks. Subscription billing logic itself is deferred.
- No bulk/wholesale pricing engine in this spec (deferred per §1).

---

## 9. Explicitly Out of Scope (own specs later)

Provider-review dashboard + pharmacy fulfillment integration · authenticated patient portal
+ provider-directed dosing/reconstitution tool · ambassador program + referral/commission ·
admin dashboard (inventory/discounts/analytics/orders/customers) · email/SMS automation,
popups, exit-intent, discount wheel, abandoned-cart, welcome series · blog/content/SEO
content engine · B2B wholesale + distributor compliance · live Stripe charges &
subscription billing.

---

## 10. Testing

- Unit: pricing/display helpers, Zod schemas, cart reducers, seed integrity.
- Component: product card, price display, email capture, consult CTA states.
- Integration: catalog queries against a test DB; email-capture action; gated-checkout
  rejection (checkout cannot complete without prescription state).
- Follow TDD per project skills.

---

## 11. Success Criteria

1. A visitor can browse a premium, fast, mobile-first dark-biotech storefront with all
   featured peptides as educational Rx product pages.
2. Every purchase path routes to the consultation gate; nothing is directly purchasable.
3. No "research use only / not for human consumption" language; compliant Rx framing
   sitewide.
4. Schema supports the full consult → prescription → order → payment path (workflow lands
   in Spec #2).
5. Email capture, legal pages, and SEO base are live.
6. Tests pass; `next build` succeeds.
