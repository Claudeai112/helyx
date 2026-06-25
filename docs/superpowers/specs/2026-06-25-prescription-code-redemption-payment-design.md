# Heman Peptide — Spec #2: Prescription-Code Redemption + Payment

**Date:** 2026-06-25
**Status:** Design — pending user review
**Builds on:** Spec #1 (Storefront Foundation). Replaces Spec #1's placeholder
prescription gate with a real code-based authorization, and replaces the
test-mode Stripe scaffold with real, webhook-confirmed payment.

---

## 1. Business model (how authorization actually works)

The consultation happens entirely **off-site** on the contracted telehealth
provider's own platform. When the provider approves a patient, the patient
receives a **prescription code**. The patient enters that code on this site to
unlock the ability to purchase prescription products, then pays.

We do **not** build an intake questionnaire or a provider-review dashboard —
those live on the provider's platform.

```
(off-site) Patient consults provider → provider approves → patient gets a code
(our site) Patient enters code → catalog unlocked → real Stripe payment → order
```

### Code policy (decided with the business)

- **Unique code per patient.** A batch generates N distinct, high-entropy codes;
  the provider distributes one per approved patient. There is no single shared
  code.
- **No expiry, no usage cap.** A patient enters their code once and retains full
  catalog access. (Explicit business decision.)
- **Revocable.** An admin can set a specific code to `REVOKED` to immediately cut
  off a leaked/abused code. This is the safety valve that replaces expiry/limits —
  without it a compromised immortal code could never be shut off, which is not
  acceptable for injectable prescription products.
- **Audited.** Every order records the code it was authorized under, so purchases
  are traceable to an authorization.

> Compliance rationale: the gate's legitimacy depends on each purchase tracing to
> a provider-issued, revocable, per-patient authorization. Revocability + audit
> are the minimum responsible floor; they add zero patient friction.

---

## 2. Scope

**In scope (this sub-spec):** the `PrescriptionCode` model + revocation + audit;
batch code generation (CLI + CSV); guest redemption via signed cookie;
catalog-unlock wired into the existing `canCheckout` gate; real Stripe payment
(line items, Checkout Session, webhook confirmation, order state machine,
success/cancel pages).

**Deferred to later sub-specs (NOT here):** patient accounts/portal + dosing tool
(Auth.js), pharmacy fulfillment integration + order-tracking UI, full admin
dashboard, the per-product dosing calculator.

---

## 3. Data model (Prisma changes)

- **`PrescriptionCode`** (new) — `id`, `code` (`@unique`, high-entropy ~12+ chars),
  `status` (enum `CodeStatus { ACTIVE, REVOKED }`, default `ACTIVE`), `batchId`
  (string, groups a generation run), `note` (optional, provider's patient
  reference), `createdAt`. Relation: `orders Order[]`.
- **`Order`** (modify) — add `prescriptionCodeId String?` + relation to
  `PrescriptionCode` (the audit link). Add payment fields: `stripeSessionId
  String? @unique`, `amountTotalCents Int?`. Keep the existing `status`
  (`OrderStatus`) advancing `PENDING_CONSULT → AWAITING_PAYMENT → PAID →
  FULFILLED`. (The Spec-1 `consultId`/`prescriptionId` columns remain but are no
  longer the gate; they can be retired in a later cleanup.)
- The gate definition changes from "has a linked `Prescription`" to "has a valid
  redeemed code" — see §6.

Migration adds the `PrescriptionCode` table, the `CodeStatus` enum, and the new
`Order` columns. (Requires the provisioned Postgres from the Spec-1 follow-up.)

---

## 4. Code generation (admin CLI)

- A script `scripts/generate-codes.ts`, runnable via `npm run codes:generate --
  --count <n> --batch <label> [--note-prefix <p>]`.
- Generates `<n>` unique, high-entropy codes (crypto-random, ambiguity-free
  alphabet), inserts them as `ACTIVE`, and writes a CSV (`code,batchId,createdAt`)
  to stdout / a file to hand the provider.
- Idempotent on collision (regenerate on the rare unique-constraint hit).
- A companion `npm run codes:revoke -- --code <code>` (or `--batch <label>`) flips
  codes to `REVOKED`. A full admin UI is a later spec; CLIs are the YAGNI first cut.

