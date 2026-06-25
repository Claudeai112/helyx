# Helyx Peptides — Redesign Spec #2: Full Catalog + Compact Storefront

**Date:** 2026-06-25
**Status:** Design — pending user review
**Scope:** Rebuild the catalog from the user's reference list (~45 products + 6
stacks) and reformat the storefront into a compact, category-segmented,
MG-selectable shopping experience. Keep the existing **light clinical** design
system (colors, typography) — change the **layout/format only**. No dosing/cycle
calculator (compliance line); a reconstitution/concentration *reference* and a
"work with a licensed provider" pathway instead.

---

## 1. Framing & compliance (unchanged from Redesign #1)

Helyx Peptides is a **professional peptide research-supply** company. All copy is
research-framed; **no medical/therapeutic claims, no promised outcomes, no
self-administration or dosing content.** Sitewide RUO disclaimer remains: *"For
research use only. Not for human consumption. Products are intended for laboratory
and research purposes."*

**Category labels are research-framed**, not consumer-benefit, to avoid implied
therapeutic claims (e.g. "Skin & Cosmetic Research," not "Beauty"). The compliance
guard (`test/compliance-copy.test.ts`) continues to forbid human-use/therapeutic/
self-administration phrasing and must stay green over all new copy.

**Explicitly NOT built (compliance line):** no dosage calculator, no cycle/
"sustainability" calculator, no per-injection dose / insulin-unit / injection-
frequency / reorder-date output, no human cycle-duration protocols, no "expected
effects/results." These were declined; this spec does not reintroduce them.

**Built instead:**
- **Reconstitution/Concentration reference** (lab math only): given vial strength
  (mg) and solvent volume (mL), output concentration (mg/mL) and total mg per vial;
  given a target research quantity, output vials required and cost per vial. No
  desired-dose, no injection units, no schedule, no reorder date.
- **"Work with a licensed provider" safety pathway**: a clear, repeated callout
  directing anyone considering human use to consult a licensed clinician for
  screening/titration. Honest harm-reduction; not dosing guidance.

---

## 2. Design / format (keep look, change layout)

Reuse Redesign #1 tokens and fonts unchanged (light `#FFFFFF` surfaces, `#1A2230`
text, `#1E5CA8` medical-blue primary, Inter + IBM Plex Sans, subtle fade-ins,
restored animated double-helix logo). **No dark theme.** Only the storefront
*structure* changes:

- **Compact grid: exactly 5 products per row on desktop** (`xl:grid-cols-5`),
  stepping down 4/3/2/1 at smaller breakpoints. Tighter card and gap sizing than
  Redesign #1 so a category shows many products without excessive scrolling.
- **Category segmentation**: products grouped under clearly labeled sections.
  Browsing uses **category tabs** (horizontal, sticky under the header) plus
  optional **accordion** collapse for long sections, to minimize page length.
- **GLP-1 is its own segment**, surfaced as one category among equals — not
  repeatedly featured across the homepage.
- Balanced-but-efficient whitespace; mobile-first; max content width ~1200px.

### Condensed product card
Each card shows: product image · name · **MG dropdown** (vial strengths) ·
**price (updates with MG)** · **Add to cart** (quick add of selected MG) ·
**Learn More** (→ product page). No discount/compare-at/savings UI.

---

## 3. Catalog (from the user's reference list — products + MG only)

