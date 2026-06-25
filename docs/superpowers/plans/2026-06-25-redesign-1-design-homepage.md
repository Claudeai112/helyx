# Redesign #1 — Design System Reset + Homepage Storefront — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the flashy WebGL/animation aesthetic with a clean, light-first, professional medical/biotech storefront, reframe the brand as a peptide research supply company, and build the homepage as the shop.

**Architecture:** Rebuild the design system (light clinical tokens + Inter/IBM Plex Sans), then rebuild chrome (static logo, header, footer), components (clean product/stack cards, dependency-free Reveal, minimal client cart store), and the homepage sections — keeping the build green at every step — then delete the now-unreferenced WebGL/GSAP/Lenis stack and drop its dependencies last.

**Tech Stack:** Next.js 16 App Router, React 19, TailwindCSS v4, TypeScript, Prisma 7 + Postgres (existing catalog), Vitest, Playwright (headless verification only).

## Global Constraints

- **Light-first clinical palette:** background `#FFFFFF`, surface `#F7F8FA`, foreground `#1A2230`, muted-foreground `#5B6675`, border `#E6E9EE`, primary (medical blue) `#1E5CA8` (hover `#184E8F`), primary-foreground `#FFFFFF`, footer slate `#10151E`. Keep the shadcn token NAMES; only change values.
- **Fonts:** body **Inter**, headings **IBM Plex Sans** (both `next/font/google`). Sentence case, minimal capitalization.
- **Motion allowed ONLY:** page-load + on-scroll fade-ins (Intersection Observer), card load-ins, button hover, page transitions. **Forbidden:** animated backgrounds, glow, particles, custom cursor, parallax/scroll scenes, continuous motion. Logo is static. Respect `prefers-reduced-motion`.
- **Compliance (research-supply model):** copy is educational/research-framed, NO medical/therapeutic claims, NO self-administration/dosing/injection/cycle language, NO consultation/prescription/provider language. The RUO disclaimer string is exactly: `"For research use only. Not for human consumption. Products are intended for laboratory and research purposes."`
- **Compliance guard (inverted):** `test/compliance-copy.test.ts` now FORBIDS (case-insensitive) these substrings anywhere in `app/`/`components/`/`lib/`: `"for human use"`, `"intended for human"`, `"inject yourself"`, `"how to inject"`, `"your dose"`, `"dose yourself"`, `"weight loss results"`, `"cure "`, `"treats "`, `"consult your doctor"`, `"prescription required"`. And asserts the RUO disclaimer is present in the DisclaimerBar.
- **No access code / authorization gate.** Checkout is open standard ecommerce (cart/checkout/payment are a later spec). The old access-code engine is left dormant.
- **Brand name:** "Helyx Peptides".
- **Imports:** `@/` alias; UI uses `cn` from `@/lib/utils`, Base UI `Button`.
- **Keep the build green every task.** Delete old files only after nothing references them (grep first).
- **Commit** after each task's tests pass.

---

## File Structure

```
app/globals.css            # rewrite: light clinical tokens; remove glow/vignette/keyframes
app/layout.tsx             # reset: remove WebGL/animation infra; Inter+IBM Plex; CartProvider; metadata
components/brand/helyx-logo.tsx   # rewrite: static wordmark + simple mark
components/reveal.tsx       # rewrite: dependency-free IntersectionObserver fade-in
components/ui/{button,badge,price-display,disclaimer-bar}.tsx  # restyle + RUO copy
components/cart/cart-provider.tsx # NEW: client cart context (localStorage) + useCart
components/navbar.tsx       # rebuild: clean light header + nav + cart count
components/footer.tsx       # rebuild: slate footer + legal + signup + RUO fine print
components/commerce/{product-card,stack-card}.tsx  # rebuild: clean + Add to cart
components/sections/_shared.tsx   # restyle: clean SectionShell/SectionHeader (no gradient/glow)
components/sections/home/*.tsx    # NEW: featured-glp1, product-grid, stacks, bulk, education, signup
app/page.tsx               # rebuild: homepage = shop (8 sections)
lib/cart-store.ts          # NEW: pure cart math/types used by the provider
lib/seo.ts                 # reframe Organization to research supply
test/*                     # token, reveal, cart, compliance, card tests
DELETED LAST (Task 12): components/webgl/*, ambient-background, lenis-provider,
  custom-cursor, page-transition, scroll-stage, scroll-timeline, magnetic-button,
  split-heading, tilt-card, lib/gsap.ts, agency sections (ads-work, portfolio,
  process, services, results, cta); deps three/@react-three*/gsap/@gsap/react/
  lenis/split-type.
```

---

## Task 1: Light clinical design tokens

**Files:**
- Modify: `app/globals.css`
- Test: `test/design-tokens.test.ts`

**Interfaces:**
- Produces: `:root` CSS custom properties with the light-clinical values from Global Constraints, consumed by every component via the existing `@theme inline` mappings.

