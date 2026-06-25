import type { NextConfig } from "next";

/**
 * Content-Security-Policy.
 *
 * Pragmatic-but-meaningful policy: it locks down the high-value vectors
 * (clickjacking, plugin/object injection, base-tag hijacking, form exfiltration)
 * while still allowing the app's inline styles + framework hydration and Stripe.
 *
 * NOTE: `script-src`/`style-src` still allow 'unsafe-inline' because the app uses
 * inline styles (Framer Motion / layout gradients) and Next's hydration bootstrap.
 * Tightening to a nonce-based policy (removing 'unsafe-inline') is a follow-up that
 * requires middleware to inject a per-request nonce. Verify this policy in a real
 * browser after deploy — CSP violations only surface at runtime.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://js.stripe.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://api.stripe.com",
  "frame-src https://js.stripe.com https://checkout.stripe.com",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // Force HTTPS for 2 years, including subdomains.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Block this site from being framed (anti-clickjacking; complements frame-ancestors).
  { key: "X-Frame-Options", value: "DENY" },
  // Stop browsers from MIME-sniffing responses away from the declared type.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Don't leak full URLs to third parties.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disable powerful browser features the storefront never uses.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  // Don't advertise the framework/version to attackers.
  poweredByHeader: false,
  // Never ship source maps to the browser in production.
  productionBrowserSourceMaps: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