---

## 5. Redemption flow (guest)

- Route `/redeem` (and an inline redeem field on `/cart`): patient submits a code.
- A server action validates: code exists and `status === ACTIVE`. Invalid/revoked
  → friendly error. Valid → set a **signed, httpOnly cookie** (`rx_auth`)
  containing the code id, and redirect back to the catalog/cart.
- A small server helper `getRedeemedCode()` reads + verifies the cookie and
  re-checks the code is still `ACTIVE` on every use (so revocation takes effect
  immediately, even mid-session).
- Guest-only; no account. (Account binding comes with the portal sub-spec.)
- Rate-limit the redeem action (reuse `lib/rate-limit.ts`) to resist code
  brute-forcing; codes are high-entropy so brute force is infeasible, but the
  limiter is cheap defense-in-depth.

---

## 6. Checkout unlock + gate integration

- The storefront's "locked" UI (Spec #1 ConsultCTA / cart gate) gains an unlocked
  state when a valid redeemed code is present: products become purchasable and the
  cart's checkout button is enabled.
- `canCheckout` (currently `order.prescriptionId !== null`) is **redefined**: an
  order may proceed only if it carries a valid, `ACTIVE` redeemed-code
  authorization. The `/api/checkout` route resolves the code from the cookie,
  re-validates it is `ACTIVE`, stamps `order.prescriptionCodeId`, and only then
  creates the Stripe session. A revoked code fails the gate (403) even with items
  in cart.
- Existing Spec-1 checkout-gate tests are updated to the code-based gate; the
  "no authorization → 403" guarantee is preserved and strengthened (revoked-code
  case added).

---

## 7. Payment (real Stripe)

- Build real `line_items` from the cart (each variant → Stripe price data in
  integer cents; quantities from the cart).
- `/api/checkout` (gated per §6) creates a Stripe **Checkout Session** in test
  mode, sets `order.status = AWAITING_PAYMENT` + `stripeSessionId`, returns the
  redirect URL.
- **Webhook** `/api/webhooks/stripe` verifies the Stripe signature and on
  `checkout.session.completed` marks the matching `Order → PAID` and records
  `amountTotalCents`. Idempotent (ignore duplicate events).
- Success page `/order/success` and cancel back to `/cart`.
- Test mode throughout; flip to live keys at go-live. Real fulfillment (pharmacy
  handoff) is a later sub-spec — `PAID` orders simply await fulfillment.

---

## 8. Security / compliance

- Reuse Spec-1 hardening (`server-only` on Stripe/DB, security headers, rate
  limiting). The Stripe **webhook secret** and **secret key** stay server-side
  only; the webhook verifies signatures (reject unsigned/invalid).
- The `rx_auth` cookie is signed (HMAC with a server secret) + httpOnly + Secure +
  SameSite=Lax, carrying only the code id (no PII).
- Revocation re-checked on every gated action (redeem, unlock, checkout), so a
  killed code stops working immediately.
- No medical claims / forbidden copy on any new surface (the repo-wide
  compliance-copy test already guards this; new pages inherit it).

---

## 9. Testing

- Unit: code generation (uniqueness, entropy, alphabet), code validation
  (active/revoked/unknown), cookie sign/verify, Stripe line-item builder
  (cents/quantities), webhook event handling (PAID transition, idempotency,
  signature rejection).
- Integration: redeem action (valid/invalid/revoked), the redefined `canCheckout`
  gate (no code → 403, revoked → 403, valid → 200), checkout session creation.
- Follow TDD per project conventions. DB-touching paths mocked as in Spec #1;
  webhook signature tested with Stripe's test signing.

---

## 10. Success criteria

1. An admin can generate a batch of unique codes and a CSV to hand the provider;
   a specific code can be revoked.
2. A guest can enter a valid code and unlock the catalog; an invalid or revoked
   code cannot.
3. Checkout is impossible without a valid, active redeemed code (403 otherwise),
   and every order records the code it was authorized under.
4. A real (test-mode) Stripe payment completes via Checkout Session + verified
   webhook, advancing the order to `PAID`.
5. Tests pass; `next build` succeeds.