- [ ] **Step 1: Failing test**

`test/design-tokens.test.ts`:
```ts
import { readFileSync } from "node:fs";
import { describe, it, expect } from "vitest";
const css = readFileSync("app/globals.css", "utf8");
describe("design tokens", () => {
  it("uses the light clinical palette", () => {
    expect(css).toMatch(/--background:\s*#FFFFFF/i);
    expect(css).toMatch(/--foreground:\s*#1A2230/i);
    expect(css).toMatch(/--primary:\s*#1E5CA8/i);
    expect(css).toMatch(/--border:\s*#E6E9EE/i);
  });
  it("drops the old glowy teal/dark base", () => {
    expect(css).not.toMatch(/#28e0c8/i);
    expect(css).not.toMatch(/--background:\s*#050510/i);
  });
});
```

- [ ] **Step 2: Run — fails** (`npx vitest run test/design-tokens.test.ts`).

- [ ] **Step 3: Rewrite the token block**

In `app/globals.css`, replace the `:root` theme block (the dark "Heman Peptide" tokens around lines 88–107) with:
```css
:root {
  --background: #FFFFFF;
  --foreground: #1A2230;
  --card: #FFFFFF;
  --card-foreground: #1A2230;
  --popover: #FFFFFF;
  --popover-foreground: #1A2230;
  --primary: #1E5CA8;
  --primary-foreground: #FFFFFF;
  --secondary: #F7F8FA;
  --secondary-foreground: #1A2230;
  --muted: #F7F8FA;
  --muted-foreground: #5B6675;
  --accent: #EAF1F9;
  --accent-foreground: #1E5CA8;
  --destructive: #B42318;
  --border: #E6E9EE;
  --input: #E6E9EE;
  --ring: #1E5CA8;
  --surface: #F7F8FA;
  --footer: #10151E;
  --radius: 0.625rem;
}
```
Also: remove the glow/box-shadow "glow" utilities, the radial vignette helpers, the `--color-brand-*`/`--color-nova-*` glow values (set any kept names to neutral), and the continuous keyframe utilities (nebula, marquee, logo-spin, pulse) that only the deleted components used. Keep the Tailwind imports, the `@theme inline` token-name mappings, the fade-in-up keyframe (still allowed), and base `body { background/color }`. Set `body` to `font-sans` (Inter).

- [ ] **Step 4: Run — passes.** Then `npx vitest run` (full suite stays green — token change only) and `npx tsc --noEmit`.

- [ ] **Step 5: Commit**

```bash
git add app/globals.css test/design-tokens.test.ts
git commit -m "feat: light clinical design tokens"
```

---

## Task 2: Layout reset — fonts, chrome, metadata

**Files:**
- Modify: `app/layout.tsx`
- Test: `test/brand.test.ts` (update)

**Interfaces:**
- Consumes: `Navbar`, `Footer` (existing; rebuilt later). Produces a clean `<body>` shell (no WebGL/animation infra), Inter + IBM Plex Sans font variables, research-supply metadata.

- [ ] **Step 1: Update the brand test (failing)**

In `test/brand.test.ts`, assert the new metadata + that the infra imports are gone:
```ts
it("uses research-supply metadata and removes the animation infra", () => {
  const layout = readFileSync("app/layout.tsx", "utf8");
  expect(layout).toContain("Helyx Peptides");
  expect(layout).toMatch(/research suppl/i);
  expect(layout).not.toMatch(/GlobalWebglBackground|AmbientBackground|LenisProvider|CustomCursor|PageTransition|ScrollTimeline/);
});
```

- [ ] **Step 2: Run — fails.**

- [ ] **Step 3: Rewrite `app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Inter, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CartProvider } from "@/components/cart/cart-provider";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const plex = IBM_Plex_Sans({
  variable: "--font-plex",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "Helyx Peptides — Peptide Research Supplies", template: "%s | Helyx Peptides" },
  description:
    "Helyx Peptides is a professional peptide research supply company offering high purity research peptides for laboratory and research use.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${plex.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
```
Map `--font-plex` to a heading utility in `globals.css` `@theme inline`: `--font-heading: var(--font-plex);` and `--font-sans: var(--font-inter);`.

> Note: `CartProvider`, the rebuilt `Navbar`/`Footer` arrive in later tasks; this task may temporarily import the existing `Navbar`/`Footer`. If `CartProvider` does not exist yet, create a tiny passthrough stub now and flesh it out in Task 6 — but the plan orders Task 6 (CartProvider) BEFORE this is verified end-to-end; implement Task 2's layout edits and proceed (build is verified at Task 6 once CartProvider exists). If build breaks here on the missing import, add the stub `export function CartProvider({children}){return <>{children}</>}` and replace it in Task 6.

- [ ] **Step 4: Run the brand test — passes.** (Full build deferred until CartProvider exists in Task 6.)

- [ ] **Step 5: Commit**

