# Spec #2A — Prescription-Code Redemption + Gate — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let a guest redeem a unique, revocable prescription code that unlocks the catalog and authorizes checkout — replacing Spec #1's placeholder prescription gate.

**Architecture:** A `PrescriptionCode` table (ACTIVE/REVOKED) seeded by an admin CLI batch. A guest redeems a code via a server action that validates it against the DB and sets a signed, httpOnly cookie. A `getRedeemedCode()` server helper reads the cookie and re-checks the code is still ACTIVE on every gated use (so revocation is immediate). The checkout gate is redefined from "order has a prescriptionId" to "request carries a valid, active redeemed code." Cart + real payment are Plan 2B.

**Tech Stack:** Next.js 16 App Router, React 19, Prisma 7 + Postgres (pg driver adapter), Node `crypto` (HMAC cookie signing + code entropy), Vitest, Zod.

## Global Constraints

- **Prisma 7:** connection config lives in `prisma.config.ts` (not schema); the runtime client uses the `@prisma/adapter-pg` adapter (see `lib/db.ts`). Schema changes are applied with `npx prisma db push` against the `DATABASE_URL` in `.env`.
- **Money is integer cents.** Never floats.
- **Compliance copy (verbatim where rendered):** disclaimer string and the forbidden phrases rule from Spec #1 still apply; the repo-wide `test/compliance-copy.test.ts` guard must stay green. FORBIDDEN substrings anywhere in `app/`/`components/`/`lib/`: "research purposes only", "research use only", "not for human consumption".
- **Imports:** `@/` alias; UI uses `cn` from `@/lib/utils`, Base UI `Button` uses the `render` prop (NOT `asChild`).
- **server-only:** any module that touches the DB or a secret imports `server-only`. Tests that load such modules mock `server-only` via `vi.mock("server-only", () => ({}))` and mock `@/lib/db`.
- **Mocked DB in tests:** unit/integration tests never hit a real Postgres; mock `@/lib/db` (and `next/headers`, `@/lib/rate-limit` where imported) following the Spec #1 patterns (`vi.hoisted`).
- **Code policy:** unique code per patient; **no expiry, no usage cap**; **revocable** (ACTIVE→REVOKED); **audited** (orders will reference the code in 2B). Codes are high-entropy and unlock the **whole catalog**.
- **Cookie:** `rx_auth` is signed (HMAC-SHA256 with `RX_COOKIE_SECRET`), httpOnly, SameSite=Lax, Secure in production; carries only the code id. The DB re-check (`status === ACTIVE`) is the authority.
- **Commit** after each task's tests pass.

---

## File Structure

```
prisma/schema.prisma            # + CodeStatus enum, PrescriptionCode model, Order.prescriptionCodeId
lib/
  codes.ts                      # generateCodeString() (pure) + findActiveCode()/revokeCode() (DB)
  rx-cookie.ts                  # signRxCookie() / verifyRxCookie() (pure HMAC)
  rx-auth.ts                    # getRedeemedCode() (server: reads cookie + re-checks ACTIVE) + RX_COOKIE_NAME
app/
  actions/redeem.ts             # redeemCode server action (validate + set cookie)
  redeem/page.tsx               # /redeem page
components/commerce/
  redeem-form.tsx               # client redeem form (used on /redeem and /cart)
  consult-cta.tsx               # MODIFY: unlocked vs locked state
scripts/
  generate-codes.ts             # admin CLI: batch-create codes + CSV
  revoke-code.ts                # admin CLI: revoke a code or a batch
lib/cart.ts                     # MODIFY: canCheckout redefined to code-based
app/api/checkout/route.ts       # MODIFY: gate on redeemed code
.env.example                    # + RX_COOKIE_SECRET
test/...                        # one test file per logic unit
```

---

## Task 1: Schema — PrescriptionCode + Order link

**Files:**
- Modify: `prisma/schema.prisma`
- Test: `test/schema.test.ts` (extend)

**Interfaces:**
- Produces: enum `CodeStatus { ACTIVE, REVOKED }`; model `PrescriptionCode { id, code @unique, status CodeStatus @default(ACTIVE), batchId String, note String?, createdAt, orders Order[] }`; `Order.prescriptionCodeId String?` + relation `prescriptionCode PrescriptionCode?`.

- [ ] **Step 1: Extend the schema test (failing)**

