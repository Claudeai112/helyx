# Security Posture

This documents the security hardening on the Heman Peptide storefront and the
items that still need attention before handling real customer data in production.

## What is protected

**Secrets never reach the browser**
- `lib/stripe.ts` (Stripe secret key) and `lib/db.ts` (Prisma client) import
  `server-only`, so the build fails if they are ever pulled into a Client
  Component bundle.
- Only `NEXT_PUBLIC_*` values are exposed to the client, and the only one in use
  is `NEXT_PUBLIC_SITE_URL` (a public URL, not a secret).
- `.env*` is gitignored; only `.env.example` (placeholders) is committed.

**Private files / source are not web-reachable**
- Next.js only serves `/public` and compiled routes. `prisma/`, `lib/`, `.env`,
  `node_modules`, and all server code are not addressable over HTTP.
- `productionBrowserSourceMaps: false` — no source maps shipped to the browser.
- `poweredByHeader: false` — the `X-Powered-By` framework fingerprint is removed.

**HTTP security headers** (set in `next.config.ts`, verified emitting at runtime)
- `Content-Security-Policy` — restricts sources; `object-src 'none'`,
  `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'none'`, Stripe allowed.
- `Strict-Transport-Security` — forces HTTPS (2 years, includeSubDomains, preload).
- `X-Frame-Options: DENY` + CSP `frame-ancestors` — anti-clickjacking.
- `X-Content-Type-Options: nosniff` — no MIME sniffing.
- `Referrer-Policy: strict-origin-when-cross-origin`.
- `Permissions-Policy` — camera/mic/geolocation/payment/usb/topics disabled.

**Input validation & abuse resistance**
- Email capture is Zod-validated; the checkout route validates its JSON body
  (400 on malformed input) and enforces the prescription gate (403 without a
  linked prescription — no direct purchase path exists).
- Public write endpoints (email capture, checkout) are IP rate-limited
  (`lib/rate-limit.ts`).
- Prisma parameterizes all queries (no string-built SQL → no SQL injection).

## Important: a public storefront's catalog is public by design

Product names, descriptions, and prices are rendered to every visitor, so they
are inherently readable (and scrapable). It is not possible to display the
catalog to shoppers while hiding it from automated readers. The protections above
target *private* data, secrets, source, and abuse — not the public catalog.

## Follow-ups before production (with real customer data)

1. **Distributed rate limiting.** `lib/rate-limit.ts` is in-memory and per-process;
   on serverless/multi-instance hosting the effective limit is `limit × instances`.
   Back it with a shared store (Upstash Redis / Vercel KV) using the same API.
2. **Authentication & authorization.** The `User`/`UserRole` schema shell exists
   but nothing authenticates yet. Any patient portal, order history, consult, or
   admin surface (Spec #2+) must gate access — never expose `Consult`,
   `Prescription`, `Order`, or `EmailCapture` data without an authenticated,
   authorized session.
3. **Tighten CSP to nonce-based.** The current policy still allows
   `'unsafe-inline'` for scripts/styles (framework hydration + inline styles).
   Move to per-request nonces via middleware to remove `'unsafe-inline'`.
4. **Secrets management.** Use the host's secret store (not `.env` files) for
   `STRIPE_SECRET_KEY` / `DATABASE_URL`; rotate keys; use Stripe restricted keys.
5. **PII handling.** `EmailCapture` (and future consult/Rx data) is personal/health
   data — define retention, encryption at rest, access logging, and the privacy/
   consent flows the legal pages describe.
6. **Dependency & transport hygiene.** Run `npm audit` in CI; serve only over TLS;
   consider a WAF / bot-management layer in front of the app.

## Verifying headers

```bash
npm run build && npm run start
curl -sI http://localhost:3000/   # inspect the security headers above
```

CSP violations only surface at runtime in a real browser — after any deploy,
load the site with devtools open and confirm there are no CSP console errors
(especially around the GSAP/Three.js/Framer animation stack and Stripe).