```bash
git add app/layout.tsx test/brand.test.ts
git commit -m "feat: reset root layout — clean shell, Inter+Plex, research-supply metadata"
```

---

## Task 3: Static Helyx logo

**Files:**
- Modify: `components/brand/helyx-logo.tsx`
- Test: `test/components/helyx-logo.test.tsx`

**Interfaces:**
- Produces: `<HelyxLogo className? />` — a static SVG wordmark "Helyx Peptides" + a simple medical-blue hexagon mark. No animation, no "use client".

- [ ] **Step 1: Failing test**

`test/components/helyx-logo.test.tsx`:
```tsx
// @vitest-environment jsdom
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { HelyxLogo } from "@/components/brand/helyx-logo";
describe("HelyxLogo", () => {
  it("renders a static accessible logo with no motion", () => {
    const { container } = render(<HelyxLogo />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("aria-label")).toMatch(/helyx/i);
    expect(container.innerHTML).not.toMatch(/animate|motion/i);
  });
});
```

- [ ] **Step 2: Run — fails.**

- [ ] **Step 3: Rewrite `components/brand/helyx-logo.tsx`**

```tsx
export function HelyxLogo({ className }: { className?: string }) {
  return (
    <span className={className} aria-label="Helyx Peptides">
      <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden className="inline-block align-middle">
        {/* simple hexagon mark in medical blue */}
        <path
          d="M14 2.5l10 5.75v11.5L14 25.5 4 19.75V8.25L14 2.5z"
          fill="none"
          stroke="#1E5CA8"
          strokeWidth="2"
          strokelinejoin="round"
        />
        <circle cx="14" cy="14" r="3.2" fill="#1E5CA8" />
      </svg>
      <span className="ml-2 align-middle font-heading text-[1.05rem] font-semibold tracking-tight text-foreground">
        Helyx <span className="text-muted-foreground">Peptides</span>
      </span>
    </span>
  );
}
```

- [ ] **Step 4: Run — passes.**

- [ ] **Step 5: Commit**

```bash
git add components/brand/helyx-logo.tsx test/components/helyx-logo.test.tsx
git commit -m "feat: static Helyx Peptides logo"
```

---

## Task 4: Dependency-free Reveal

**Files:**
- Modify: `components/reveal.tsx`
- Test: `test/components/reveal.test.tsx`

**Interfaces:**
- Consumes: nothing (no gsap/lenis). Produces `<Reveal delay? className?>{children}</Reveal>` — fades/translates children in once when scrolled into view via IntersectionObserver; respects `prefers-reduced-motion` (renders visible immediately). Same call signature used by existing sections.

- [ ] **Step 1: Failing test**

`test/components/reveal.test.tsx`:
```tsx
// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
beforeEach(() => {
  // jsdom has no IntersectionObserver
  vi.stubGlobal("IntersectionObserver", class {
    constructor(cb: (e: { isIntersecting: boolean; target: Element }[]) => void) { this.cb = cb; }
    cb: (e: { isIntersecting: boolean; target: Element }[]) => void;
    observe(el: Element) { this.cb([{ isIntersecting: true, target: el }]); }
    disconnect() {}
    unobserve() {}
  });
});
import { Reveal } from "@/components/reveal";
describe("Reveal", () => {
  it("renders children and becomes visible", () => {
    render(<Reveal><p>hello research</p></Reveal>);
    expect(screen.getByText("hello research")).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run — fails** (current Reveal imports `@/lib/gsap`).

- [ ] **Step 3: Rewrite `components/reveal.tsx`**

```tsx
"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Reveal({
  children, delay = 0, className = "",
}: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }),
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-all duration-500 ease-out motion-reduce:transition-none",
        shown ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
        className,
      )}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 4: Run — passes.**

- [ ] **Step 5: Commit**

```bash
git add components/reveal.tsx test/components/reveal.test.tsx
git commit -m "feat: dependency-free IntersectionObserver Reveal"
```

---

## Task 5: UI primitives restyle + compliance guard inversion

**Files:**
- Modify: `components/ui/button.tsx`, `components/ui/badge.tsx`, `components/ui/price-display.tsx`, `components/ui/disclaimer-bar.tsx`
- Rewrite: `test/compliance-copy.test.ts`
- Test: `test/components/disclaimer-bar.test.tsx` (update)

**Interfaces:**
- Produces: clean `Button` (medical-blue primary, neutral secondary/ghost/outline), `Badge`, `PriceDisplay`, and `DisclaimerBar` whose `COMPLIANCE_DISCLAIMER` is the RUO string.

- [ ] **Step 1: Rewrite the compliance guard (failing)**

`test/compliance-copy.test.ts` — keep the recursive `app`/`components`/`lib` scan, replace the FORBIDDEN list with the inverted set from Global Constraints, and add an RUO-present assertion:
```ts
const FORBIDDEN = [
  "for human use", "intended for human", "inject yourself", "how to inject",
  "your dose", "dose yourself", "weight loss results", "cure ", "treats ",
  "consult your doctor", "prescription required",
];
// ...existing recursive scan over app/components/lib asserting offenders === []...
it("ships the research-use disclaimer", () => {
  const bar = readFileSync("components/ui/disclaimer-bar.tsx", "utf8").toLowerCase();
  expect(bar).toContain("for research use only");
  expect(bar).toContain("not for human consumption");
});
```