In `test/schema.test.ts`, add inside the "defines all core models" loop array: `"model PrescriptionCode"`. Add a new test:
```ts
it("models the prescription-code gate", () => {
  expect(schema).toContain("enum CodeStatus");
  expect(schema).toContain("REVOKED");
  expect(schema).toMatch(/prescriptionCodeId\s+String\?/);
});
```

- [ ] **Step 2: Run it — fails**

Run: `npx vitest run test/schema.test.ts`
Expected: FAIL (no `PrescriptionCode` / `CodeStatus`).

- [ ] **Step 3: Edit the schema**

Add the enum (after the other enums):
```prisma
enum CodeStatus {
  ACTIVE
  REVOKED
}
```
Add the model:
```prisma
model PrescriptionCode {
  id        String     @id @default(cuid())
  code      String     @unique
  status    CodeStatus @default(ACTIVE)
  batchId   String
  note      String?
  orders    Order[]
  createdAt DateTime   @default(now())

  @@index([batchId])
}
```
In `model Order`, add:
```prisma
  prescriptionCodeId String?           @unique
  prescriptionCode   PrescriptionCode? @relation(fields: [prescriptionCodeId], references: [id])
```

- [ ] **Step 4: Run test — passes; push schema**

Run: `npx vitest run test/schema.test.ts` → PASS.
Run: `npx prisma validate && npx prisma generate && npx prisma db push`
Expected: validate OK, client generated, "Your database is now in sync".

- [ ] **Step 5: Commit**

```bash
git add prisma/schema.prisma test/schema.test.ts
git commit -m "feat: PrescriptionCode model + Order code link"
```

---

## Task 2: Code string generator (pure)

**Files:**
- Create: `lib/codes.ts`
- Test: `test/codes.test.ts`

**Interfaces:**
- Produces: `generateCodeString(): string` — 12 chars from an unambiguous alphabet (no 0/O/1/I), crypto-random, grouped `XXXX-XXXX-XXXX`.

- [ ] **Step 1: Failing test**

`test/codes.test.ts`:
```ts
import { describe, it, expect, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { generateCodeString } from "@/lib/codes";

describe("generateCodeString", () => {
  it("returns a grouped code from the safe alphabet", () => {
    const c = generateCodeString();
    expect(c).toMatch(/^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{4}-[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{4}-[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{4}$/);
  });
  it("is effectively unique across many draws", () => {
    const set = new Set(Array.from({ length: 2000 }, () => generateCodeString()));
    expect(set.size).toBe(2000);
  });
});
```

- [ ] **Step 2: Run — fails** (`npx vitest run test/codes.test.ts`) → module not found.

- [ ] **Step 3: Implement (generator only)**

`lib/codes.ts`:
```ts
import "server-only";
import { randomInt } from "node:crypto";

const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no 0/O/1/I/L

export function generateCodeString(): string {
  const chars = Array.from({ length: 12 }, () => ALPHABET[randomInt(ALPHABET.length)]);
  return `${chars.slice(0, 4).join("")}-${chars.slice(4, 8).join("")}-${chars.slice(8, 12).join("")}`;
}
```

- [ ] **Step 4: Run — passes.**

- [ ] **Step 5: Commit**

```bash
git add lib/codes.ts test/codes.test.ts
git commit -m "feat: prescription code string generator"
```

---

## Task 3: Code DB helpers — findActiveCode / revokeCode

**Files:**
- Modify: `lib/codes.ts`
- Test: `test/codes-db.test.ts`

**Interfaces:**
- Consumes: `prisma` from `@/lib/db`.
- Produces: `findActiveCode(code: string): Promise<{ id: string; code: string } | null>` (returns the row only if `status === ACTIVE`); `revokeCode(code: string): Promise<number>` (updates matching ACTIVE code → REVOKED, returns count).

- [ ] **Step 1: Failing test**

