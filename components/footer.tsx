import Link from "next/link";
import { PurePepsLogo } from "./brand/pure-peps-logo";
import { EmailCapture } from "./marketing/email-capture";
import { DisclaimerBar } from "./ui/disclaimer-bar";

const SHOP_LINKS = [
  { href: "/shop", label: "All Products" },
  { href: "/category/glp-1", label: "GLP-1 Collection" },
  { href: "/stacks", label: "Protocol Stacks" },
  { href: "/shop", label: "New Arrivals" },
];

const LEGAL_LINKS = [
  { href: "/legal/terms", label: "Terms of Service" },
  { href: "/legal/privacy", label: "Privacy Policy" },
  { href: "/legal/refund", label: "Refund Policy" },
  { href: "/legal/shipping", label: "Shipping Policy" },
  { href: "/legal/medical-disclaimer", label: "Medical Disclaimer" },
];

const COMPANY_LINKS = [
  { href: "/consultation", label: "Start Consultation" },
  { href: "/waitlist?program=ambassador", label: "Ambassador Program" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#reviews", label: "Reviews" },
];

export function Footer() {
  return (
    <footer className="relative z-[2] border-t border-white/5 px-6 pb-8 pt-16 md:px-8">
      <div className="mx-auto max-w-[1200px]">
        {/* Email capture row */}
        <div className="mb-12 rounded-2xl border border-[rgba(40,224,200,0.15)] bg-[rgba(40,224,200,0.04)] px-8 py-8">
          <p className="mb-1 text-sm font-semibold uppercase tracking-[1.5px] text-[#28e0c8]">
            Stay informed
          </p>
          <p className="mb-4 text-[0.9rem] text-[#7777aa]">
            Get updates on new protocols, provider insights, and member-only access.
          </p>
          <EmailCapture source="footer" />
        </div>

        {/* Grid */}
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <PurePepsLogo className="size-[38px] shrink-0" />
              <div className="font-display leading-tight">
                <span className="block text-[1.2rem] font-bold tracking-widest text-white">PURE PEPS</span>
                <span className="block text-[0.65rem] font-medium uppercase tracking-[3px] text-[#28e0c8]">
                  Peptide
                </span>
              </div>
            </Link>
            <p className="mt-5 max-w-sm text-[0.9rem] text-[#55557a]">
              Provider-guided peptide protocols designed for GLP-1 support, recovery, and longevity.
              All products require consultation and prescriber approval.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-display text-[0.85rem] font-semibold uppercase tracking-[1.5px] text-white">
              Shop
            </h4>
            <ul className="space-y-2">
              {SHOP_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="block text-[0.9rem] text-[#55557a] transition-colors hover:text-[#28e0c8]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-display text-[0.85rem] font-semibold uppercase tracking-[1.5px] text-white">
              Company
            </h4>
            <ul className="space-y-2">
              {COMPANY_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="block text-[0.9rem] text-[#55557a] transition-colors hover:text-[#28e0c8]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-display text-[0.85rem] font-semibold uppercase tracking-[1.5px] text-white">
              Legal
            </h4>
            <ul className="space-y-2">
              {LEGAL_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="block text-[0.9rem] text-[#55557a] transition-colors hover:text-[#28e0c8]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mx-auto mt-12 flex max-w-[1200px] flex-col items-start gap-4 border-t border-white/5 pt-6 text-[0.8rem] text-[#33334a] md:flex-row md:items-center md:justify-between">
          <span>© 2026 Pure Peps. All rights reserved.</span>
          <DisclaimerBar className="max-w-[640px] text-[0.75rem]" />
        </div>
      </div>
    </footer>
  );
}