- [ ] **Step 2: Run — fails** (old disclaimer still has prescription copy; old forbidden phrases present).

- [ ] **Step 3: Rewrite `components/ui/disclaimer-bar.tsx`**

```tsx
import { cn } from "@/lib/utils";

export const COMPLIANCE_DISCLAIMER =
  "For research use only. Not for human consumption. Products are intended for " +
  "laboratory and research purposes.";

export function DisclaimerBar({ className }: { className?: string }) {
  return (
    <p className={cn("text-xs leading-relaxed text-muted-foreground", className)}>
      {COMPLIANCE_DISCLAIMER}
    </p>
  );
}
```
Update `test/components/disclaimer-bar.test.tsx` to assert "for research use only" present and that the old prescription sentence is gone.

- [ ] **Step 4: Restyle Button/Badge/PriceDisplay**

In `components/ui/button.tsx`, set the `default` variant to the medical-blue solid (`bg-primary text-primary-foreground hover:bg-[#184E8F]`), `outline` to `border-border bg-background hover:bg-secondary`, `secondary` to `bg-secondary text-secondary-foreground hover:bg-[#EEF1F5]`, `ghost` to `hover:bg-secondary`; keep sizes. `Badge`: `bg-accent text-accent-foreground` default, `outline` `border-border text-muted-foreground`. `PriceDisplay`: keep logic; clean type (`text-foreground` price, `text-muted-foreground` strike, small accent savings).

- [ ] **Step 5: Run — passes** (`npx vitest run test/compliance-copy.test.ts test/components/disclaimer-bar.test.tsx`). Then full `npx vitest run`.

> If the compliance scan flags an OLD file still containing prescription/forbidden copy (e.g. legacy product pages or seed data with "consult"/"prescription required"), fix those strings to research-framed wording as part of this task — the guard scans the whole tree.

- [ ] **Step 6: Commit**

```bash
git add components/ui test/compliance-copy.test.ts test/components/disclaimer-bar.test.tsx
git commit -m "feat: clean UI primitives + RUO disclaimer + inverted compliance guard"
```

---

## Task 6: Client cart store + provider

**Files:**
- Create: `lib/cart-store.ts`, `components/cart/cart-provider.tsx`
- Test: `test/cart-store.test.ts`

**Interfaces:**
- Produces:
  - `lib/cart-store.ts`: type `CartItem = { variantId: string; slug: string; name: string; unitPriceCents: number; quantity: number }`; pure `addToCart(items, item)`, `removeFromCart(items, variantId)`, `cartCount(items)`, `cartSubtotalCents(items)`.
  - `components/cart/cart-provider.tsx`: `CartProvider` (persists to `localStorage` key `helyx_cart`) + `useCart()` → `{ items, add, remove, count, subtotalCents }`.

- [ ] **Step 1: Failing test (pure store)**

`test/cart-store.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { addToCart, removeFromCart, cartCount, cartSubtotalCents } from "@/lib/cart-store";
const a = { variantId: "v1", slug: "bpc-157", name: "BPC-157", unitPriceCents: 5900, quantity: 1 };
describe("cart store", () => {
  it("adds and merges quantities by variant", () => {
    let items = addToCart([], a);
    items = addToCart(items, a);
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(2);
    expect(cartCount(items)).toBe(2);
    expect(cartSubtotalCents(items)).toBe(11800);
  });
  it("removes by variant", () => {
    const items = removeFromCart(addToCart([], a), "v1");
    expect(items).toHaveLength(0);
  });
});
```

- [ ] **Step 2: Run — fails.**

- [ ] **Step 3: Implement `lib/cart-store.ts`**

```ts
export type CartItem = { variantId: string; slug: string; name: string; unitPriceCents: number; quantity: number };

export function addToCart(items: CartItem[], item: CartItem): CartItem[] {
  const existing = items.find((i) => i.variantId === item.variantId);
  if (existing) {
    return items.map((i) => (i.variantId === item.variantId ? { ...i, quantity: i.quantity + item.quantity } : i));
  }
  return [...items, item];
}
export function removeFromCart(items: CartItem[], variantId: string): CartItem[] {
  return items.filter((i) => i.variantId !== variantId);
}
export function cartCount(items: CartItem[]): number {
  return items.reduce((n, i) => n + i.quantity, 0);
}
export function cartSubtotalCents(items: CartItem[]): number {
  return items.reduce((s, i) => s + i.unitPriceCents * i.quantity, 0);
}
```

- [ ] **Step 4: Run — passes.**

- [ ] **Step 5: Implement `components/cart/cart-provider.tsx`**