`test/codes-db.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach } from "vitest";
vi.mock("server-only", () => ({}));
const { findFirst, updateMany } = vi.hoisted(() => ({ findFirst: vi.fn(), updateMany: vi.fn() }));
vi.mock("@/lib/db", () => ({ prisma: { prescriptionCode: { findFirst, updateMany } } }));
import { findActiveCode, revokeCode } from "@/lib/codes";

beforeEach(() => { findFirst.mockReset(); updateMany.mockReset(); });

describe("findActiveCode", () => {
  it("queries by code AND status ACTIVE", async () => {
    findFirst.mockResolvedValue({ id: "c1", code: "AAAA-BBBB-CCCC" });
    const r = await findActiveCode("AAAA-BBBB-CCCC");
    expect(r?.id).toBe("c1");
    expect(findFirst).toHaveBeenCalledWith(expect.objectContaining({
      where: { code: "AAAA-BBBB-CCCC", status: "ACTIVE" },
    }));
  });
  it("returns null for an unknown/revoked code", async () => {
    findFirst.mockResolvedValue(null);
    expect(await findActiveCode("nope")).toBeNull();
  });
});
describe("revokeCode", () => {
  it("flips matching ACTIVE codes to REVOKED", async () => {
    updateMany.mockResolvedValue({ count: 1 });
    const n = await revokeCode("AAAA-BBBB-CCCC");
    expect(n).toBe(1);
    expect(updateMany).toHaveBeenCalledWith({
      where: { code: "AAAA-BBBB-CCCC", status: "ACTIVE" },
      data: { status: "REVOKED" },
    });
  });
});
```

- [ ] **Step 2: Run — fails.**

- [ ] **Step 3: Implement (append to lib/codes.ts)**

```ts
import { prisma } from "@/lib/db";

export function findActiveCode(code: string) {
  return prisma.prescriptionCode.findFirst({
    where: { code, status: "ACTIVE" },
    select: { id: true, code: true },
  });
}

export async function revokeCode(code: string): Promise<number> {
  const r = await prisma.prescriptionCode.updateMany({
    where: { code, status: "ACTIVE" },
    data: { status: "REVOKED" },
  });
  return r.count;
}
```

- [ ] **Step 4: Run — passes.**

- [ ] **Step 5: Commit**

```bash
git add lib/codes.ts test/codes-db.test.ts
git commit -m "feat: findActiveCode + revokeCode DB helpers"
```

---

## Task 4: Signed redemption cookie (pure)

**Files:**
- Create: `lib/rx-cookie.ts`
- Test: `test/rx-cookie.test.ts`

**Interfaces:**
- Produces: `signRxCookie(codeId: string): string` → `"<codeId>.<hex hmac>"`; `verifyRxCookie(value: string | undefined): string | null` → the codeId if the HMAC verifies, else null. Secret from `process.env.RX_COOKIE_SECRET ?? "dev-rx-secret"`.

- [ ] **Step 1: Failing test**

`test/rx-cookie.test.ts`:
```ts
import { describe, it, expect, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { signRxCookie, verifyRxCookie } from "@/lib/rx-cookie";

describe("rx cookie", () => {
  it("round-trips a codeId", () => {
    const signed = signRxCookie("code_123");
    expect(signed.startsWith("code_123.")).toBe(true);
    expect(verifyRxCookie(signed)).toBe("code_123");
  });
  it("rejects tampering and junk", () => {
    const signed = signRxCookie("code_123");
    expect(verifyRxCookie(signed.replace("code_123", "code_999"))).toBeNull();
    expect(verifyRxCookie("garbage")).toBeNull();
    expect(verifyRxCookie(undefined)).toBeNull();
  });
});
```

- [ ] **Step 2: Run — fails.**

- [ ] **Step 3: Implement**

`lib/rx-cookie.ts`:
```ts
import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

const SECRET = process.env.RX_COOKIE_SECRET ?? "dev-rx-secret";

function mac(codeId: string): string {
  return createHmac("sha256", SECRET).update(codeId).digest("hex");
}

export function signRxCookie(codeId: string): string {
  return `${codeId}.${mac(codeId)}`;
}

export function verifyRxCookie(value: string | undefined): string | null {
  if (!value) return null;
  const idx = value.lastIndexOf(".");
  if (idx <= 0) return null;
  const codeId = value.slice(0, idx);
  const sig = value.slice(idx + 1);
  const expected = mac(codeId);
  if (sig.length !== expected.length) return null;
  try {
    if (!timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"))) return null;
  } catch {
    return null;
  }
  return codeId;
}
```

- [ ] **Step 4: Run — passes.**

- [ ] **Step 5: Commit**

```bash
git add lib/rx-cookie.ts test/rx-cookie.test.ts
git commit -m "feat: signed rx_auth redemption cookie"
```

---

## Task 5: Redeem action + getRedeemedCode helper

**Files:**
- Create: `app/actions/redeem.ts`, `lib/rx-auth.ts`
- Test: `test/redeem-action.test.ts`, `test/rx-auth.test.ts`

