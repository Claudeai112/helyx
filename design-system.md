# Nova Marketing — Design System Audit

Source: `Nova Marketing Website copy.html` (2622 lines). This document captures the visual language to be ported into the Next.js + Tailwind + shadcn/ui rebuild.

---

## 1. Color Palette

### Brand
| Token | Hex | Role |
|---|---|---|
| `brand-purple` | `#6c5ce7` | Primary brand, gradient start, accent text, link hover |
| `brand-cyan` | `#00cec9` | Secondary brand, gradient end, success/check marks |
| `brand-violet` | `#a78bfa` | Mid-stop in gradients, eyebrow/tag text |

**Signature gradient:** `linear-gradient(135deg, #6c5ce7, #00cec9)` — used on CTAs, headings (`.gradient-text`), icon tiles, dividers, scrollbar.
**Hero animated gradient:** `linear-gradient(135deg, #6c5ce7 0%, #a78bfa 30%, #00cec9 70%, #6c5ce7 100%)` with `gradient-shift` 4s loop.

### Surfaces (dark theme)
| Token | Hex | Role |
|---|---|---|
| `bg-base` | `#050510` | Page background |
| `bg-elev-1` | `#0a0a1a` | Scrollbar track, slightly lifted surface |
| `card-fill` | `rgba(255,255,255,0.03–0.04)` | Card backgrounds (glass) |
| `card-border` | `rgba(255,255,255,0.06–0.10)` | Card outlines |
| `card-border-hover` | `rgba(108,92,231,0.4)` | Border on hover |

### Text
| Token | Hex | Role |
|---|---|---|
| `text-primary` | `#ffffff` | Headings |
| `text-body` | `#e0e0f0` | Body default |
| `text-muted` | `#a0a0c0` | Nav, secondary copy |
| `text-dim` | `#7777aa` / `#8888aa` | Section descriptions |
| `text-faint` | `#55557a` / `#44446a` | Captions, placeholders |
| `text-ghost` | `#33334a` | Footer fineprint |

### Accent (data viz / status)
| Token | Hex | Role |
|---|---|---|
| `accent-pink` | `#fd79a8` | Result stat |
| `accent-amber` | `#fdcb6e` | Result stat, star ratings |

---

## 2. Typography

**Families** (load via `next/font`):
- **Inter** — body, UI, paragraphs (`font-sans`)
- **Space Grotesk** — h1–h5, stat numbers, logo (`font-display`)

**Scale** (extracted from CSS):
| Token | Size | Usage |
|---|---|---|
| `display-xl` | `clamp(2.5rem, 6vw, 4.5rem)` / weight 800 | Hero h1 |
| `display-lg` | `clamp(2rem, 4vw, 3rem)` | Section h2 |
| `display-md` | `2.2rem` | Stat numbers, booking heading |
| `display-sm` | `1.8rem` | Sub-section heading |
| `h3` | `1.4rem` (featured 1.5rem) | Card titles |
| `h4` | `1.2rem` | Service titles, logo top line |
| `body-lg` | `1.15rem` | Hero paragraph |
| `body` | `1rem` (line-height 1.6) | Default paragraph |
| `body-sm` | `0.95rem` / `0.9rem` | Card copy, nav |
| `caption` | `0.85rem` / `0.8rem` | Stat label, footnotes |
| `eyebrow` | `0.75rem`, uppercase, letter-spacing `1–3px` | Section tag, badge |
| `micro` | `0.7rem` / `0.65rem` | Featured ribbon, logo subline |

**Weights:** 800 (hero), 700 (headings, stats), 600 (CTAs), 500 (nav), 400 (body).

---

## 3. Spacing, Radius, Shadow, Effects

### Spacing
- Section vertical rhythm: `padding: 7rem 2rem` desktop / `4rem 1.2rem` mobile
- Hero: `8rem 2rem 4rem` / `6rem 1.2rem 3rem` mobile
- Card padding: `2.5rem` (default), `3rem` (featured pricing), `2rem` (testimonial), `1.5rem` (mobile)
- Section header bottom margin: `4rem`
- Container max-width: `1300px` (nav), `1200px` (grids), `900px` (section header), `650px` (hero copy)

