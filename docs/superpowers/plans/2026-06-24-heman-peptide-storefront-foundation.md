# Heman Peptide — Storefront Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a premium dark-biotech storefront for a prescription-telehealth peptide brand where every product is browsable and educational, and every purchase path routes to a consultation gate (no direct-to-consumer sales).

**Architecture:** Next.js 16 App Router + React 19 server components for catalog, Prisma/PostgreSQL data layer, Stripe wired in test mode but gated behind a prescription state, Tailwind v4 design system reusing the repo's existing GSAP/Three/Framer animation infrastructure. Pure helper logic (pricing, cart math, validation) is isolated and unit-tested; pages compose tested units.

**Tech Stack:** Next.js 16.2.3, React 19, TailwindCSS v4, TypeScript, Prisma + PostgreSQL, Stripe (test mode), Zod, Framer Motion, GSAP, Three.js/R3F, Base UI, Vitest.

## Global Constraints

- **Next.js 16 async params:** dynamic route `params` and `searchParams` are Promises — always `await params`. (Verify against `node_modules/next/dist/docs/01-app/` before writing routing code, per `AGENTS.md`.)
- **Compliance copy (verbatim, sitewide):** Prescription framing only. The disclaimer string is exactly: `"Prescription products require an online consultation and approval by a licensed healthcare provider. Individual eligibility is determined by the provider. This site does not provide medical advice."`
- **FORBIDDEN copy:** the strings "research purposes only", "research use only", and "not for human consumption" must never appear in any rendered component. A test enforces this.
- **No direct purchase:** no product or variant exposes an "add to cart → pay" path that can complete. Every purchase CTA is "Start Consultation". Checkout cannot reach a paid state without a linked `Prescription` (enforced in Spec #2; the gate must reject here).
- **No public dosage calculator, no "100-vial" bulk pricing** in this spec.
- **Pricing:** seed prices are configurable placeholder MSRPs in cents. No competitor scraping.
- **Money is integer cents** everywhere. Never floats.
- **Imports:** use `@/` path alias. UI primitives use `cn` from `@/lib/utils`, `cva` for variants, Base UI primitives — match existing `components/ui/button.tsx` patterns.
- **Commit** after every task's tests pass.

---

## File Structure

```
prisma/
  schema.prisma              # data model
  seed.ts                    # categories, peptides, variants, stacks
lib/
  utils.ts                   # (exists) cn()
  db.ts                      # Prisma client singleton
  money.ts                   # cents formatting + pricing helpers
  catalog.ts                 # product/category/stack query layer
  cart.ts                    # cart math (pure) + server actions
  validation.ts              # Zod schemas
  seo.ts                     # JSON-LD builders
  stripe.ts                  # Stripe client + gated checkout scaffold
components/
  brand/heman-logo.tsx       # replaces nova-logo
  ui/badge.tsx, price-display.tsx, disclaimer-bar.tsx
  commerce/product-card.tsx, category-tile.tsx, consult-cta.tsx,
           variant-selector.tsx, stack-card.tsx
  marketing/email-capture.tsx, testimonial.tsx, faq.tsx
  sections/  (rebrand existing homepage sections)
app/
  page.tsx                   # homepage
  shop/page.tsx
  category/[slug]/page.tsx
  product/[slug]/page.tsx
  stacks/page.tsx, stacks/[slug]/page.tsx
  cart/page.tsx
  legal/{terms,privacy,refund,shipping,medical-disclaimer}/page.tsx
  api/checkout/route.ts      # gated Stripe session scaffold
  sitemap.ts, robots.ts
test setup: vitest.config.ts, test/setup.ts
```

---

## Task 1: Tooling — Vitest, Prisma, Stripe, Zod install & config

**Files:**
- Modify: `package.json` (scripts + deps)
- Create: `vitest.config.ts`, `test/setup.ts`, `.env.example`
- Create: `lib/db.ts`

**Interfaces:**
- Produces: `prisma` client singleton exported from `lib/db.ts` as `export const prisma`.

- [ ] **Step 1: Install dependencies**

```bash
npm install prisma @prisma/client stripe @stripe/stripe-js zod
npm install -D vitest @vitejs/plugin-react vite-tsconfig-paths
```

- [ ] **Step 2: Add scripts to package.json**

In `package.json` `"scripts"`, add:
```json
"test": "vitest run",
"test:watch": "vitest",
"db:migrate": "prisma migrate dev",
"db:seed": "prisma db seed",
"db:generate": "prisma generate"
```
And add at top level:
```json
"prisma": { "seed": "tsx prisma/seed.ts" }
```
Install the seed runner: `npm install -D tsx`.

- [ ] **Step 3: Create vitest.config.ts**

```ts
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    setupFiles: ["./test/setup.ts"],
    globals: true,
  },
});
```

- [ ] **Step 4: Create test/setup.ts**

```ts
// Global test setup. Intentionally minimal for now.
export {};
```

- [ ] **Step 5: Create .env.example**

```
DATABASE_URL="postgresql://user:pass@localhost:5432/heman?schema=public"
STRIPE_SECRET_KEY="sk_test_xxx"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_xxx"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

- [ ] **Step 6: Create lib/db.ts (Prisma singleton)**

```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

- [ ] **Step 7: Verify vitest runs**

Run: `npx vitest run`
Expected: exits 0 with "No test files found" (or similar). Tooling works.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json vitest.config.ts test/setup.ts .env.example lib/db.ts
git commit -m "chore: add prisma, stripe, zod, vitest tooling"
```

---

## Task 2: Prisma schema

**Files:**
- Create: `prisma/schema.prisma`
- Test: `test/schema.test.ts`

**Interfaces:**
- Produces: models `Category, Product, ProductVariant, Stack, StackItem, User, Cart, CartItem, Order, OrderItem, Consult, Prescription, EmailCapture`; enums `ProductStatus {ACTIVE, COMING_SOON, WAITLIST}`, `UserRole {CUSTOMER, PROVIDER, ADMIN}`, `OrderStatus {PENDING_CONSULT, AWAITING_PAYMENT, PAID, FULFILLED, CANCELLED}`, `ConsultStatus {SUBMITTED, IN_REVIEW, APPROVED, DENIED}`.

- [ ] **Step 1: Write the failing test**

`test/schema.test.ts`:
```ts
import { readFileSync } from "node:fs";
import { describe, it, expect } from "vitest";

const schema = readFileSync("prisma/schema.prisma", "utf8");

describe("prisma schema", () => {
  it("defines all core models", () => {
    for (const m of [
      "model Category", "model Product", "model ProductVariant",
      "model Stack", "model User", "model Cart", "model Order",
      "model Consult", "model Prescription", "model EmailCapture",
    ]) expect(schema).toContain(m);
  });
  it("gates orders with a consult/prescription status", () => {
    expect(schema).toContain("PENDING_CONSULT");
    expect(schema).toContain("model Prescription");
  });
  it("stores money as integer cents", () => {
    expect(schema).toMatch(/priceCents\s+Int/);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/schema.test.ts`
Expected: FAIL — cannot read `prisma/schema.prisma`.

- [ ] **Step 3: Write the schema**

`prisma/schema.prisma`:
```prisma
generator client { provider = "prisma-client-js" }
datasource db { provider = "postgresql"; url = env("DATABASE_URL") }

enum ProductStatus { ACTIVE COMING_SOON WAITLIST }
enum UserRole { CUSTOMER PROVIDER ADMIN }
enum OrderStatus { PENDING_CONSULT AWAITING_PAYMENT PAID FULFILLED CANCELLED }
enum ConsultStatus { SUBMITTED IN_REVIEW APPROVED DENIED }

model Category {
  id          String    @id @default(cuid())
  slug        String    @unique
  name        String
  description String
  heroCopy    String?
  order       Int       @default(0)
  products    Product[]
  createdAt   DateTime  @default(now())
}

model Product {
  id            String           @id @default(cuid())
  slug          String           @unique
  name          String
  subtitle      String
  categoryId    String
  category      Category         @relation(fields: [categoryId], references: [id])
  researchOverview String        @db.Text
  benefits      String[]
  reconstitution String         @db.Text
  status        ProductStatus    @default(ACTIVE)
  isRx          Boolean          @default(true)
  seoTitle      String?
  seoDescription String?
  imageUrl      String?
  variants      ProductVariant[]
  stackItems    StackItem[]
  relatedSlugs  String[]
  createdAt     DateTime         @default(now())
}

model ProductVariant {
  id                  String   @id @default(cuid())
  productId           String
  product             Product  @relation(fields: [productId], references: [id])
  label               String   // e.g. "10mg vial"
  sku                 String   @unique
  priceCents          Int
  compareAtCents      Int?
  subscriptionEligible Boolean @default(false)
  cartItems           CartItem[]
  orderItems          OrderItem[]
}

model Stack {
  id           String      @id @default(cuid())
  slug         String      @unique
  name         String
  tagline      String
  overview     String      @db.Text
  protocol     String      @db.Text
  discountBps  Int         @default(0) // basis points off component sum
  items        StackItem[]
}

model StackItem {
  id        String  @id @default(cuid())
  stackId   String
  stack     Stack   @relation(fields: [stackId], references: [id])
  productId String
  product   Product @relation(fields: [productId], references: [id])
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  role      UserRole @default(CUSTOMER)
  carts     Cart[]
  orders    Order[]
  createdAt DateTime @default(now())
}

model Cart {
  id        String     @id @default(cuid())
  userId    String?
  user      User?      @relation(fields: [userId], references: [id])
  items     CartItem[]
  createdAt DateTime   @default(now())
}

model CartItem {
  id        String         @id @default(cuid())
  cartId    String
  cart      Cart           @relation(fields: [cartId], references: [id])
  variantId String
  variant   ProductVariant @relation(fields: [variantId], references: [id])
  quantity  Int            @default(1)
}

model Order {
  id            String      @id @default(cuid())
  userId        String?
  user          User?       @relation(fields: [userId], references: [id])
  status        OrderStatus @default(PENDING_CONSULT)
  items         OrderItem[]
  consultId     String?     @unique
  consult       Consult?    @relation(fields: [consultId], references: [id])
  prescriptionId String?    @unique
  prescription  Prescription? @relation(fields: [prescriptionId], references: [id])
  createdAt     DateTime    @default(now())
}

model OrderItem {
  id            String         @id @default(cuid())
  orderId       String
  order         Order          @relation(fields: [orderId], references: [id])
  variantId     String
  variant       ProductVariant @relation(fields: [variantId], references: [id])
  quantity      Int
  unitPriceCents Int
}

model Consult {
  id        String        @id @default(cuid())
  email     String
  status    ConsultStatus @default(SUBMITTED)
  order     Order?
  createdAt DateTime      @default(now())
}

model Prescription {
  id        String   @id @default(cuid())
  consultId String
  order     Order?
  createdAt DateTime @default(now())
}

model EmailCapture {
  id         String   @id @default(cuid())
  email      String
  phone      String?
  source     String
  smsConsent Boolean  @default(false)
  createdAt  DateTime @default(now())
  @@index([email])
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run test/schema.test.ts`
Expected: PASS.

- [ ] **Step 5: Generate client + create migration**

Run: `npx prisma generate && npx prisma migrate dev --name init`
Expected: migration created, client generated. (Requires a reachable `DATABASE_URL`; if no DB is available locally, run `npx prisma validate` instead and note the migration as a follow-up.)

- [ ] **Step 6: Commit**

```bash
git add prisma/ test/schema.test.ts
git commit -m "feat: prisma schema for rx storefront"
```

---

## Task 3: Money & pricing helpers

**Files:**
- Create: `lib/money.ts`
- Test: `test/money.test.ts`

**Interfaces:**
- Produces:
  - `formatCents(cents: number): string` → `"$129.00"`
  - `stackPriceCents(componentCentsSum: number, discountBps: number): number`
  - `savingsCents(compareAtCents: number, priceCents: number): number`
  - `percentOff(compareAtCents: number, priceCents: number): number` (rounded int %)

- [ ] **Step 1: Write the failing test**

`test/money.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { formatCents, stackPriceCents, savingsCents, percentOff } from "@/lib/money";

describe("money helpers", () => {
  it("formats cents as USD", () => {
    expect(formatCents(12900)).toBe("$129.00");
    expect(formatCents(0)).toBe("$0.00");
    expect(formatCents(5)).toBe("$0.05");
  });
  it("applies a basis-point discount to a stack sum", () => {
    expect(stackPriceCents(20000, 1500)).toBe(17000); // 15% off
    expect(stackPriceCents(10000, 0)).toBe(10000);
  });
  it("computes savings and percent off", () => {
    expect(savingsCents(15000, 12000)).toBe(3000);
    expect(percentOff(15000, 12000)).toBe(20);
    expect(percentOff(0, 0)).toBe(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/money.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write the implementation**

`lib/money.ts`:
```ts
export function formatCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function stackPriceCents(componentCentsSum: number, discountBps: number): number {
  return Math.round(componentCentsSum * (1 - discountBps / 10000));
}

export function savingsCents(compareAtCents: number, priceCents: number): number {
  return Math.max(0, compareAtCents - priceCents);
}

export function percentOff(compareAtCents: number, priceCents: number): number {
  if (compareAtCents <= 0) return 0;
  return Math.round((savingsCents(compareAtCents, priceCents) / compareAtCents) * 100);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run test/money.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/money.ts test/money.test.ts
git commit -m "feat: money + pricing helpers"
```

---

## Task 4: Cart math (pure)

**Files:**
- Create: `lib/cart.ts`
- Test: `test/cart.test.ts`

**Interfaces:**
- Produces:
  - type `CartLine = { variantId: string; quantity: number; unitPriceCents: number }`
  - `cartSubtotalCents(lines: CartLine[]): number`
  - `cartItemCount(lines: CartLine[]): number`
  - `canCheckout(order: { prescriptionId: string | null }): boolean` — the GATE.

- [ ] **Step 1: Write the failing test**

`test/cart.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { cartSubtotalCents, cartItemCount, canCheckout } from "@/lib/cart";

const lines = [
  { variantId: "a", quantity: 2, unitPriceCents: 12900 },
  { variantId: "b", quantity: 1, unitPriceCents: 9900 },
];

describe("cart math", () => {
  it("sums subtotal in cents", () => {
    expect(cartSubtotalCents(lines)).toBe(35700);
    expect(cartSubtotalCents([])).toBe(0);
  });
  it("counts items", () => {
    expect(cartItemCount(lines)).toBe(3);
  });
  it("BLOCKS checkout without an approved prescription", () => {
    expect(canCheckout({ prescriptionId: null })).toBe(false);
    expect(canCheckout({ prescriptionId: "rx_1" })).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/cart.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write the implementation**

`lib/cart.ts`:
```ts
export type CartLine = { variantId: string; quantity: number; unitPriceCents: number };

export function cartSubtotalCents(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.unitPriceCents * l.quantity, 0);
}

export function cartItemCount(lines: CartLine[]): number {
  return lines.reduce((n, l) => n + l.quantity, 0);
}

/** The compliance gate: an order may only proceed to payment with a linked prescription. */
export function canCheckout(order: { prescriptionId: string | null }): boolean {
  return order.prescriptionId !== null;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run test/cart.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/cart.ts test/cart.test.ts
git commit -m "feat: cart math + checkout gate"
```

---

## Task 5: Validation schemas (Zod)

**Files:**
- Create: `lib/validation.ts`
- Test: `test/validation.test.ts`

**Interfaces:**
- Produces: `emailCaptureSchema` (Zod) with `{ email: string; phone?: string; smsConsent: boolean; source: string }`; `parseEmailCapture(input): { ok: true; data } | { ok: false; error: string }`.

- [ ] **Step 1: Write the failing test**

`test/validation.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { parseEmailCapture } from "@/lib/validation";

describe("email capture validation", () => {
  it("accepts a valid email", () => {
    const r = parseEmailCapture({ email: "a@b.com", smsConsent: false, source: "footer" });
    expect(r.ok).toBe(true);
  });
  it("rejects a bad email", () => {
    const r = parseEmailCapture({ email: "nope", smsConsent: false, source: "footer" });
    expect(r.ok).toBe(false);
  });
  it("requires sms consent boolean when phone present", () => {
    const r = parseEmailCapture({ email: "a@b.com", phone: "5551234567", smsConsent: true, source: "popup" });
    expect(r.ok).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/validation.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write the implementation**

`lib/validation.ts`:
```ts
import { z } from "zod";

export const emailCaptureSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(7).max(20).optional(),
  smsConsent: z.boolean(),
  source: z.string().min(1),
});

export type EmailCaptureInput = z.infer<typeof emailCaptureSchema>;

export function parseEmailCapture(input: unknown):
  | { ok: true; data: EmailCaptureInput }
  | { ok: false; error: string } {
  const r = emailCaptureSchema.safeParse(input);
  return r.success
    ? { ok: true, data: r.data }
    : { ok: false, error: r.error.issues[0]?.message ?? "Invalid input" };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run test/validation.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/validation.ts test/validation.test.ts
git commit -m "feat: zod validation for email capture"
```

---

## Task 6: Seed data — categories, peptides, variants, stacks

**Files:**
- Create: `prisma/seed.ts`
- Create: `lib/seed-data.ts` (the catalog content, importable + testable)
- Test: `test/seed-data.test.ts`

**Interfaces:**
- Consumes: enums from schema (Task 2).
- Produces: `categories`, `products`, `stacks` arrays from `lib/seed-data.ts`. Each product: `{ slug, name, subtitle, categorySlug, researchOverview, benefits[], reconstitution, status, variants: [{label, sku, priceCents, compareAtCents?, subscriptionEligible}], relatedSlugs[] }`.

- [ ] **Step 1: Write the failing test**

`test/seed-data.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { categories, products, stacks } from "@/lib/seed-data";

const FORBIDDEN = ["research purposes only", "research use only", "not for human consumption"];

describe("seed catalog", () => {
  it("has the eight categories", () => {
    expect(categories.map((c) => c.slug)).toEqual(
      expect.arrayContaining([
        "glp-1", "fat-loss", "recovery", "muscle-growth",
        "longevity", "cognitive", "healing", "stacks",
      ]),
    );
  });
  it("seeds all featured peptides", () => {
    const slugs = products.map((p) => p.slug);
    for (const s of [
      "tirzepatide", "semaglutide", "retatrutide", "cagrilintide", "tesamorelin",
      "aod-9604", "bpc-157", "tb-500", "ghk-cu", "ipamorelin", "cjc-1295",
      "mots-c", "nad-plus", "dsip",
    ]) expect(slugs).toContain(s);
  });
  it("marks every product as Rx with a category and pricing", () => {
    for (const p of products) {
      expect(p.categorySlug).toBeTruthy();
      expect(p.variants.length).toBeGreaterThan(0);
      for (const v of p.variants) expect(v.priceCents).toBeGreaterThan(0);
    }
  });
  it("contains NO forbidden non-compliant copy", () => {
    const blob = JSON.stringify({ products, stacks, categories }).toLowerCase();
    for (const phrase of FORBIDDEN) expect(blob).not.toContain(phrase);
  });
  it("defines the four branded stacks", () => {
    expect(stacks.map((s) => s.slug)).toEqual(
      expect.arrayContaining(["wolverine", "glp-1-advanced", "recovery", "longevity"]),
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/seed-data.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write lib/seed-data.ts**

Create `lib/seed-data.ts` exporting `categories`, `products`, `stacks`. Use this exact shape and content rules. Write compliant, educational, research-framed copy with **no efficacy guarantees** and **none of the forbidden phrases**. Provide all 14 products; the three below are the pattern to follow for the rest.

```ts
export type SeedVariant = {
  label: string; sku: string; priceCents: number;
  compareAtCents?: number; subscriptionEligible: boolean;
};
export type SeedProduct = {
  slug: string; name: string; subtitle: string; categorySlug: string;
  researchOverview: string; benefits: string[]; reconstitution: string;
  status: "ACTIVE" | "COMING_SOON" | "WAITLIST";
  variants: SeedVariant[]; relatedSlugs: string[];
};
export type SeedCategory = { slug: string; name: string; description: string; order: number; heroCopy?: string };
export type SeedStack = {
  slug: string; name: string; tagline: string; overview: string;
  protocol: string; discountBps: number; productSlugs: string[];
};

export const categories: SeedCategory[] = [
  { slug: "glp-1", name: "GLP-1 Peptides", order: 1,
    description: "Metabolic peptides studied for appetite and weight regulation.",
    heroCopy: "Provider-guided GLP-1 protocols." },
  { slug: "fat-loss", name: "Fat Loss", order: 2,
    description: "Peptides studied in the context of lipid metabolism." },
  { slug: "recovery", name: "Recovery", order: 3,
    description: "Peptides studied for tissue recovery and repair." },
  { slug: "muscle-growth", name: "Muscle Growth", order: 4,
    description: "Growth-hormone-axis peptides studied for body composition." },
  { slug: "longevity", name: "Longevity", order: 5,
    description: "Peptides and cofactors studied in cellular-aging research." },
  { slug: "cognitive", name: "Cognitive Enhancement", order: 6,
    description: "Peptides studied for sleep and neurological function." },
  { slug: "healing", name: "Healing Peptides", order: 7,
    description: "Peptides studied for repair and regeneration pathways." },
  { slug: "stacks", name: "Stacks & Bundles", order: 8,
    description: "Provider-reviewed combinations at a bundle price." },
];

export const products: SeedProduct[] = [
  {
    slug: "tirzepatide", name: "Tirzepatide", subtitle: "Dual GIP/GLP-1 receptor agonist",
    categorySlug: "glp-1",
    researchOverview:
      "Tirzepatide is a dual glucose-dependent insulinotropic polypeptide (GIP) and " +
      "glucagon-like peptide-1 (GLP-1) receptor agonist studied extensively for glycemic " +
      "regulation and body-weight management. Eligibility and dosing are determined by a " +
      "licensed provider during your consultation.",
    benefits: [
      "Studied for appetite and satiety signaling",
      "Investigated for weight-management protocols",
      "Dual-receptor mechanism of action",
    ],
    reconstitution:
      "If prescribed, your provider and pharmacy supply exact reconstitution and dosing " +
      "instructions with your medication. Follow only those instructions.",
    status: "ACTIVE",
    variants: [
      { label: "10mg vial", sku: "HP-TIRZ-10", priceCents: 17900, compareAtCents: 19900, subscriptionEligible: true },
      { label: "20mg vial", sku: "HP-TIRZ-20", priceCents: 29900, compareAtCents: 33900, subscriptionEligible: true },
    ],
    relatedSlugs: ["semaglutide", "retatrutide", "cagrilintide"],
  },
  {
    slug: "bpc-157", name: "BPC-157", subtitle: "Body-protection compound",
    categorySlug: "healing",
    researchOverview:
      "BPC-157 is a synthetic peptide studied in preclinical models for its role in " +
      "tissue-repair and angiogenic pathways. Availability is subject to provider approval.",
    benefits: [
      "Studied for tendon and soft-tissue repair pathways",
      "Investigated for gut-lining research models",
      "Frequently paired with TB-500 in recovery research",
    ],
    reconstitution:
      "If prescribed, follow the reconstitution and dosing instructions provided by your " +
      "pharmacy with your medication.",
    status: "ACTIVE",
    variants: [
      { label: "5mg vial", sku: "HP-BPC-5", priceCents: 5900, compareAtCents: 6900, subscriptionEligible: true },
      { label: "10mg vial", sku: "HP-BPC-10", priceCents: 9900, compareAtCents: 11900, subscriptionEligible: true },
    ],
    relatedSlugs: ["tb-500", "ghk-cu"],
  },
  {
    slug: "nad-plus", name: "NAD+", subtitle: "Nicotinamide adenine dinucleotide",
    categorySlug: "longevity",
    researchOverview:
      "NAD+ is a coenzyme central to cellular energy metabolism and is studied widely in " +
      "the context of cellular-aging and mitochondrial research. Provider approval required.",
    benefits: [
      "Central coenzyme in cellular energy metabolism",
      "Studied in mitochondrial-function research",
      "Investigated in cellular-aging protocols",
    ],
    reconstitution:
      "If prescribed, follow the instructions supplied by your pharmacy with your medication.",
    status: "ACTIVE",
    variants: [
      { label: "500mg vial", sku: "HP-NAD-500", priceCents: 8900, subscriptionEligible: true },
    ],
    relatedSlugs: ["mots-c", "ghk-cu"],
  },
  // Remaining products — same shape, compliant copy, real placeholder MSRPs:
  // semaglutide (glp-1), retatrutide (glp-1), cagrilintide (glp-1),
  // tesamorelin (fat-loss), aod-9604 (fat-loss), tb-500 (recovery),
  // ghk-cu (healing), ipamorelin (muscle-growth), cjc-1295 (muscle-growth),
  // mots-c (longevity), dsip (cognitive).
];

export const stacks: SeedStack[] = [
  { slug: "wolverine", name: "Wolverine Stack", tagline: "Recovery & repair, paired.",
    overview: "BPC-157 and TB-500 — the two most-studied recovery peptides, bundled.",
    protocol: "Your provider sets the protocol upon approval.",
    discountBps: 1500, productSlugs: ["bpc-157", "tb-500"] },
  { slug: "glp-1-advanced", name: "GLP-1 Advanced Stack", tagline: "Next-generation metabolic support.",
    overview: "Retatrutide paired with Cagrilintide for advanced metabolic protocols.",
    protocol: "Provider-directed dosing only.",
    discountBps: 1500, productSlugs: ["retatrutide", "cagrilintide"] },
  { slug: "recovery", name: "Recovery Stack", tagline: "Repair & regeneration.",
    overview: "BPC-157 with GHK-Cu for tissue and skin-repair research.",
    protocol: "Provider-directed dosing only.",
    discountBps: 1500, productSlugs: ["bpc-157", "ghk-cu"] },
  { slug: "longevity", name: "Longevity Stack", tagline: "Cellular energy & aging.",
    overview: "MOTS-c with NAD+ for cellular-energy and longevity research.",
    protocol: "Provider-directed dosing only.",
    discountBps: 1500, productSlugs: ["mots-c", "nad-plus"] },
];
```

Fill in the 11 remaining products following the three complete examples exactly (compliant copy, 1–2 variants each, realistic placeholder MSRPs in cents, sensible `relatedSlugs`).

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run test/seed-data.test.ts`
Expected: PASS (all 14 products present, no forbidden copy).

- [ ] **Step 5: Write prisma/seed.ts**

`prisma/seed.ts` — upserts categories, then products+variants (look up `categoryId` by slug), then stacks+stackItems (look up `productId` by slug):
```ts
import { PrismaClient } from "@prisma/client";
import { categories, products, stacks } from "../lib/seed-data";

const prisma = new PrismaClient();

async function main() {
  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, description: c.description, order: c.order, heroCopy: c.heroCopy },
      create: { slug: c.slug, name: c.name, description: c.description, order: c.order, heroCopy: c.heroCopy },
    });
  }
  for (const p of products) {
    const category = await prisma.category.findUniqueOrThrow({ where: { slug: p.categorySlug } });
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: { name: p.name, subtitle: p.subtitle, categoryId: category.id,
        researchOverview: p.researchOverview, benefits: p.benefits, reconstitution: p.reconstitution,
        status: p.status, relatedSlugs: p.relatedSlugs },
      create: { slug: p.slug, name: p.name, subtitle: p.subtitle, categoryId: category.id,
        researchOverview: p.researchOverview, benefits: p.benefits, reconstitution: p.reconstitution,
        status: p.status, isRx: true, relatedSlugs: p.relatedSlugs },
    });
    for (const v of p.variants) {
      await prisma.productVariant.upsert({
        where: { sku: v.sku },
        update: { label: v.label, priceCents: v.priceCents, compareAtCents: v.compareAtCents,
          subscriptionEligible: v.subscriptionEligible, productId: product.id },
        create: { label: v.label, sku: v.sku, priceCents: v.priceCents, compareAtCents: v.compareAtCents,
          subscriptionEligible: v.subscriptionEligible, productId: product.id },
      });
    }
  }
  for (const s of stacks) {
    const stack = await prisma.stack.upsert({
      where: { slug: s.slug },
      update: { name: s.name, tagline: s.tagline, overview: s.overview, protocol: s.protocol, discountBps: s.discountBps },
      create: { slug: s.slug, name: s.name, tagline: s.tagline, overview: s.overview, protocol: s.protocol, discountBps: s.discountBps },
    });
    await prisma.stackItem.deleteMany({ where: { stackId: stack.id } });
    for (const slug of s.productSlugs) {
      const product = await prisma.product.findUniqueOrThrow({ where: { slug } });
      await prisma.stackItem.create({ data: { stackId: stack.id, productId: product.id } });
    }
  }
}

main().then(() => prisma.$disconnect()).catch(async (e) => {
  console.error(e); await prisma.$disconnect(); process.exit(1);
});
```

- [ ] **Step 6: Run seed (if DB available)**

Run: `npx prisma db seed`
Expected: completes without error. (Skip if no local DB; note as follow-up.)

- [ ] **Step 7: Commit**

```bash
git add lib/seed-data.ts prisma/seed.ts test/seed-data.test.ts
git commit -m "feat: seed catalog data for all featured peptides + stacks"
```

---

## Task 7: Catalog query layer

**Files:**
- Create: `lib/catalog.ts`
- Test: `test/catalog.test.ts`

**Interfaces:**
- Consumes: `prisma` from `lib/db.ts`.
- Produces (all async, server-only): `getAllProducts()`, `getProductBySlug(slug)`, `getProductsByCategory(slug)`, `getAllCategories()`, `getStackBySlug(slug)`, `getAllStacks()`, `getRelatedProducts(slugs: string[])`. The test mocks `lib/db` so it runs without a DB.

- [ ] **Step 1: Write the failing test**

`test/catalog.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

const findMany = vi.fn();
const findUnique = vi.fn();
vi.mock("@/lib/db", () => ({
  prisma: {
    product: { findMany, findUnique },
    category: { findMany, findUnique },
    stack: { findMany, findUnique },
  },
}));

import { getAllProducts, getProductBySlug } from "@/lib/catalog";

beforeEach(() => { findMany.mockReset(); findUnique.mockReset(); });

describe("catalog queries", () => {
  it("getAllProducts returns products with variants", async () => {
    findMany.mockResolvedValue([{ slug: "tirzepatide", variants: [] }]);
    const res = await getAllProducts();
    expect(res[0].slug).toBe("tirzepatide");
    expect(findMany).toHaveBeenCalledWith(expect.objectContaining({ include: expect.any(Object) }));
  });
  it("getProductBySlug queries by unique slug", async () => {
    findUnique.mockResolvedValue({ slug: "bpc-157" });
    const res = await getProductBySlug("bpc-157");
    expect(res?.slug).toBe("bpc-157");
    expect(findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { slug: "bpc-157" } }));
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/catalog.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write the implementation**

`lib/catalog.ts`:
```ts
import "server-only";
import { prisma } from "@/lib/db";

const productInclude = { variants: true, category: true } as const;

export function getAllProducts() {
  return prisma.product.findMany({ include: productInclude, orderBy: { name: "asc" } });
}

export function getProductBySlug(slug: string) {
  return prisma.product.findUnique({ where: { slug }, include: productInclude });
}

export function getProductsByCategory(slug: string) {
  return prisma.product.findMany({
    where: { category: { slug } }, include: productInclude, orderBy: { name: "asc" },
  });
}

export function getAllCategories() {
  return prisma.category.findMany({ orderBy: { order: "asc" } });
}

export function getStackBySlug(slug: string) {
  return prisma.stack.findUnique({
    where: { slug }, include: { items: { include: { product: { include: { variants: true } } } } },
  });
}

export function getAllStacks() {
  return prisma.stack.findMany({ include: { items: { include: { product: true } } } });
}

export function getRelatedProducts(slugs: string[]) {
  return prisma.product.findMany({ where: { slug: { in: slugs } }, include: productInclude });
}
```

> Note: `server-only` makes the test import the mock; ensure `vi.mock("@/lib/db")` is hoisted (it is, via vitest). If `server-only` errors in the node test env, add `vi.mock("server-only", () => ({}))` at the top of the test.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run test/catalog.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/catalog.ts test/catalog.test.ts
git commit -m "feat: catalog query layer"
```

---

## Task 8: Design tokens + globals rebrand

**Files:**
- Modify: `app/globals.css` (color tokens for dark-biotech theme)
- Modify: `app/layout.tsx` (metadata → Heman Peptide)

**Interfaces:**
- Produces: CSS custom properties consumed by components (`--background`, `--foreground`, `--primary`, `--accent`, etc., dark-biotech values).

- [ ] **Step 1: Write the failing test**

`test/brand.test.ts`:
```ts
import { readFileSync } from "node:fs";
import { describe, it, expect } from "vitest";

describe("brand", () => {
  it("layout metadata names Heman Peptide, not Nova", () => {
    const layout = readFileSync("app/layout.tsx", "utf8");
    expect(layout).toContain("Heman Peptide");
    expect(layout).not.toContain("Nova Marketing");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/brand.test.ts`
Expected: FAIL — still says "Nova Marketing".

- [ ] **Step 3: Update layout metadata**

In `app/layout.tsx`, replace the `metadata` export:
```ts
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Heman Peptide | Provider-Guided Peptide Therapy",
    template: "%s | Heman Peptide",
  },
  description:
    "Premium, provider-guided peptide protocols. GLP-1, recovery, longevity and " +
    "performance peptides — prescribed and fulfilled through licensed partners.",
};
```

- [ ] **Step 4: Update design tokens**

In `app/globals.css`, set the dark-biotech palette in the `:root`/theme token block (match the existing token names already in the file — read it first). Base `#050510`, elevated surfaces `#0b0b18`, foreground near-white, a single luminous accent (clinical teal `#28e0c8` suggested), muted borders. Keep existing animation/vignette infra untouched.

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run test/brand.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add app/globals.css app/layout.tsx test/brand.test.ts
git commit -m "feat: dark-biotech design tokens + brand metadata"
```

---

## Task 9: UI primitives — Badge, PriceDisplay, DisclaimerBar

**Files:**
- Create: `components/ui/badge.tsx`, `components/ui/price-display.tsx`, `components/ui/disclaimer-bar.tsx`
- Test: `test/components/price-display.test.tsx`, `test/components/disclaimer-bar.test.tsx`

**Interfaces:**
- Consumes: `formatCents`, `percentOff` from `lib/money` (Task 3).
- Produces:
  - `<PriceDisplay priceCents compareAtCents? />` — renders formatted price, strikethrough compare-at, and "% off" badge when compare-at > price.
  - `<DisclaimerBar />` — renders the exact compliance string from Global Constraints.
  - `<Badge variant?>` — small label.

- [ ] **Step 1: Add jsdom + testing-library**

```bash
npm install -D jsdom @testing-library/react @testing-library/dom
```
In `vitest.config.ts`, the `test` block: add `environmentMatchGlobs: [["test/components/**", "jsdom"]]` (keep default `node` elsewhere).

- [ ] **Step 2: Write the failing tests**

`test/components/price-display.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PriceDisplay } from "@/components/ui/price-display";

describe("PriceDisplay", () => {
  it("shows the price", () => {
    render(<PriceDisplay priceCents={12900} />);
    expect(screen.getByText("$129.00")).toBeTruthy();
  });
  it("shows percent off when compareAt is higher", () => {
    render(<PriceDisplay priceCents={12000} compareAtCents={15000} />);
    expect(screen.getByText("$120.00")).toBeTruthy();
    expect(screen.getByText(/20% off/i)).toBeTruthy();
  });
});
```

`test/components/disclaimer-bar.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { DisclaimerBar } from "@/components/ui/disclaimer-bar";

describe("DisclaimerBar", () => {
  it("renders the exact compliance disclaimer", () => {
    render(<DisclaimerBar />);
    expect(
      screen.getByText(/Prescription products require an online consultation/i),
    ).toBeTruthy();
  });
  it("never uses forbidden research-only language", () => {
    const { container } = render(<DisclaimerBar />);
    expect(container.textContent?.toLowerCase()).not.toContain("not for human consumption");
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npx vitest run test/components/`
Expected: FAIL — modules not found.

- [ ] **Step 4: Implement the components**

`components/ui/price-display.tsx`:
```tsx
import { cn } from "@/lib/utils";
import { formatCents, percentOff } from "@/lib/money";

export function PriceDisplay({
  priceCents, compareAtCents, className,
}: { priceCents: number; compareAtCents?: number | null; className?: string }) {
  const showCompare = !!compareAtCents && compareAtCents > priceCents;
  return (
    <div className={cn("flex items-baseline gap-2", className)}>
      <span className="text-lg font-semibold text-foreground">{formatCents(priceCents)}</span>
      {showCompare && (
        <>
          <span className="text-sm text-muted-foreground line-through">
            {formatCents(compareAtCents!)}
          </span>
          <span className="rounded bg-primary/15 px-1.5 py-0.5 text-xs font-medium text-primary">
            {percentOff(compareAtCents!, priceCents)}% off
          </span>
        </>
      )}
    </div>
  );
}
```

`components/ui/disclaimer-bar.tsx`:
```tsx
import { cn } from "@/lib/utils";

export const COMPLIANCE_DISCLAIMER =
  "Prescription products require an online consultation and approval by a licensed " +
  "healthcare provider. Individual eligibility is determined by the provider. This site " +
  "does not provide medical advice.";

export function DisclaimerBar({ className }: { className?: string }) {
  return (
    <p className={cn("text-xs leading-relaxed text-muted-foreground", className)}>
      {COMPLIANCE_DISCLAIMER}
    </p>
  );
}
```

`components/ui/badge.tsx`:
```tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  { variants: { variant: {
    default: "bg-primary/15 text-primary",
    outline: "border border-border text-muted-foreground",
    muted: "bg-muted text-muted-foreground",
  } }, defaultVariants: { variant: "default" } },
);

export function Badge({ className, variant, ...props }:
  React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run test/components/`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add components/ui/ test/components/ vitest.config.ts package.json package-lock.json
git commit -m "feat: badge, price-display, disclaimer-bar primitives"
```

---

## Task 10: Commerce components — ProductCard, CategoryTile, ConsultCTA, VariantSelector

**Files:**
- Create: `components/commerce/product-card.tsx`, `category-tile.tsx`, `consult-cta.tsx`, `variant-selector.tsx`
- Test: `test/components/product-card.test.tsx`, `test/components/consult-cta.test.tsx`

**Interfaces:**
- Consumes: `PriceDisplay`, `Badge`. A serializable `ProductCardData = { slug; name; subtitle; status; imageUrl?; minPriceCents; minCompareAtCents? }`.
- Produces:
  - `<ProductCard product={ProductCardData} />` — links to `/product/[slug]`, shows price, "Rx" badge, status badge if not ACTIVE.
  - `<ConsultCTA productName status />` — the ONLY purchase action. Renders "Start Consultation" for ACTIVE; "Join Waitlist" for WAITLIST/COMING_SOON. Never renders "Add to Cart" wording.
  - `<VariantSelector variants onChange />` — client component selecting a variant.
  - `<CategoryTile category />` — links to `/category/[slug]`.

- [ ] **Step 1: Write the failing tests**

`test/components/consult-cta.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ConsultCTA } from "@/components/commerce/consult-cta";

describe("ConsultCTA", () => {
  it("prompts a consultation for active products", () => {
    render(<ConsultCTA productName="Tirzepatide" status="ACTIVE" />);
    expect(screen.getByRole("link", { name: /start consultation/i })).toBeTruthy();
  });
  it("shows waitlist for non-active products", () => {
    render(<ConsultCTA productName="Retatrutide" status="WAITLIST" />);
    expect(screen.getByText(/join waitlist/i)).toBeTruthy();
  });
  it("NEVER offers a direct add-to-cart purchase", () => {
    const { container } = render(<ConsultCTA productName="X" status="ACTIVE" />);
    expect(container.textContent?.toLowerCase()).not.toContain("add to cart");
    expect(container.textContent?.toLowerCase()).not.toContain("buy now");
  });
});
```

`test/components/product-card.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ProductCard } from "@/components/commerce/product-card";

describe("ProductCard", () => {
  it("links to the product page and shows price", () => {
    render(<ProductCard product={{
      slug: "bpc-157", name: "BPC-157", subtitle: "Body-protection compound",
      status: "ACTIVE", minPriceCents: 5900,
    }} />);
    const link = screen.getByRole("link", { name: /bpc-157/i });
    expect(link.getAttribute("href")).toBe("/product/bpc-157");
    expect(screen.getByText("$59.00")).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run test/components/product-card.test.tsx test/components/consult-cta.test.tsx`
Expected: FAIL — modules not found.

- [ ] **Step 3: Implement the components**

`components/commerce/consult-cta.tsx`:
```tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ConsultCTA({
  productName, status,
}: { productName: string; status: "ACTIVE" | "COMING_SOON" | "WAITLIST" }) {
  if (status === "ACTIVE") {
    return (
      <Button asChild size="lg">
        <Link href={`/consultation?product=${encodeURIComponent(productName)}`}>
          Start Consultation
        </Link>
      </Button>
    );
  }
  return (
    <Button asChild size="lg" variant="outline">
      <Link href={`/waitlist?product=${encodeURIComponent(productName)}`}>Join Waitlist</Link>
    </Button>
  );
}
```
> `/consultation` and `/waitlist` are handoff targets for Spec #2; in this spec they may be simple stub pages (see Task 15). The CTA contract is fixed now.

`components/commerce/product-card.tsx`:
```tsx
import Link from "next/link";
import { PriceDisplay } from "@/components/ui/price-display";
import { Badge } from "@/components/ui/badge";

export type ProductCardData = {
  slug: string; name: string; subtitle: string;
  status: "ACTIVE" | "COMING_SOON" | "WAITLIST"; imageUrl?: string | null;
  minPriceCents: number; minCompareAtCents?: number | null;
};

export function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col rounded-2xl border border-border bg-card/40 p-5 transition-colors hover:border-primary/40"
    >
      <div className="mb-4 flex items-center justify-between">
        <Badge>Rx</Badge>
        {product.status !== "ACTIVE" && <Badge variant="muted">Coming soon</Badge>}
      </div>
      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary">{product.name}</h3>
      <p className="mb-4 text-sm text-muted-foreground">{product.subtitle}</p>
      <div className="mt-auto">
        <PriceDisplay priceCents={product.minPriceCents} compareAtCents={product.minCompareAtCents} />
      </div>
    </Link>
  );
}
```

`components/commerce/variant-selector.tsx`:
```tsx
"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { formatCents } from "@/lib/money";

export type VariantOption = { id: string; label: string; priceCents: number };

export function VariantSelector({
  variants, onChange,
}: { variants: VariantOption[]; onChange?: (v: VariantOption) => void }) {
  const [selected, setSelected] = useState(variants[0]?.id);
  return (
    <div className="flex flex-wrap gap-2">
      {variants.map((v) => (
        <button
          key={v.id} type="button"
          onClick={() => { setSelected(v.id); onChange?.(v); }}
          className={cn(
            "rounded-lg border px-3 py-2 text-sm transition-colors",
            selected === v.id ? "border-primary text-primary" : "border-border text-muted-foreground",
          )}
        >
          {v.label} · {formatCents(v.priceCents)}
        </button>
      ))}
    </div>
  );
}
```

`components/commerce/category-tile.tsx`:
```tsx
import Link from "next/link";

export function CategoryTile({
  category,
}: { category: { slug: string; name: string; description: string } }) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="flex flex-col rounded-2xl border border-border bg-card/40 p-6 transition-colors hover:border-primary/40"
    >
      <h3 className="text-xl font-semibold text-foreground">{category.name}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{category.description}</p>
    </Link>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run test/components/product-card.test.tsx test/components/consult-cta.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/commerce/ test/components/product-card.test.tsx test/components/consult-cta.test.tsx
git commit -m "feat: commerce components (product card, consult CTA, variant selector)"
```

---

## Task 11: Catalog pages — /shop, /category/[slug], /product/[slug]

**Files:**
- Create: `app/shop/page.tsx`, `app/category/[slug]/page.tsx`, `app/product/[slug]/page.tsx`
- Create: `lib/product-view.ts` (maps a Prisma product → `ProductCardData`)
- Test: `test/product-view.test.ts`

**Interfaces:**
- Consumes: catalog queries (Task 7), `ProductCard`, `ConsultCTA`, `PriceDisplay`, `DisclaimerBar`, `VariantSelector`.
- Produces: `toProductCardData(product)` → `ProductCardData` (computes `minPriceCents`/`minCompareAtCents` from variants).

- [ ] **Step 1: Write the failing test**

`test/product-view.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { toProductCardData } from "@/lib/product-view";

describe("toProductCardData", () => {
  it("derives the minimum variant price", () => {
    const data = toProductCardData({
      slug: "x", name: "X", subtitle: "y", status: "ACTIVE", imageUrl: null,
      variants: [
        { priceCents: 9900, compareAtCents: 11900 },
        { priceCents: 5900, compareAtCents: 6900 },
      ],
    });
    expect(data.minPriceCents).toBe(5900);
    expect(data.minCompareAtCents).toBe(6900);
  });
  it("handles no variants", () => {
    const data = toProductCardData({
      slug: "x", name: "X", subtitle: "y", status: "ACTIVE", imageUrl: null, variants: [],
    });
    expect(data.minPriceCents).toBe(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/product-view.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement lib/product-view.ts**

```ts
import type { ProductCardData } from "@/components/commerce/product-card";

type VariantLike = { priceCents: number; compareAtCents?: number | null };
type ProductLike = {
  slug: string; name: string; subtitle: string;
  status: "ACTIVE" | "COMING_SOON" | "WAITLIST"; imageUrl?: string | null;
  variants: VariantLike[];
};

export function toProductCardData(p: ProductLike): ProductCardData {
  const cheapest = p.variants.reduce<VariantLike | null>(
    (min, v) => (min === null || v.priceCents < min.priceCents ? v : min), null,
  );
  return {
    slug: p.slug, name: p.name, subtitle: p.subtitle, status: p.status, imageUrl: p.imageUrl,
    minPriceCents: cheapest?.priceCents ?? 0,
    minCompareAtCents: cheapest?.compareAtCents ?? null,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run test/product-view.test.ts`
Expected: PASS.

- [ ] **Step 5: Implement the pages**

`app/shop/page.tsx` (server component):
```tsx
import { getAllProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/commerce/product-card";
import { DisclaimerBar } from "@/components/ui/disclaimer-bar";
import { toProductCardData } from "@/lib/product-view";

export const metadata = { title: "Shop Peptides" };

export default async function ShopPage() {
  const products = await getAllProducts();
  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      <h1 className="text-4xl font-semibold text-foreground">Shop Peptides</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Provider-guided peptide protocols. Every product requires a consultation.
      </p>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => <ProductCard key={p.slug} product={toProductCardData(p)} />)}
      </div>
      <DisclaimerBar className="mt-16" />
    </div>
  );
}
```

`app/category/[slug]/page.tsx` (note async params):
```tsx
import { notFound } from "next/navigation";
import { getProductsByCategory, getAllCategories } from "@/lib/catalog";
import { ProductCard } from "@/components/commerce/product-card";
import { DisclaimerBar } from "@/components/ui/disclaimer-bar";
import { toProductCardData } from "@/lib/product-view";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const categories = await getAllCategories();
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();
  const products = await getProductsByCategory(slug);
  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      <h1 className="text-4xl font-semibold text-foreground">{category.name}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{category.description}</p>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => <ProductCard key={p.slug} product={toProductCardData(p)} />)}
      </div>
      <DisclaimerBar className="mt-16" />
    </div>
  );
}
```

`app/product/[slug]/page.tsx`:
```tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, getRelatedProducts } from "@/lib/catalog";
import { ConsultCTA } from "@/components/commerce/consult-cta";
import { VariantSelector } from "@/components/commerce/variant-selector";
import { ProductCard } from "@/components/commerce/product-card";
import { DisclaimerBar } from "@/components/ui/disclaimer-bar";
import { Badge } from "@/components/ui/badge";
import { toProductCardData } from "@/lib/product-view";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return { title: product.seoTitle ?? product.name, description: product.seoDescription ?? product.subtitle };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const related = await getRelatedProducts(product.relatedSlugs);
  return (
    <div className="mx-auto max-w-5xl px-6 py-24">
      <div className="grid gap-12 lg:grid-cols-2">
        <div className="aspect-square rounded-3xl border border-border bg-card/40" />
        <div>
          <Badge>Rx · Prescription product</Badge>
          <h1 className="mt-4 text-4xl font-semibold text-foreground">{product.name}</h1>
          <p className="mt-2 text-lg text-muted-foreground">{product.subtitle}</p>
          <div className="mt-6">
            <VariantSelector variants={product.variants.map((v) => ({ id: v.id, label: v.label, priceCents: v.priceCents }))} />
          </div>
          <div className="mt-6"><ConsultCTA productName={product.name} status={product.status} /></div>
          <DisclaimerBar className="mt-6" />
        </div>
      </div>

      <section className="mt-16 max-w-2xl">
        <h2 className="text-2xl font-semibold text-foreground">Research overview</h2>
        <p className="mt-4 text-muted-foreground">{product.researchOverview}</p>
        <h3 className="mt-8 text-xl font-semibold text-foreground">Areas of study</h3>
        <ul className="mt-3 space-y-2 text-muted-foreground">
          {product.benefits.map((b) => <li key={b}>• {b}</li>)}
        </ul>
        <h3 className="mt-8 text-xl font-semibold text-foreground">Reconstitution & dosing</h3>
        <p className="mt-3 text-muted-foreground">{product.reconstitution}</p>
      </section>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-foreground">Frequently paired</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => <ProductCard key={p.slug} product={toProductCardData(p)} />)}
          </div>
        </section>
      )}
    </div>
  );
}
```

- [ ] **Step 6: Verify build/typecheck**

Run: `npx tsc --noEmit`
Expected: no type errors in new files. (If a reachable DB isn't configured, pages still typecheck.)

- [ ] **Step 7: Commit**

```bash
git add app/shop app/category app/product lib/product-view.ts test/product-view.test.ts
git commit -m "feat: catalog, category, and product detail pages"
```

---

## Task 12: Stacks pages

**Files:**
- Create: `app/stacks/page.tsx`, `app/stacks/[slug]/page.tsx`, `components/commerce/stack-card.tsx`
- Test: `test/stack-price.test.ts`

**Interfaces:**
- Consumes: `getAllStacks`, `getStackBySlug` (Task 7), `stackPriceCents` (Task 3), `ConsultCTA`.
- Produces: `stackComponentSumCents(items)` helper in `lib/product-view.ts` (min variant price per product, summed).

- [ ] **Step 1: Write the failing test**

`test/stack-price.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { stackComponentSumCents } from "@/lib/product-view";

describe("stackComponentSumCents", () => {
  it("sums the cheapest variant of each product", () => {
    const sum = stackComponentSumCents([
      { product: { variants: [{ priceCents: 5900 }, { priceCents: 9900 }] } },
      { product: { variants: [{ priceCents: 8900 }] } },
    ]);
    expect(sum).toBe(14800);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/stack-price.test.ts`
Expected: FAIL — `stackComponentSumCents` not exported.

- [ ] **Step 3: Add stackComponentSumCents to lib/product-view.ts**

Append:
```ts
type StackItemLike = { product: { variants: { priceCents: number }[] } };

export function stackComponentSumCents(items: StackItemLike[]): number {
  return items.reduce((sum, item) => {
    const cheapest = item.product.variants.reduce(
      (min, v) => Math.min(min, v.priceCents), Infinity);
    return sum + (Number.isFinite(cheapest) ? cheapest : 0);
  }, 0);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run test/stack-price.test.ts`
Expected: PASS.

- [ ] **Step 5: Implement stack-card + pages**

`components/commerce/stack-card.tsx`:
```tsx
import Link from "next/link";
import { PriceDisplay } from "@/components/ui/price-display";
import { Badge } from "@/components/ui/badge";

export function StackCard({ stack }: {
  stack: { slug: string; name: string; tagline: string; priceCents: number; compareAtCents: number };
}) {
  return (
    <Link href={`/stacks/${stack.slug}`}
      className="flex flex-col rounded-2xl border border-border bg-card/40 p-6 transition-colors hover:border-primary/40">
      <Badge>Bundle</Badge>
      <h3 className="mt-3 text-xl font-semibold text-foreground">{stack.name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{stack.tagline}</p>
      <div className="mt-4"><PriceDisplay priceCents={stack.priceCents} compareAtCents={stack.compareAtCents} /></div>
    </Link>
  );
}
```

`app/stacks/page.tsx`:
```tsx
import { getAllStacks } from "@/lib/catalog";
import { StackCard } from "@/components/commerce/stack-card";
import { DisclaimerBar } from "@/components/ui/disclaimer-bar";
import { stackComponentSumCents } from "@/lib/product-view";
import { stackPriceCents } from "@/lib/money";

export const metadata = { title: "Peptide Stacks" };

export default async function StacksPage() {
  const stacks = await getAllStacks();
  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      <h1 className="text-4xl font-semibold text-foreground">Peptide Stacks</h1>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stacks.map((s) => {
          const sum = stackComponentSumCents(s.items as never);
          return <StackCard key={s.slug} stack={{
            slug: s.slug, name: s.name, tagline: s.tagline,
            priceCents: stackPriceCents(sum, s.discountBps), compareAtCents: sum,
          }} />;
        })}
      </div>
      <DisclaimerBar className="mt-16" />
    </div>
  );
}
```

`app/stacks/[slug]/page.tsx`:
```tsx
import { notFound } from "next/navigation";
import { getStackBySlug } from "@/lib/catalog";
import { ConsultCTA } from "@/components/commerce/consult-cta";
import { PriceDisplay } from "@/components/ui/price-display";
import { DisclaimerBar } from "@/components/ui/disclaimer-bar";
import { stackComponentSumCents } from "@/lib/product-view";
import { stackPriceCents } from "@/lib/money";

export default async function StackPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const stack = await getStackBySlug(slug);
  if (!stack) notFound();
  const sum = stackComponentSumCents(stack.items as never);
  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="text-4xl font-semibold text-foreground">{stack.name}</h1>
      <p className="mt-2 text-lg text-muted-foreground">{stack.tagline}</p>
      <div className="mt-6"><PriceDisplay priceCents={stackPriceCents(sum, stack.discountBps)} compareAtCents={sum} /></div>
      <p className="mt-8 text-muted-foreground">{stack.overview}</p>
      <h2 className="mt-8 text-xl font-semibold text-foreground">Suggested protocol</h2>
      <p className="mt-3 text-muted-foreground">{stack.protocol}</p>
      <ul className="mt-6 space-y-1 text-muted-foreground">
        {stack.items.map((i) => <li key={i.product.slug}>• {i.product.name}</li>)}
      </ul>
      <div className="mt-8"><ConsultCTA productName={stack.name} status="ACTIVE" /></div>
      <DisclaimerBar className="mt-6" />
    </div>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add app/stacks components/commerce/stack-card.tsx lib/product-view.ts test/stack-price.test.ts
git commit -m "feat: stacks listing + detail pages with bundle pricing"
```

---

## Task 13: Email capture component + server action

**Files:**
- Create: `components/marketing/email-capture.tsx`, `app/actions/email-capture.ts`
- Test: `test/email-capture-action.test.ts`

**Interfaces:**
- Consumes: `parseEmailCapture` (Task 5), `prisma` (Task 1).
- Produces: server action `captureEmail(formData: FormData): Promise<{ ok: boolean; error?: string }>`; client `<EmailCapture source />`.

- [ ] **Step 1: Write the failing test**

`test/email-capture-action.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

const create = vi.fn();
vi.mock("@/lib/db", () => ({ prisma: { emailCapture: { create } } }));

import { captureEmail } from "@/app/actions/email-capture";

beforeEach(() => create.mockReset());

function fd(obj: Record<string, string>) {
  const f = new FormData();
  for (const [k, v] of Object.entries(obj)) f.set(k, v);
  return f;
}

describe("captureEmail action", () => {
  it("stores a valid email", async () => {
    create.mockResolvedValue({ id: "1" });
    const r = await captureEmail(fd({ email: "a@b.com", source: "footer", smsConsent: "false" }));
    expect(r.ok).toBe(true);
    expect(create).toHaveBeenCalled();
  });
  it("rejects an invalid email and does not write", async () => {
    const r = await captureEmail(fd({ email: "nope", source: "footer", smsConsent: "false" }));
    expect(r.ok).toBe(false);
    expect(create).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/email-capture-action.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the action**

`app/actions/email-capture.ts`:
```ts
"use server";
import { prisma } from "@/lib/db";
import { parseEmailCapture } from "@/lib/validation";

export async function captureEmail(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  const parsed = parseEmailCapture({
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    smsConsent: formData.get("smsConsent") === "true",
    source: formData.get("source"),
  });
  if (!parsed.ok) return { ok: false, error: parsed.error };
  await prisma.emailCapture.create({
    data: {
      email: parsed.data.email, phone: parsed.data.phone,
      smsConsent: parsed.data.smsConsent, source: parsed.data.source,
    },
  });
  return { ok: true };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run test/email-capture-action.test.ts`
Expected: PASS.

- [ ] **Step 5: Implement the client component**

`components/marketing/email-capture.tsx`:
```tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { captureEmail } from "@/app/actions/email-capture";

export function EmailCapture({ source }: { source: string }) {
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  if (done) return <p className="text-sm text-primary">You're on the list. Welcome to Heman.</p>;
  return (
    <form
      action={async (fd) => {
        fd.set("source", source);
        const r = await captureEmail(fd);
        if (r.ok) setDone(true); else setError(r.error ?? "Something went wrong");
      }}
      className="flex w-full max-w-md gap-2"
    >
      <input name="email" type="email" required placeholder="you@email.com"
        className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
      <input type="hidden" name="smsConsent" value="false" />
      <Button type="submit">Get early access</Button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </form>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add components/marketing/email-capture.tsx app/actions/email-capture.ts test/email-capture-action.test.ts
git commit -m "feat: email capture with server action + validation"
```

---

## Task 14: Gated Stripe checkout scaffold

**Files:**
- Create: `lib/stripe.ts`, `app/api/checkout/route.ts`
- Test: `test/checkout-gate.test.ts`

**Interfaces:**
- Consumes: `canCheckout` (Task 4).
- Produces: `POST /api/checkout` route that returns **403** when the order has no prescription, and only builds a Stripe session when gated check passes. `createCheckoutSession(order)` helper.

- [ ] **Step 1: Write the failing test**

`test/checkout-gate.test.ts`:
```ts
import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/stripe", () => ({
  createCheckoutSession: vi.fn().mockResolvedValue({ url: "https://stripe.test/session" }),
}));

import { POST } from "@/app/api/checkout/route";

function req(body: unknown) {
  return new Request("http://localhost/api/checkout", {
    method: "POST", body: JSON.stringify(body), headers: { "content-type": "application/json" },
  });
}

describe("checkout gate", () => {
  it("blocks checkout for an order without a prescription (403)", async () => {
    const res = await POST(req({ order: { prescriptionId: null } }));
    expect(res.status).toBe(403);
  });
  it("allows checkout once a prescription is linked", async () => {
    const res = await POST(req({ order: { prescriptionId: "rx_1" } }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.url).toContain("stripe");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/checkout-gate.test.ts`
Expected: FAIL — route not found.

- [ ] **Step 3: Implement lib/stripe.ts**

```ts
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "sk_test_placeholder");

export async function createCheckoutSession(order: { prescriptionId: string | null }) {
  // Scaffold only: real line items + customer wiring land in Spec #2.
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/order/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart`,
    metadata: { prescriptionId: order.prescriptionId ?? "" },
  });
  return { url: session.url };
}
```

- [ ] **Step 4: Implement the route**

`app/api/checkout/route.ts`:
```ts
import { NextResponse } from "next/server";
import { canCheckout } from "@/lib/cart";
import { createCheckoutSession } from "@/lib/stripe";

export async function POST(request: Request) {
  const { order } = await request.json();
  if (!canCheckout(order)) {
    return NextResponse.json(
      { error: "A completed consultation and prescription are required before checkout." },
      { status: 403 },
    );
  }
  const session = await createCheckoutSession(order);
  return NextResponse.json({ url: session.url }, { status: 200 });
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run test/checkout-gate.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add lib/stripe.ts app/api/checkout/route.ts test/checkout-gate.test.ts
git commit -m "feat: prescription-gated stripe checkout scaffold"
```

---

## Task 15: Homepage, cart page, consult/waitlist stubs

**Files:**
- Modify: `app/page.tsx` (homepage composition)
- Create: `app/cart/page.tsx`, `app/consultation/page.tsx`, `app/waitlist/page.tsx`
- Rebrand: `components/navbar.tsx`, `components/footer.tsx`, `components/brand/heman-logo.tsx`
- Reuse/rewrite: `components/sections/hero.tsx`, `faq.tsx`, `reviews.tsx` with peptide copy

**Interfaces:**
- Consumes: `getAllCategories`, `getAllStacks`, `getAllProducts`, `CategoryTile`, `StackCard`, `ProductCard`, `EmailCapture`, `DisclaimerBar`, FAQ + testimonial sections.

- [ ] **Step 1: Write the failing test**

`test/homepage-copy.test.ts`:
```ts
import { readFileSync } from "node:fs";
import { describe, it, expect } from "vitest";

const FORBIDDEN = ["research purposes only", "research use only", "not for human consumption"];

describe("homepage source compliance", () => {
  it("contains no forbidden non-compliant copy", () => {
    const src = readFileSync("app/page.tsx", "utf8").toLowerCase();
    for (const phrase of FORBIDDEN) expect(src).not.toContain(phrase);
  });
});
```

- [ ] **Step 2: Run test to verify it fails (or guard)**

Run: `npx vitest run test/homepage-copy.test.ts`
Expected: FAIL initially if the current `page.tsx` still has agency placeholder copy that you'll replace; if it already passes, proceed (the test is a guardrail).

- [ ] **Step 3: Rebrand navbar/footer/logo**

Replace `components/nova-logo.tsx` usage with `components/brand/heman-logo.tsx` (wordmark "HEMAN" + accent dot). Update `navbar.tsx` links to: Shop (`/shop`), GLP-1 (`/category/glp-1`), Stacks (`/stacks`), Consultation (`/consultation`), Ambassador (`/waitlist?program=ambassador`). Update `footer.tsx` with legal nav (`/legal/*`), email capture, and a `<DisclaimerBar />`.

- [ ] **Step 4: Compose the homepage**

`app/page.tsx` (server component) — hero with the four CTAs ("Shop Peptides" → `/shop`, "View GLP-1 Collection" → `/category/glp-1`, "Start a Consultation" → `/consultation`, "Ambassador Program" → `/waitlist?program=ambassador`), featured stacks (map `getAllStacks`), trending products (first 6 of `getAllProducts`), an education section (static research-framed copy), `<EmailCapture source="homepage" />`, testimonials (reuse `reviews.tsx` with compliant copy — testimonials about service/experience, not medical outcomes), FAQ (reuse `faq.tsx`), and a closing `<DisclaimerBar />`. Compute stack prices via `stackComponentSumCents` + `stackPriceCents` as in Task 12.

- [ ] **Step 5: Cart + stub pages**

`app/cart/page.tsx` — renders cart contents (empty-state acceptable in this spec) and a checkout button that, per the gate, shows: "Checkout opens after your consultation is approved." Wire the button to `POST /api/checkout` and surface the 403 message.

`app/consultation/page.tsx` and `app/waitlist/page.tsx` — simple branded stub pages explaining the consultation/waitlist process and capturing an email via `<EmailCapture>`. (Full intake is Spec #2.) Each carries `<DisclaimerBar />`.

- [ ] **Step 6: Run test + typecheck**

Run: `npx vitest run test/homepage-copy.test.ts && npx tsc --noEmit`
Expected: PASS / no type errors.

- [ ] **Step 7: Commit**

```bash
git add app/page.tsx app/cart app/consultation app/waitlist components/navbar.tsx components/footer.tsx components/brand components/sections test/homepage-copy.test.ts
git commit -m "feat: homepage, cart, consult/waitlist stubs, rebranded nav/footer"
```

---

## Task 16: Legal pages

**Files:**
- Create: `app/legal/terms/page.tsx`, `privacy/page.tsx`, `refund/page.tsx`, `shipping/page.tsx`, `medical-disclaimer/page.tsx`
- Create: `components/legal/legal-layout.tsx`
- Test: `test/legal-disclaimer.test.ts`

**Interfaces:**
- Produces: a shared `<LegalLayout title>` wrapper; five legal pages with real, compliant boilerplate copy (no forbidden phrases).

- [ ] **Step 1: Write the failing test**

`test/legal-disclaimer.test.ts`:
```ts
import { readFileSync } from "node:fs";
import { describe, it, expect } from "vitest";

describe("medical disclaimer page", () => {
  it("frames products as prescription, not research-only", () => {
    const src = readFileSync("app/legal/medical-disclaimer/page.tsx", "utf8").toLowerCase();
    expect(src).toContain("licensed");
    expect(src).not.toContain("not for human consumption");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/legal-disclaimer.test.ts`
Expected: FAIL — file not found.

- [ ] **Step 3: Implement legal-layout + pages**

`components/legal/legal-layout.tsx`:
```tsx
export function LegalLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="text-4xl font-semibold text-foreground">{title}</h1>
      <div className="mt-8 space-y-4 text-muted-foreground [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground">
        {children}
      </div>
    </div>
  );
}
```

Create each page with real boilerplate. `app/legal/medical-disclaimer/page.tsx` must state: products are prescription items dispensed only after evaluation and approval by a **licensed** healthcare provider through partnered pharmacies; the site does not provide medical advice; eligibility is provider-determined. The other four (terms, privacy, refund, shipping) use standard, accurate ecommerce/telehealth boilerplate. **None may contain the forbidden phrases.** Each page sets `export const metadata = { title: "<Page>" }`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run test/legal-disclaimer.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/legal components/legal test/legal-disclaimer.test.ts
git commit -m "feat: legal pages (terms, privacy, refund, shipping, medical disclaimer)"
```

---

## Task 17: SEO — sitemap, robots, JSON-LD

**Files:**
- Create: `app/sitemap.ts`, `app/robots.ts`, `lib/seo.ts`
- Modify: `app/product/[slug]/page.tsx` (inject Product JSON-LD), `app/page.tsx` (Organization + FAQ JSON-LD)
- Test: `test/seo.test.ts`

**Interfaces:**
- Produces: `organizationJsonLd()`, `productJsonLd(product)`, `faqJsonLd(items)` returning plain objects for `<script type="application/ld+json">`.

- [ ] **Step 1: Write the failing test**

`test/seo.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { organizationJsonLd, productJsonLd, faqJsonLd } from "@/lib/seo";

describe("seo json-ld", () => {
  it("builds Organization schema", () => {
    const o = organizationJsonLd();
    expect(o["@type"]).toBe("Organization");
    expect(o.name).toBe("Heman Peptide");
  });
  it("builds Product schema with offers", () => {
    const p = productJsonLd({ name: "BPC-157", description: "x", priceCents: 5900, slug: "bpc-157" });
    expect(p["@type"]).toBe("Product");
    expect(p.offers.price).toBe("59.00");
  });
  it("builds FAQPage schema", () => {
    const f = faqJsonLd([{ q: "Is a consult required?", a: "Yes." }]);
    expect(f["@type"]).toBe("FAQPage");
    expect(f.mainEntity[0]["@type"]).toBe("Question");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/seo.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement lib/seo.ts**

```ts
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function organizationJsonLd() {
  return { "@context": "https://schema.org", "@type": "Organization",
    name: "Heman Peptide", url: SITE };
}

export function productJsonLd(p: { name: string; description: string; priceCents: number; slug: string }) {
  return {
    "@context": "https://schema.org", "@type": "Product", name: p.name, description: p.description,
    offers: { "@type": "Offer", priceCurrency: "USD", price: (p.priceCents / 100).toFixed(2),
      url: `${SITE}/product/${p.slug}`, availability: "https://schema.org/InStock" },
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question", name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
}
```

- [ ] **Step 4: Implement sitemap + robots**

`app/sitemap.ts`:
```ts
import type { MetadataRoute } from "next";
import { getAllProducts, getAllCategories, getAllStacks } from "@/lib/catalog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const [products, categories, stacks] = await Promise.all([
    getAllProducts(), getAllCategories(), getAllStacks(),
  ]);
  const urls = [
    "", "/shop", "/stacks",
    ...categories.map((c) => `/category/${c.slug}`),
    ...products.map((p) => `/product/${p.slug}`),
    ...stacks.map((s) => `/stacks/${s.slug}`),
    "/legal/terms", "/legal/privacy", "/legal/refund", "/legal/shipping", "/legal/medical-disclaimer",
  ];
  return urls.map((u) => ({ url: `${site}${u}`, lastModified: new Date() }));
}
```

`app/robots.ts`:
```ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${site}/sitemap.xml` };
}
```

- [ ] **Step 5: Inject JSON-LD into pages**

In `app/product/[slug]/page.tsx`, render a script tag with `productJsonLd` for the cheapest variant. In `app/page.tsx`, render `organizationJsonLd` + `faqJsonLd` for the homepage FAQ items:
```tsx
<script type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd({
    name: product.name, description: product.subtitle, slug: product.slug,
    priceCents: Math.min(...product.variants.map((v) => v.priceCents)),
  })) }} />
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npx vitest run test/seo.test.ts`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add app/sitemap.ts app/robots.ts lib/seo.ts app/product app/page.tsx test/seo.test.ts
git commit -m "feat: SEO foundation — sitemap, robots, JSON-LD"
```

---

## Task 18: Full suite + production build verification

**Files:** none new — verification task.

- [ ] **Step 1: Run the full test suite**

Run: `npx vitest run`
Expected: all tests PASS.

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: no errors (fix any introduced).

- [ ] **Step 4: Production build**

Run: `npm run build`
Expected: build succeeds. (Catalog pages that read the DB need a reachable `DATABASE_URL`; if building without a DB, mark these routes `export const dynamic = "force-dynamic"` so the build doesn't try to statically prerender them, and note DB-backed verification as a follow-up.)

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "chore: verify full suite, typecheck, and production build"
```

---

## Self-Review Notes (coverage map)

- Spec §1 compliance reframes → Global Constraints + Tasks 6, 9, 10, 16 (forbidden-copy tests, consult-only CTA, Rx disclaimer).
- Spec §3 design system → Task 8 (tokens) + Task 9–10 (components).
- Spec §4 data model → Task 2 (schema) + Task 6 (seed).
- Spec §5 pages/routes → Tasks 11, 12, 15, 16.
- Spec §6 email capture → Task 13.
- Spec §7 SEO → Task 17.
- Spec §8 pricing → Tasks 3, 12 (placeholder MSRP, bundle discount).
- Spec §10 testing → every task is TDD; Task 18 is full-suite verification.
- Spec §11 success criteria → satisfied across Tasks 10 (gate), 11 (browse), 14 (gate rejection), 13/16/17 (capture, legal, SEO).
```