**Interfaces:**
- Consumes: `findActiveCode` (Task 3), `signRxCookie`/`verifyRxCookie` (Task 4), `rateLimit`/`clientIp` (Spec #1), `cookies`/`headers` from `next/headers`.
- Produces:
  - `RX_COOKIE_NAME = "rx_auth"` (exported from `lib/rx-auth.ts`).
  - `redeemCode(formData: FormData): Promise<{ ok: boolean; error?: string }>` — validates the code, sets the cookie.
  - `getRedeemedCode(): Promise<{ id: string } | null>` — reads + verifies the cookie, then re-checks the code is still ACTIVE in the DB (revocation takes effect immediately).

- [ ] **Step 1: Failing tests**

`test/rx-auth.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach } from "vitest";
vi.mock("server-only", () => ({}));
const { get } = vi.hoisted(() => ({ get: vi.fn() }));
vi.mock("next/headers", () => ({ cookies: async () => ({ get }) }));
const { findFirst } = vi.hoisted(() => ({ findFirst: vi.fn() }));
vi.mock("@/lib/db", () => ({ prisma: { prescriptionCode: { findFirst } } }));
import { getRedeemedCode } from "@/lib/rx-auth";
import { signRxCookie } from "@/lib/rx-cookie";

beforeEach(() => { get.mockReset(); findFirst.mockReset(); });

describe("getRedeemedCode", () => {
  it("returns the code when cookie is valid AND code still ACTIVE", async () => {
    get.mockReturnValue({ value: signRxCookie("c1") });
    findFirst.mockResolvedValue({ id: "c1", code: "X" });
    expect(await getRedeemedCode()).toEqual({ id: "c1" });
  });
  it("returns null when the code was revoked (no longer ACTIVE)", async () => {
    get.mockReturnValue({ value: signRxCookie("c1") });
    findFirst.mockResolvedValue(null);
    expect(await getRedeemedCode()).toBeNull();
  });
  it("returns null when no/invalid cookie", async () => {
    get.mockReturnValue(undefined);
    expect(await getRedeemedCode()).toBeNull();
  });
});
```

`test/redeem-action.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach } from "vitest";
vi.mock("server-only", () => ({}));
const { set } = vi.hoisted(() => ({ set: vi.fn() }));
vi.mock("next/headers", () => ({
  cookies: async () => ({ set }),
  headers: async () => new Headers(),
}));
vi.mock("@/lib/rate-limit", () => ({ rateLimit: () => ({ ok: true }), clientIp: () => "t" }));
const { findFirst } = vi.hoisted(() => ({ findFirst: vi.fn() }));
vi.mock("@/lib/db", () => ({ prisma: { prescriptionCode: { findFirst } } }));
import { redeemCode } from "@/app/actions/redeem";

function fd(code: string) { const f = new FormData(); f.set("code", code); return f; }
beforeEach(() => { set.mockReset(); findFirst.mockReset(); });

describe("redeemCode", () => {
  it("sets the cookie for a valid ACTIVE code", async () => {
    findFirst.mockResolvedValue({ id: "c1", code: "AAAA-BBBB-CCCC" });
    const r = await redeemCode(fd("AAAA-BBBB-CCCC"));
    expect(r.ok).toBe(true);
    expect(set).toHaveBeenCalledWith("rx_auth", expect.stringContaining("c1."), expect.objectContaining({ httpOnly: true }));
  });
  it("rejects an unknown/revoked code without setting a cookie", async () => {
    findFirst.mockResolvedValue(null);
    const r = await redeemCode(fd("nope"));
    expect(r.ok).toBe(false);
    expect(set).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run both — fail.**

- [ ] **Step 3: Implement `lib/rx-auth.ts`**

```ts
import "server-only";
import { cookies } from "next/headers";
import { verifyRxCookie } from "@/lib/rx-cookie";
import { findActiveCode } from "@/lib/codes";

export const RX_COOKIE_NAME = "rx_auth";

export async function getRedeemedCode(): Promise<{ id: string } | null> {
  const raw = (await cookies()).get(RX_COOKIE_NAME)?.value;
  const codeId = verifyRxCookie(raw);
  if (!codeId) return null;
  // Re-check the code is still ACTIVE so revocation takes effect immediately.
  const active = await findActiveCodeById(codeId);
  return active ? { id: codeId } : null;
}

// Look up an active code by id (the cookie stores the id, not the code string).
import { prisma } from "@/lib/db";
function findActiveCodeById(id: string) {
  return prisma.prescriptionCode.findFirst({ where: { id, status: "ACTIVE" }, select: { id: true } });
}
export { findActiveCode };
```

> Note: the `rx-auth` test mocks `prescriptionCode.findFirst`, which both `findActiveCodeById` and `findActiveCode` use — consistent.

- [ ] **Step 4: Implement `app/actions/redeem.ts`**

```ts
"use server";
import { cookies, headers } from "next/headers";
import { findActiveCode } from "@/lib/codes";
import { signRxCookie } from "@/lib/rx-cookie";
import { RX_COOKIE_NAME } from "@/lib/rx-auth";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export async function redeemCode(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  const limit = rateLimit(`redeem:${clientIp(await headers())}`, 10, 60_000);
  if (!limit.ok) return { ok: false, error: "Too many attempts. Please try again shortly." };

  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  if (!code) return { ok: false, error: "Enter your access code." };

  const active = await findActiveCode(code);
  if (!active) return { ok: false, error: "That code is not valid. Check it and try again." };

  (await cookies()).set(RX_COOKIE_NAME, signRxCookie(active.id), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // no expiry policy; 1y cookie lifetime
  });
  return { ok: true };
}
```

- [ ] **Step 5: Run both tests — pass.** Run `npx tsc --noEmit` — clean.

- [ ] **Step 6: Commit**

```bash
git add lib/rx-auth.ts app/actions/redeem.ts test/rx-auth.test.ts test/redeem-action.test.ts
git commit -m "feat: redeem action + getRedeemedCode (revocation re-checked)"
```

---

## Task 6: Redeem form + /redeem page

**Files:**
- Create: `components/commerce/redeem-form.tsx`, `app/redeem/page.tsx`
- Test: `test/components/redeem-form.test.tsx`

**Interfaces:**
- Consumes: `redeemCode` action (Task 5), `DisclaimerBar`, `Button`.
- Produces: `<RedeemForm />` client component (input + submit, success/error states); `/redeem` page wrapping it.

- [ ] **Step 1: Failing component test**

`test/components/redeem-form.test.tsx`:
```tsx
// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
vi.mock("@/app/actions/redeem", () => ({ redeemCode: vi.fn() }));
import { RedeemForm } from "@/components/commerce/redeem-form";