### Radius
| Token | Value | Use |
|---|---|---|
| `radius-pill` | `50px` | Buttons, badges, nav CTA |
| `radius-2xl` | `24px` | Booking form container |
| `radius-xl` | `20px` | Cards (service, result, pricing, testimonial) |
| `radius-lg` | `16px` | Service icon tile |
| `radius-md` | `12px` | Inputs, marquee tags |
| `radius-sm` | `10px` | Footer badges, modal blocks |
| `radius-full` | `50%` | Avatars, dots, process circles, FAQ chevron |

### Shadow / Glow
- CTA glow: `0 4px 25px rgba(108,92,231,0.4)` → hover `0 8px 40px rgba(108,92,231,0.6)`
- Nav CTA: `0 4px 20px rgba(108,92,231,0.35)` → hover `0 6px 30px rgba(108,92,231,0.5)`
- Card lift: `0 20px 60px rgba(0,0,0,0.3)`
- Icon halo: `0 0 30px rgba(108,92,231,0.3)`
- Logo halo: `drop-shadow(0 0 12px rgba(108,92,231,0.5))`

### Borders
- Default card: `1px solid rgba(255,255,255,0.06)`
- Gradient border (featured): mask trick over `linear-gradient(#fff 0 0)` with brand gradient

### Ambient FX (background layer)
- `#particleCanvas` — interactive particles
- `.cursor-glow` — 500px radial purple glow following cursor
- `.bg-grid` — 60px grid `rgba(108,92,231,0.03)` masked to ellipse
- `.bg-nebula` — 5 blurred (100px) blobs in purple/cyan with `nebulaFloat` 20–25s loop
- `.bg-vignette` — radial vignette to `rgba(5,5,16,0.6)`

### Motion
- Hero `fadeInUp` cascade, 0.2s stagger
- `gradient-shift` 4s on hero h1
- `pulse-dot` 2s on badge dot
- Standard transition: `0.3s` ease (`0.4s cubic-bezier(0.4,0,0.2,1)` for navbar)

---

## 4. Section Inventory (in render order)

| # | ID | Section | Purpose |
|---|---|---|---|
| 0 | `navbar` | Navigation | Fixed top bar, scrolled state adds blur + border, mobile hamburger |
| 1 | `.hero` | Hero | Headline "We Build Websites That Sell & Ads That Scale", badge, dual CTA, 4 hero stats |
| 2 | `services` | Services / "01 // What We Do" | Foundation pitch + service cards (websites, ads, strategy) |
| 3 | `process` | Process / "02 // How It Works" | "From Zero to Revenue in 4 Steps" — numbered process flow |
| 4 | `expectations` | Expectations | Inline reassurance: "Growth Is a Process, Not a Magic Trick" |
| 5 | `results` | Results / "04 // Proven Results" | Stat cards (purple/teal/pink/amber) showing typical 3–6 month outcomes |
| 6 | `pricing` | Pricing / "05 // Pricing" | Transparent tiered packages, featured plan with gradient border + ribbon |
| 7 | `portfolio` | Portfolio / "06 // Our Work" | Recent project thumbnails grid |
| 8 | `reviews` | Reviews / "07 // Client Reviews" | Testimonial cards with stars + avatar |
| 9 | `ads-work` | Ads Work / "08 // Ad Campaigns" | Data-first ad management explainer |
| 10 | `faq` | FAQ / "09 // FAQ" | Accordion of common questions, purple chevron |
| 11 | `book` | Booking / "10 // Let's Talk Growth" | Free strategy call form (FormSubmit) with success state |
| 12 | `.cta-section` | Final CTA | "Your Competitors Are Already Online. Are You?" closing pitch |
| 13 | `footer` | Footer | Columns, newsletter, fineprint, privacy modal trigger |

---

## 5. Component Primitives to Build (shadcn-based)

- `Button` variants: `primary` (gradient pill), `secondary` (glass pill), `ghost` (nav)
- `Badge` / `SectionTag` (eyebrow pill with numbered prefix)
- `GradientText` wrapper (`.gradient-text`)
- `Card` glass surface w/ optional gradient border (`featured`)
- `StatTile`, `ResultCard` (color-coded value)
- `ProcessStep` (circular gradient number + title + caption)
- `PricingCard` (with optional ribbon)
- `TestimonialCard`, `FaqItem` (accordion), `BookingForm`
- Background layers: `<AmbientBackground />` rendering grid + nebula + vignette + cursor glow + particle canvas