Retail prices are **not** taken from the reference sheet (that's internal cost).
Prices are set per §5 and **approved before seeding**. MG options below are the
selectable variants per product. Cross-listed compounds get one **primary**
category (listed here); secondary surfacing via tags is optional/later.

**GLP-1 & Metabolic** (own segment): Semaglutide (5,10,15,20,30) · Tirzepatide
(5,10,15,20,30,40,50,60,70,80,90,100,120) · Retatrutide (5,10,15,20,30,40,50,60) ·
Cagrilintide (5,10)

**Metabolic / Fat Loss Research:** AOD-9604 (2,5) · Tesamorelin (2,5,10,20) ·
MOTS-C (10,20,40) · 5-Amino-1MQ (5,50) · Adipotide (5)

**Healing & Recovery:** BPC-157 (5,10) · TB-500 (5,10) · GHK-Cu (50,100) ·
KPV (5,10) · LL-37 (5) · ARA-290 / Cibinetide (10) · VIP (10)

**Muscle / GH-axis:** CJC-1295 no-DAC (2,5,10) · CJC-1295 with DAC (2,5) ·
Ipamorelin (5,10) · Sermorelin (5,10) · Hexarelin (5) · GHRP-2 (5,10) ·
GHRP-6 (5,10) · IGF-1 LR3 (0.1,1) · MGF (2) · PEG-MGF (2)

**Longevity:** NAD+ (100,500,1000) · Epitalon (10,50) · SS-31 (10,50) ·
Thymalin (10) · Thymosin α-1 (5,10) · FOXO4 (10) · Pinealon (10) ·
Glutathione (600,1500) · AICAR (50)

**Cognitive / Nootropic:** Semax (5,10) · Selank (5,10)

**Hormonal & Reproductive:** PT-141 (10) · Kisspeptin-10 (5,10) ·
Gonadorelin (2) · Gonadorelin Acetate (2) · HCG (5000iu) · HMG (75iu) ·
Oxytocin Acetate (2,5)

**Sleep & Recovery:** DSIP (5,10,15)

**Skin & Cosmetic Research:** AHK-Cu (50,100) · Melanotan-1 (10) ·
Melanotan-2 (10) · Snap-8 (10)

**Research Supplies:** Sterile water (3ml,10ml) · Acetic acid 0.6% (3ml,10ml)
— framed as research solvents/consumables, no injection-prep language.

### Stacks / bundles (single listed bundle price, no savings shown)
- **Wolverine** — BPC-157 + TB-500
- **Glow** — GHK-Cu + BPC-157 + TB-500
- **Klow** — TB-500 + BPC-157 + GHK-Cu + KPV
- **Performance** — CJC-1295 (no-DAC) + Ipamorelin
- **GLP-1 Advanced** — Retatrutide + Cagrilintide
- **GLP-1 Combo** — Cagrilintide + Semaglutide

Each stack page: contents list, research-framed explanation, single bundle price,
Add to cart. **No cycle duration, no dosage-calculator integration.**

---

## 4. MG selection + variant pricing

- Every product carries its MG strengths as **variants**; the card and product page
  expose a **dropdown** to pick the vial strength.
- **Price updates live** with the selected MG (client-side; variant → price map).
- Add to cart adds the selected MG variant.
- Reuse the existing Prisma `Product`/`Variant` model and `lib/cart-store`. Variant
  label = `"<mg>mg"` (or `"<n>iu"`, `"<n>ml"` for IU/solvent items).

---

## 5. Pricing (single listed price; no visible discounts)

- **Display rule:** exactly one price per selected MG. **No** compare-at,
  strikethrough, "you save," subscription-discount, or bundle/bulk savings badges
  anywhere.
- **Retail derivation (internal):** research current market rates for representative
  products and set retail ~10% below average market; apply a consistent retail model
  across the rest. The internal cost sheet stays internal. **The full proposed price
  list is presented for user approval before seeding** (a gated task, not a silent
  default).
- **Bulk:** customers can bulk-order through normal checkout. A **$1000 subtotal**
  triggers wholesale handling: an extended-processing notice and adjusted delivery
  estimate. Bulk price for a 100-vial quantity is computed as
  `(single vial price × 100) − 15%`; the bulk view lists the **total** and the
  **per-vial** figure as plain numbers (no "savings amount" callout, per the display
  rule). Bulk shipping notice at checkout: *"Bulk/wholesale orders may require
  additional processing time. Estimated delivery window: 2–3 weeks."*

---

## 6. Product pages (research-framed)

Each product page includes: image · name · MG dropdown + price · Add to cart ·
research overview (what it's *studied/researched for* — no human results) ·
reconstitution overview (research solvent) · storage guidance · recommended
research stacks · the reconstitution/concentration reference · provider-pathway
callout · RUO disclaimer. **No** suggested human cycle duration, **no** dosing.

---

## 7. Homepage

Homepage = the shop, reorganized: brief brand intro → **category tabs** → compact
5-per-row grids per category (GLP-1 as one segment) → stacks section → bulk entry →
research/education section → signup → footer. No repeated GLP-1 featuring. Keeps the
restored animated logo and light aesthetic.

---

## 8. Testing

- Compliance guard stays green over all new catalog copy; confirm no dosing/
  calculator/therapeutic phrasing slips in (add stems if needed).
- Catalog seed: counts and MG variants match this spec.
- MG dropdown updates price; Add to cart adds the selected variant (unit tests).
- Bulk math: `(vial×100)−15%`, per-vial, and $1000 threshold (pure-function tests).
- Reconstitution reference: mg/mL and vials-required math (pure-function tests).
- 5-per-row grid renders at `xl`; category tabs/accordions navigate.
- `next build` green; homepage + a product page verified in a real browser
  (headless) with zero client errors.

---

## 9. Success criteria

1. ~45 products + 6 stacks live, segmented into the research-framed categories,
   each product MG-selectable with a live single price.
2. Compact 5-per-row, tabbed/accordion storefront — browse many products without
   excessive scrolling — on the unchanged light clinical design.
3. No visible discounts anywhere; bulk + stacks show plain prices; $1000 bulk rule +
   2–3 week notice present.
4. No dosing/cycle calculator; reconstitution reference + provider pathway present;
   compliance guard green; research-framed copy throughout.
5. Retail price list approved by the user before seeding.