```tsx
"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { addToCart, removeFromCart, cartCount, cartSubtotalCents, type CartItem } from "@/lib/cart-store";

type CartCtx = { items: CartItem[]; add: (i: CartItem) => void; remove: (id: string) => void; count: number; subtotalCents: number };
const Ctx = createContext<CartCtx | null>(null);
const KEY = "helyx_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); if (raw) setItems(JSON.parse(raw)); } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
  }, [items]);
  const value: CartCtx = {
    items,
    add: (i) => setItems((cur) => addToCart(cur, i)),
    remove: (id) => setItems((cur) => removeFromCart(cur, id)),
    count: cartCount(items),
    subtotalCents: cartSubtotalCents(items),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export function useCart(): CartCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used within CartProvider");
  return c;
}
```

- [ ] **Step 6: Run full suite + build**

Run: `npx vitest run && npx tsc --noEmit && npm run build`
Expected: green (CartProvider now exists, so layout from Task 2 builds).

- [ ] **Step 7: Commit**

```bash
git add lib/cart-store.ts components/cart/cart-provider.tsx test/cart-store.test.ts
git commit -m "feat: client cart store + provider"
```

---

## Task 7: Header (Navbar)

**Files:**
- Modify: `components/navbar.tsx`
- Test: `test/components/navbar.test.tsx`

**Interfaces:**
- Consumes: `HelyxLogo`, `useCart` (count). Produces a clean light sticky header with the nav links and a cart count.

- [ ] **Step 1: Failing test**

`test/components/navbar.test.tsx`:
```tsx
// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CartProvider } from "@/components/cart/cart-provider";
import { Navbar } from "@/components/navbar";
describe("Navbar", () => {
  it("renders brand + research-supply nav, no consultation links", () => {
    render(<CartProvider><Navbar /></CartProvider>);
    expect(screen.getByText(/helyx/i)).toBeTruthy();
    for (const label of [/shop/i, /glp.?1/i, /healing/i, /fat loss/i, /stacks/i, /bulk/i, /ambassador/i, /faq/i]) {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    }
    expect(screen.queryByText(/consultation/i)).toBeNull();
  });
});
```

- [ ] **Step 2: Run — fails.**

- [ ] **Step 3: Rebuild `components/navbar.tsx`**

Clean, light, sticky, bottom border, max-width container. Implement as a `"use client"` component (uses `useCart`):
```tsx
"use client";
import Link from "next/link";
import { useState } from "react";
import { HelyxLogo } from "@/components/brand/helyx-logo";
import { useCart } from "@/components/cart/cart-provider";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/category/glp-1", label: "GLP-1" },
  { href: "/category/healing", label: "Healing" },
  { href: "/category/fat-loss", label: "Fat Loss" },
  { href: "/stacks", label: "Stacks" },
  { href: "/bulk", label: "Bulk Orders" },
  { href: "/ambassador", label: "Ambassador" },
  { href: "/faq", label: "FAQ" },
];

export function Navbar() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
        <Link href="/" className="shrink-0"><HelyxLogo /></Link>
        <nav className="hidden items-center gap-6 lg:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/account" className="hidden text-sm text-muted-foreground hover:text-foreground sm:block">Account</Link>
          <Link href="/cart" className="relative text-sm font-medium text-foreground">
            Cart
            {count > 0 && (
              <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs text-primary-foreground">{count}</span>
            )}
          </Link>
          <button type="button" aria-label="Menu" className="lg:hidden" onClick={() => setOpen((o) => !o)}>
            <span className="block h-0.5 w-5 bg-foreground" /><span className="mt-1 block h-0.5 w-5 bg-foreground" /><span className="mt-1 block h-0.5 w-5 bg-foreground" />
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-border bg-background px-6 py-4 lg:hidden">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="block py-2 text-sm text-muted-foreground hover:text-foreground" onClick={() => setOpen(false)}>{n.label}</Link>
          ))}
        </nav>
      )}
    </header>
  );
}
```
(Category routes `/category/healing` and `/category/fat-loss` rely on the existing category slugs; `/bulk`, `/ambassador`, `/account`, `/faq` may not exist yet — links are fine, those pages are later specs. Verify the seed category slugs match `glp-1`, `healing`, `fat-loss`.)

- [ ] **Step 4: Run test — passes.** `npx tsc --noEmit` clean.

- [ ] **Step 5: Commit**

```bash
git add components/navbar.tsx test/components/navbar.test.tsx
git commit -m "feat: clean light header with cart count"
```

---

## Task 8: Footer

**Files:**
- Modify: `components/footer.tsx`
- Test: `test/components/footer.test.tsx`

**Interfaces:**
- Consumes: `EmailCapture`, `DisclaimerBar`. Produces a slate footer with link columns, legal links, signup, and the RUO fine print.

- [ ] **Step 1: Failing test**

