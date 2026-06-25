import Link from "next/link";
import { HelyxLogo } from "./brand/helyx-logo";
import { EmailCapture } from "./marketing/email-capture";
import { DisclaimerBar } from "./ui/disclaimer-bar";

const SHOP_LINKS = [
  { href: "/shop", label: "All Products" },
  { href: "/category/glp-1", label: "GLP-1" },
  { href: "/category/healing", label: "Healing" },
  { href: "/category/fat-loss", label: "Fat Loss" },
  { href: "/stacks", label: "Stacks" },
  { href: "/bulk", label: "Bulk" },
];

const COMPANY_LINKS = [
  { href: "/ambassador", label: "Ambassador" },
  { href: "/faq", label: "FAQ" },
  { href: "/account", label: "Account" },
];

const LEGAL_LINKS = [
  { href: "/legal/terms", label: "Terms" },
  { href: "/legal/privacy", label: "Privacy" },
  { href: "/legal/refund", label: "Refund Policy" },
  { href: "/legal/shipping", label: "Shipping Policy" },
];

export function Footer() {
  return (
    <footer className="bg-[var(--footer)] px-6 pb-10 pt-16 text-white/80 md:px-8">
      <div className="mx-auto max-w-[1200px]">
        {/* Four-column grid: brand | shop | company | legal */}
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <HelyxLogo className="size-[36px] shrink-0" />
              <span className="font-heading text-lg font-semibold tracking-wide text-white">
                Helyx Peptides
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              Research-grade peptides and compounds for laboratory and scientific
              research applications.
            </p>
          </div>

          {/* Shop column */}
          <div>
            <h4 className="mb-4 font-heading text-sm font-semibold text-white">
              Shop
            </h4>
            <ul className="space-y-2.5">
              {SHOP_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company column */}
          <div>
            <h4 className="mb-4 font-heading text-sm font-semibold text-white">
              Company
            </h4>
            <ul className="space-y-2.5">
              {COMPANY_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal column */}
          <div>
            <h4 className="mb-4 font-heading text-sm font-semibold text-white">
              Legal
            </h4>
            <ul className="space-y-2.5">
              {LEGAL_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Email sign-up — inputs render white on dark, which is legible */}
        <div className="mt-12 border-t border-white/10 pt-10">
          <p className="mb-3 text-sm font-medium text-white">Stay up to date</p>
          <EmailCapture source="footer" />
        </div>

        {/* RUO fine print */}
        <DisclaimerBar className="mt-8 text-white/50" />

        {/* Copyright */}
        <p className="mt-6 border-t border-white/10 pt-6 text-xs text-white/40">
          © {new Date().getFullYear()} Helyx Peptides. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