describe("RedeemForm", () => {
  it("renders an access-code input and submit", () => {
    render(<RedeemForm />);
    expect(screen.getByLabelText(/access code/i)).toBeTruthy();
    expect(screen.getByRole("button", { name: /unlock/i })).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run — fails.**

- [ ] **Step 3: Implement the form**

`components/commerce/redeem-form.tsx`:
```tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { redeemCode } from "@/app/actions/redeem";

export function RedeemForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  return (
    <form
      action={async (fd) => {
        setError(null);
        const r = await redeemCode(fd);
        if (r.ok) router.refresh();
        else setError(r.error ?? "Could not redeem that code.");
      }}
      className="flex w-full max-w-md flex-col gap-3"
    >
      <label htmlFor="code" className="text-sm text-muted-foreground">
        Access code
      </label>
      <div className="flex gap-2">
        <input
          id="code"
          name="code"
          required
          autoComplete="off"
          placeholder="XXXX-XXXX-XXXX"
          className="flex-1 rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm tracking-widest text-foreground uppercase"
        />
        <Button type="submit">Unlock</Button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </form>
  );
}
```

- [ ] **Step 4: Implement `/redeem` page**

`app/redeem/page.tsx`:
```tsx
import { RedeemForm } from "@/components/commerce/redeem-form";
import { DisclaimerBar } from "@/components/ui/disclaimer-bar";
import { getRedeemedCode } from "@/lib/rx-auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Redeem Access Code" };

export default async function RedeemPage() {
  const redeemed = await getRedeemedCode();
  return (
    <div className="mx-auto max-w-2xl px-6 py-24">
      <h1 className="text-4xl font-semibold text-foreground">Redeem your access code</h1>
      <p className="mt-3 text-muted-foreground">
        Enter the code provided after your approved consultation to unlock ordering.
      </p>
      <div className="mt-8">
        {redeemed ? (
          <p className="rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
            Your access is active. You can now browse and order prescribed products.
          </p>
        ) : (
          <RedeemForm />
        )}
      </div>
      <DisclaimerBar className="mt-12" />
    </div>
  );
}
```

- [ ] **Step 5: Run test — passes.** `npx tsc --noEmit` clean.

- [ ] **Step 6: Commit**

```bash
git add components/commerce/redeem-form.tsx app/redeem/page.tsx test/components/redeem-form.test.tsx
git commit -m "feat: redeem form + /redeem page"
```

---

## Task 7: Admin CLIs — generate-codes + revoke-code

**Files:**
- Create: `scripts/generate-codes.ts`, `scripts/revoke-code.ts`
- Modify: `package.json` (scripts)
- Test: `test/codes.test.ts` (extend with the batch helper)

**Interfaces:**
- Consumes: `generateCodeString` (Task 2), `prisma`, `revokeCode` (Task 3).
- Produces: pure helper `buildCodeBatch(count: number, batchId: string): { code: string; batchId: string }[]` in `lib/codes.ts` (unique within the batch); CLIs that insert/print CSV and revoke.

- [ ] **Step 1: Failing test for the batch helper**

Append to `test/codes.test.ts`:
```ts
import { buildCodeBatch } from "@/lib/codes";
describe("buildCodeBatch", () => {
  it("builds N unique codes tagged with the batch", () => {
    const batch = buildCodeBatch(50, "B1");
    expect(batch).toHaveLength(50);
    expect(new Set(batch.map((b) => b.code)).size).toBe(50);
    expect(batch.every((b) => b.batchId === "B1")).toBe(true);
  });
});
```

- [ ] **Step 2: Run — fails.**

- [ ] **Step 3: Implement `buildCodeBatch` (append to lib/codes.ts)**

```ts
export function buildCodeBatch(count: number, batchId: string): { code: string; batchId: string }[] {
  const seen = new Set<string>();
  const out: { code: string; batchId: string }[] = [];
  while (out.length < count) {
    const code = generateCodeString();
    if (seen.has(code)) continue;
    seen.add(code);
    out.push({ code, batchId });
  }
  return out;
}
```

- [ ] **Step 4: Run — passes.**

- [ ] **Step 5: Implement the CLIs**

`scripts/generate-codes.ts`:
```ts
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { buildCodeBatch } from "../lib/codes";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

function arg(name: string, fallback?: string): string {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  const val = hit ? hit.split("=")[1] : undefined;
  if (val === undefined && fallback === undefined) throw new Error(`Missing --${name}`);
  return val ?? fallback!;
}

async function main() {
  const count = Number(arg("count"));
  const batchId = arg("batch");
  if (!Number.isInteger(count) || count <= 0) throw new Error("--count must be a positive integer");
  const batch = buildCodeBatch(count, batchId);
  await prisma.prescriptionCode.createMany({ data: batch });
  // CSV to stdout for handoff
  console.log("code,batchId");
  for (const b of batch) console.log(`${b.code},${b.batchId}`);
  console.error(`Created ${batch.length} codes in batch "${batchId}".`);
}
main().then(() => prisma.$disconnect()).catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
```

`scripts/revoke-code.ts`:
```ts
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

function arg(name: string): string | undefined {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split("=")[1] : undefined;
}

async function main() {
  const code = arg("code");
  const batch = arg("batch");
  if (!code && !batch) throw new Error("Pass --code=<code> or --batch=<batchId>");
  const where = code ? { code, status: "ACTIVE" as const } : { batchId: batch!, status: "ACTIVE" as const };
  const r = await prisma.prescriptionCode.updateMany({ where, data: { status: "REVOKED" } });
  console.error(`Revoked ${r.count} code(s).`);
}
main().then(() => prisma.$disconnect()).catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
```

Add to `package.json` scripts:
```json
"codes:generate": "tsx scripts/generate-codes.ts",
"codes:revoke": "tsx scripts/revoke-code.ts"
```

- [ ] **Step 6: Smoke-test against the dev DB**

Run: `npm run codes:generate -- --count=3 --batch=smoke 2>/dev/null`
Expected: prints a `code,batchId` CSV with 3 rows. Then revoke one:
`npm run codes:revoke -- --batch=smoke` → "Revoked 3 code(s)."
(These rows are harmless test data; optionally delete later.)

- [ ] **Step 7: Run full suite** (`npx vitest run`) → green. **Commit**

```bash
git add lib/codes.ts scripts/generate-codes.ts scripts/revoke-code.ts package.json test/codes.test.ts
git commit -m "feat: admin CLIs to generate (CSV) and revoke codes"
```

---

## Task 8: Redefine the checkout gate to the redeemed code

**Files:**
- Modify: `lib/cart.ts`, `app/api/checkout/route.ts`
- Test: `test/cart.test.ts` (update), `test/checkout-gate.test.ts` (update)

**Interfaces:**
- Consumes: `getRedeemedCode` (Task 5).
- Produces: `canCheckout(auth: { redeemedCodeId: string | null }): boolean` — true iff a code is present. The `/api/checkout` route resolves the redeemed code server-side (cookie + DB re-check) and gates on it; no client-supplied prescription id is trusted.

- [ ] **Step 1: Update the cart gate test (failing)**

Replace the `canCheckout` test in `test/cart.test.ts`:
```ts
it("BLOCKS checkout without a redeemed code", () => {
  expect(canCheckout({ redeemedCodeId: null })).toBe(false);
  expect(canCheckout({ redeemedCodeId: "c1" })).toBe(true);
});
```

- [ ] **Step 2: Run — fails** (old signature).

- [ ] **Step 3: Update `lib/cart.ts`**

Replace the `canCheckout` function:
```ts
/** The compliance gate: an order may only proceed to payment with a redeemed, active code. */
export function canCheckout(auth: { redeemedCodeId: string | null }): boolean {
  return auth.redeemedCodeId !== null;
}
```

- [ ] **Step 4: Update the checkout route test**

Rewrite `test/checkout-gate.test.ts` to drive the gate via the redeemed-code cookie instead of a request body:
```ts
import { describe, it, expect, vi, beforeEach } from "vitest";
vi.mock("server-only", () => ({}));
vi.mock("@/lib/stripe", () => ({
  createCheckoutSession: vi.fn().mockResolvedValue({ url: "https://stripe.test/session" }),
}));
vi.mock("@/lib/rate-limit", () => ({ rateLimit: () => ({ ok: true }), clientIp: () => "t" }));
const { getRedeemedCode } = vi.hoisted(() => ({ getRedeemedCode: vi.fn() }));
vi.mock("@/lib/rx-auth", () => ({ getRedeemedCode }));
import { POST } from "@/app/api/checkout/route";

function req() { return new Request("http://localhost/api/checkout", { method: "POST" }); }
beforeEach(() => getRedeemedCode.mockReset());

describe("checkout gate (code-based)", () => {
  it("403 when no redeemed code", async () => {
    getRedeemedCode.mockResolvedValue(null);
    expect((await POST(req())).status).toBe(403);
  });
  it("200 + url when a valid code is redeemed", async () => {
    getRedeemedCode.mockResolvedValue({ id: "c1" });
    const res = await POST(req());
    expect(res.status).toBe(200);
    expect((await res.json()).url).toBe("https://stripe.test/session");
  });
});
```

- [ ] **Step 5: Update `app/api/checkout/route.ts`**

```ts
import { NextResponse } from "next/server";
import { canCheckout } from "@/lib/cart";
import { createCheckoutSession } from "@/lib/stripe";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { getRedeemedCode } from "@/lib/rx-auth";

export async function POST(request: Request) {
  const limit = rateLimit(`checkout:${clientIp(request.headers)}`, 10, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }
  const redeemed = await getRedeemedCode();
  if (!canCheckout({ redeemedCodeId: redeemed?.id ?? null })) {
    return NextResponse.json(
      { error: "A valid access code is required before checkout." },
      { status: 403 },
    );
  }
  // Real order creation + line items land in Plan 2B; keep the gated scaffold session.
  const session = await createCheckoutSession({ prescriptionId: redeemed!.id });
  return NextResponse.json({ url: session.url }, { status: 200 });
}
```

- [ ] **Step 6: Run both tests — pass.** `npx tsc --noEmit` clean.

- [ ] **Step 7: Commit**

```bash
git add lib/cart.ts app/api/checkout/route.ts test/cart.test.ts test/checkout-gate.test.ts
git commit -m "feat: redefine checkout gate to redeemed code"
```

---

## Task 9: Catalog unlock UI (ConsultCTA + cart) + env

**Files:**
- Modify: `components/commerce/consult-cta.tsx`, `app/cart/page.tsx`, `app/product/[slug]/page.tsx`, `.env.example`
- Test: `test/components/consult-cta.test.tsx` (extend)

**Interfaces:**
- Consumes: `getRedeemedCode` (server, in pages) — pages pass an `unlocked: boolean` prop into `ConsultCTA`.
- Produces: `<ConsultCTA productName status unlocked? />` — when `unlocked`, the product page shows that ordering is enabled and links to `/cart`; otherwise the existing "Start Consultation" CTA. Still never renders "add to cart"/"buy now" text in this plan (purchase UI is 2B).

- [ ] **Step 1: Extend the ConsultCTA test (failing)**

Add to `test/components/consult-cta.test.tsx`:
```tsx
it("shows an unlocked state when access is active", () => {
  render(<ConsultCTA productName="Tirzepatide" status="ACTIVE" unlocked />);
  expect(screen.getByText(/access active/i)).toBeTruthy();
});
```

- [ ] **Step 2: Run — fails.**

- [ ] **Step 3: Update `ConsultCTA`**

```tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ConsultCTA({
  productName,
  status,
  unlocked = false,
}: {
  productName: string;
  status: "ACTIVE" | "COMING_SOON" | "WAITLIST";
  unlocked?: boolean;
}) {
  if (unlocked && status === "ACTIVE") {
    return (
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-primary">Access active</span>
        <Button size="lg" render={<Link href="/cart" />}>Continue to your order</Button>
      </div>
    );
  }
  if (status === "ACTIVE") {
    return (
      <Button size="lg" render={<Link href={`/consultation?product=${encodeURIComponent(productName)}`} />}>
        Start Consultation
      </Button>
    );
  }
  return (
    <Button size="lg" variant="outline" render={<Link href={`/waitlist?product=${encodeURIComponent(productName)}`} />}>
      Join Waitlist
    </Button>
  );
}
```

- [ ] **Step 4: Wire `unlocked` in the product page**

In `app/product/[slug]/page.tsx`, add `import { getRedeemedCode } from "@/lib/rx-auth";`, compute `const unlocked = (await getRedeemedCode()) !== null;` and pass `unlocked={unlocked}` to `<ConsultCTA>`. (Page is already `force-dynamic`.)

- [ ] **Step 5: Cart page reflects access + redeem field**

In `app/cart/page.tsx` (already `force-dynamic` or add it), add `import { getRedeemedCode } from "@/lib/rx-auth";` and `import { RedeemForm } from "@/components/commerce/redeem-form";`. If `await getRedeemedCode()` is null, render the `<RedeemForm />` with copy "Enter your access code to continue." If non-null, keep the existing gate message ("Checkout opens after your consultation is approved." → change to "Your access is active — purchasing arrives in the next release.") and the existing `<DisclaimerBar />`.

- [ ] **Step 6: Add env var**

In `.env.example` add:
```
RX_COOKIE_SECRET="dev-rx-secret-change-me"
```

- [ ] **Step 7: Run the test + full suite + tsc**

Run: `npx vitest run && npx tsc --noEmit`
Expected: all pass, clean.

- [ ] **Step 8: Commit**

```bash
git add components/commerce/consult-cta.tsx app/product app/cart .env.example test/components/consult-cta.test.tsx
git commit -m "feat: catalog unlock UI gated on redeemed code"
```

---

## Task 10: Full verification

- [ ] **Step 1:** `npx vitest run` → all pass.
- [ ] **Step 2:** `npx tsc --noEmit` → clean.
- [ ] **Step 3:** `npm run lint` → clean (fix any unused imports).
- [ ] **Step 4:** `npm run build` → succeeds (DB-backed pages are `force-dynamic`; build needs `DATABASE_URL` only at request time, not build).
- [ ] **Step 5:** Manual smoke (optional, needs dev server + DB): `npm run codes:generate -- --count=1 --batch=demo`, copy the code, visit `/redeem`, enter it, confirm the catalog/product page shows "Access active", then `npm run codes:revoke -- --batch=demo` and confirm access drops on refresh.
- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: verify 2A — suite, tsc, lint, build"
```

---

## Self-Review (coverage map)

- Spec §3 (PrescriptionCode + Order link) → Task 1.
- Spec §4 (code generation CLI + CSV; revoke CLI) → Tasks 2, 7.
- Spec §5 (guest redemption, signed cookie, getRedeemedCode re-checks ACTIVE, rate-limited) → Tasks 4, 5, 6.
- Spec §6 (gate redefinition; revoked code fails) → Tasks 5 (re-check), 8 (gate + route).
- Spec §8 (signed httpOnly cookie; revocation re-checked; no forbidden copy) → Tasks 4, 5; compliance-copy guard stays green.
- Spec §7 (real Stripe payment, line items, webhook) and the cart → **Plan 2B** (out of scope here, by design).
- Spec §9 testing → every task is TDD; Task 10 verifies the suite/build.