`test/components/footer.test.tsx`:
```tsx
// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Footer } from "@/components/footer";
describe("Footer", () => {
  it("shows legal links and the research-use disclaimer", () => {
    render(<Footer />);
    expect(screen.getByText(/terms/i)).toBeTruthy();
    expect(screen.getByText(/privacy/i)).toBeTruthy();
    expect(screen.getByText(/for research use only/i)).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run — fails.**

- [ ] **Step 3: Rebuild `components/footer.tsx`**

Server component, slate background (`bg-[var(--footer)] text-white/80`), max-width container, columns (Shop categories / Company / Legal), `<EmailCapture source="footer" />`, and `<DisclaimerBar className="mt-8 text-white/50" />`. Legal links: `/legal/terms`, `/legal/privacy`, `/legal/refund`, `/legal/shipping`. Use `font-heading` for column titles. Keep it simple and clean. (If `EmailCapture` styling clashes on dark, pass a `className` or wrap; keep it readable.)

- [ ] **Step 4: Run test — passes.** `npx tsc --noEmit` clean.

- [ ] **Step 5: Commit**

```bash
git add components/footer.tsx test/components/footer.test.tsx
git commit -m "feat: clean slate footer with legal + RUO fine print"
```

---

## Task 9: Product card + Stack card (clean, Add to cart)

**Files:**
- Modify: `components/commerce/product-card.tsx`, `components/commerce/stack-card.tsx`
- Test: `test/components/product-card.test.tsx` (update)

**Interfaces:**
- Consumes: `useCart` (add), `PriceDisplay`, `Button`. `ProductCardData` (existing shape) gains `variantId` so Add-to-cart knows what to add.
- Produces: clean cards with image area, name, one-line research descriptor, price, and an **Add to cart** button (no consultation CTA).

- [ ] **Step 1: Update the product-card test (failing)**

`test/components/product-card.test.tsx`:
```tsx
// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CartProvider } from "@/components/cart/cart-provider";
import { ProductCard } from "@/components/commerce/product-card";
describe("ProductCard", () => {
  it("links to the product, shows price, and an Add to cart action (no consultation)", () => {
    render(<CartProvider><ProductCard product={{
      slug: "bpc-157", name: "BPC-157", subtitle: "Research peptide",
      status: "ACTIVE", minPriceCents: 5900, minVariantId: "v1",
    }} /></CartProvider>);
    expect(screen.getByRole("link", { name: /bpc-157/i }).getAttribute("href")).toBe("/product/bpc-157");
    expect(screen.getByText("$59.00")).toBeTruthy();
    expect(screen.getByRole("button", { name: /add to cart/i })).toBeTruthy();
    expect(screen.queryByText(/consultation/i)).toBeNull();
  });
});
```

- [ ] **Step 2: Run — fails.**

- [ ] **Step 3: Rebuild `components/commerce/product-card.tsx`**

```tsx
"use client";
import Link from "next/link";
import { PriceDisplay } from "@/components/ui/price-display";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-provider";

export type ProductCardData = {
  slug: string; name: string; subtitle: string;
  status: "ACTIVE" | "COMING_SOON" | "WAITLIST"; imageUrl?: string | null;
  minPriceCents: number; minCompareAtCents?: number | null; minVariantId: string;
};

export function ProductCard({ product }: { product: ProductCardData }) {
  const { add } = useCart();
  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-sm">
      <Link href={`/product/${product.slug}`} className="block aspect-[4/3] bg-secondary" aria-label={product.name}>
        {/* image placeholder area — real imagery later */}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <Link href={`/product/${product.slug}`} className="font-heading text-base font-semibold text-foreground hover:text-primary">{product.name}</Link>
        <p className="mt-1 text-sm text-muted-foreground">{product.subtitle}</p>
        <div className="mt-3"><PriceDisplay priceCents={product.minPriceCents} compareAtCents={product.minCompareAtCents} /></div>
        <Button
          className="mt-4 w-full"
          onClick={() => add({ variantId: product.minVariantId, slug: product.slug, name: product.name, unitPriceCents: product.minPriceCents, quantity: 1 })}
        >
          Add to cart
        </Button>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Rebuild `components/commerce/stack-card.tsx`** similarly: image area, name, contents list, `PriceDisplay` (bundle + compare-at savings), Add-to-cart button (adds the stack as a line via its slug/variant; use the stack slug as `variantId` prefix `stack:<slug>`). Keep `"use client"` and `useCart`.

- [ ] **Step 5: Update `lib/product-view.ts`** `toProductCardData` to also emit `minVariantId` (the id of the cheapest variant). Update its unit test accordingly.

- [ ] **Step 6: Run** `npx vitest run` + `npx tsc --noEmit` — green.

- [ ] **Step 7: Commit**

```bash
git add components/commerce lib/product-view.ts test/components/product-card.test.tsx test/product-view.test.ts
git commit -m "feat: clean product + stack cards with Add to cart"
```

---

## Task 10: Homepage sections

**Files:**
- Modify: `components/sections/_shared.tsx`
- Create: `components/sections/home/featured-glp1.tsx`, `product-grid.tsx`, `stacks.tsx`, `bulk.tsx`, `education.tsx`, `signup.tsx`
- Test: `test/components/home-sections.test.tsx`

**Interfaces:**
- Consumes: catalog query results (passed in as props from the page — sections are presentational where possible), `ProductCard`, `StackCard`, `Reveal`, `EmailCapture`, `DisclaimerBar`.
- Produces the six homepage section components, each accepting its data as props.

- [ ] **Step 1: Restyle `_shared.tsx`** — `SectionShell` (clean padded `<section>` max-w-1200), `SectionHeader` (plain heading + subtext, NO gradient text/glow). Remove `GradientText` glow; export a plain `SectionHeader({ tag, title, description })`.

- [ ] **Step 2: Failing test for a representative section**

`test/components/home-sections.test.tsx`:
```tsx
// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CartProvider } from "@/components/cart/cart-provider";
import { EducationSection } from "@/components/sections/home/education";
describe("home sections", () => {
  it("education section is research-framed and claim-free", () => {
    render(<CartProvider><EducationSection /></CartProvider>);
    const text = document.body.textContent?.toLowerCase() ?? "";
    expect(text).toMatch(/research/);
    for (const banned of ["weight loss results", "cure ", "inject yourself"]) expect(text).not.toContain(banned);
  });
});
```

- [ ] **Step 3: Run — fails.**

- [ ] **Step 4: Implement the six sections** (presentational; real Tailwind, clean light style, `Reveal` wrappers, sentence-case headings):
  - `FeaturedGlp1({ products })` — a highlighted row/banner of the 4 GLP-1 products via `ProductCard`.
  - `ProductGrid({ products })` — responsive grid of `ProductCard`.
  - `StacksSection({ stacks })` — grid of `StackCard`.
  - `BulkSection()` — concise research-bulk pitch + `Button` link to `/bulk`.
  - `EducationSection()` — 3 research-framed info cards (handling, storage, purity/COA), no claims.
  - `SignupSection()` — `EmailCapture` + an SMS field (visual; full opt-in later), clean card.

- [ ] **Step 5: Run the section test — passes.** `npx tsc --noEmit` clean.

- [ ] **Step 6: Commit**

```bash
git add components/sections/_shared.tsx components/sections/home test/components/home-sections.test.tsx
git commit -m "feat: clean homepage section components"
```

---

## Task 11: Homepage assembly

**Files:**
- Modify: `app/page.tsx`
- Test: `test/homepage-copy.test.ts` (update to research-supply guard)

**Interfaces:**
- Consumes: `getAllProducts`, `getAllStacks`, `getAllCategories` (existing), the home sections, `toProductCardData`, stack pricing helpers, `DisclaimerBar`.

- [ ] **Step 1: Update homepage copy guard (failing)**

`test/homepage-copy.test.ts` — scan `app/page.tsx` source for the inverted forbidden list (no human-use/therapeutic/self-admin phrases); assert it imports the home sections.

- [ ] **Step 2: Run — fails.**

- [ ] **Step 3: Rebuild `app/page.tsx`**

```tsx
export const dynamic = "force-dynamic";
import { getAllProducts, getAllStacks } from "@/lib/catalog";
import { toProductCardData, stackComponentSumCents } from "@/lib/product-view";
import { stackPriceCents } from "@/lib/money";
import { FeaturedGlp1 } from "@/components/sections/home/featured-glp1";
import { ProductGrid } from "@/components/sections/home/product-grid";
import { StacksSection } from "@/components/sections/home/stacks";
import { BulkSection } from "@/components/sections/home/bulk";
import { EducationSection } from "@/components/sections/home/education";
import { SignupSection } from "@/components/sections/home/signup";
import { DisclaimerBar } from "@/components/ui/disclaimer-bar";

export default async function Home() {
  let products: Awaited<ReturnType<typeof getAllProducts>> = [];
  let stacks: Awaited<ReturnType<typeof getAllStacks>> = [];
  try { [products, stacks] = await Promise.all([getAllProducts(), getAllStacks()]); } catch {}
  const cards = products.map(toProductCardData);
  const glp1 = cards.filter((c) => ["tirzepatide", "semaglutide", "retatrutide", "cagrilintide"].includes(c.slug));
  const stackCards = stacks.map((s) => {
    const sum = stackComponentSumCents(s.items);
    return { slug: s.slug, name: s.name, tagline: s.tagline, priceCents: stackPriceCents(sum, s.discountBps), compareAtCents: sum, items: s.items };
  });
  return (
    <>
      <FeaturedGlp1 products={glp1} />
      <ProductGrid products={cards} />
      <StacksSection stacks={stackCards} />
      <BulkSection />
      <EducationSection />
      <SignupSection />
      <section className="mx-auto max-w-[1200px] px-6 py-8"><DisclaimerBar /></section>
    </>
  );
}
```
(`toProductCardData` now includes `minVariantId` from Task 9; ensure `slug` is present for the GLP-1 filter.)

- [ ] **Step 4: Run** `npx vitest run` + `npx tsc --noEmit` — green.

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx test/homepage-copy.test.ts
git commit -m "feat: homepage as the shop (clean storefront)"
```

---

## Task 12: Demolish the old animation stack

**Files:** delete + dependency removal (see below). No new tests; relies on build + suite staying green.

- [ ] **Step 1: Confirm nothing references the targets**

Run greps; each must return no hits from OUTSIDE the file/dir being deleted:
```bash
grep -rln "components/webgl\|ambient-background\|lenis-provider\|custom-cursor\|page-transition\|scroll-timeline\|scroll-stage\|magnetic-button\|split-heading\|tilt-card\|lib/gsap\|sections/ads-work\|sections/portfolio\|sections/process\|sections/services\|sections/results\|sections/cta" app components | sort -u
```
For any remaining importer, replace its usage first (e.g. swap a `MagneticButton` for the plain `Button`, a `SplitHeading` for a normal heading). The existing `app/product`, `app/stacks`, `app/category` pages use `SectionShell`/`SectionHeader` from `_shared` (kept) — verify they don't import deleted files.

- [ ] **Step 2: Delete the files**

```bash
git rm -r components/webgl
git rm components/ambient-background.tsx components/lenis-provider.tsx components/custom-cursor.tsx \
  components/page-transition.tsx components/scroll-stage.tsx components/magnetic-button.tsx \
  components/split-heading.tsx components/tilt-card.tsx lib/gsap.ts \
  components/sections/ads-work.tsx components/sections/portfolio.tsx components/sections/process.tsx \
  components/sections/services.tsx components/sections/results.tsx components/sections/cta.tsx
```
(Skip any that a Step-1 importer still needs until rewired.)

- [ ] **Step 2b: Remove now-orphaned CSS animation utilities**

After deleting `hero.tsx`/`ambient-background.tsx` etc., the keyframe utilities
kept in Task 1 are now unreferenced. Remove from `app/globals.css`: `@keyframes
marquee` + `.marquee-track`, `@keyframes logo-spin` + `.logo-ring`, `@keyframes
pulse-dot` + `.pulse-dot`, `@keyframes nebulaFloat` + `.nebula-blob*`. Grep
`app components` for each class name first; only remove once unreferenced. Keep
`fade-in-up`.

- [ ] **Step 3: Drop the dependencies**

```bash
npm uninstall three @react-three/fiber @react-three/drei @react-three/postprocessing gsap @gsap/react lenis split-type @types/three
```

- [ ] **Step 4: Verify green**

Run: `npx vitest run && npx tsc --noEmit && npm run lint && npm run build`
Expected: all pass; bundle no longer includes three/gsap/lenis. If tsc/build flags a lingering import, remove/replace it.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: remove WebGL/GSAP/Lenis animation stack and deps"
```

---

## Task 13: SEO reframe + final verification

**Files:**
- Modify: `lib/seo.ts`
- Test: existing `test/seo.test.ts` (update name/desc)

- [ ] **Step 1:** Update `organizationJsonLd()` name stays "Helyx Peptides"; add a research-supply `description`. Update `test/seo.test.ts` expectations. Keep sitemap/robots.

- [ ] **Step 2:** `npx vitest run` — all pass.
- [ ] **Step 3:** `npx tsc --noEmit` — clean.
- [ ] **Step 4:** `npm run lint` — clean.
- [ ] **Step 5:** `npm run build` — succeeds.
- [ ] **Step 6: Real-browser check (the WebGL lesson).** Build + start on an alt port; with a temporary `playwright` dev-dep, headless-load `/` and assert **zero** console errors / pageerrors / CSP violations and the homepage content renders. Remove the temp dep and restore `package-lock.json` after. Paste the result in the report.
- [ ] **Step 7: Commit**

```bash
git add lib/seo.ts test/seo.test.ts
git commit -m "feat: research-supply SEO; verify suite/build/browser"
```

---

## Self-Review (coverage map)

- Spec §1 (research-supply framing, RUO, no access code, inverted guard) → Tasks 5, 11, and copy across 7–11.
- Spec §3 (design system: light tokens, fonts, motion) → Tasks 1, 2, 4.
- Spec §4 (layout reset, deps removed, static logo, header, footer) → Tasks 2, 3, 7, 8, 12.
- Spec §5 (homepage 8 sections) → Tasks 10, 11 (header/footer are global from 7/8).
- Spec §6 (components) → Tasks 3, 4, 5, 9, 10.
- Spec §7 (minimal cart store + header count) → Tasks 6, 7, 9.
- Spec §9 (SEO reframe) → Task 13.
- Spec §10 (testing incl. headless zero-error) → every task TDD; Task 13 final verification.
- Spec §11 success criteria → satisfied across Tasks 1–13.
