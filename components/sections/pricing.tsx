import Link from "next/link";
import { Reveal } from "../reveal";
import { TiltCard } from "../tilt-card";
import { SectionHeader, SectionShell } from "./_shared";

type Plan = {
  tier: string;
  title: string;
  description: string;
  price: string;
  note: string;
  features: string[];
  cta: string;
  popular?: boolean;
};

const PLANS: Plan[] = [
  {
    tier: "Starter",
    title: "Digital Presence",
    description:
      "Get your business online with a professional, custom-built website.",
    price: "Custom",
    note:
      "Includes website build + 1st month of publishing. Then just $50/mo to keep your site live & active.",
    features: [
      "Delivered in as little as 3 days",
      "Fully custom responsive website",
      "Mobile-optimized design",
      "Basic SEO setup",
      "Contact form & Google Maps",
      "30-day post-launch support",
      "$50/mo hosting & maintenance",
    ],
    cta: "Get Started",
  },
  {
    tier: "Enterprise",
    title: "Market Dominator",
    description: "Full-service digital growth for ambitious businesses.",
    price: "Custom",
    note: "Tailored to your scale & goals",
    features: [
      "Unlimited pages & custom features",
      "Full-funnel ad strategy",
      "E-commerce integration",
      "Priority 24/7 support",
      "Quarterly strategy sessions",
    ],
    cta: "Contact Us",
    popular: true,
  },
];

function PricingCard({ plan }: { plan: Plan }) {
  return (
    <div
      className={`relative overflow-hidden rounded-[20px] border p-10 ${
        plan.popular
          ? "conic-border border-transparent bg-[linear-gradient(135deg,rgba(108,92,231,0.1),rgba(0,206,201,0.06))] md:scale-[1.03]"
          : "border-white/10 bg-white/[0.02]"
      }`}
    >
      {plan.popular && (
        <div
          className="absolute top-4 right-[-30px] rotate-[35deg] bg-gradient-to-br from-[#6c5ce7] to-[#00cec9] px-10 py-1 text-[0.65rem] font-bold uppercase tracking-[1px] text-white"
          style={{ boxShadow: "0 4px 20px rgba(108,92,231,0.35)" }}
        >
          Most Popular
        </div>
      )}
      <div className="text-[0.8rem] font-semibold uppercase tracking-[2px] text-[#6c5ce7]">
        {plan.tier}
      </div>
      <h3 className="mt-2 font-display text-[1.4rem] font-semibold text-white">
        {plan.title}
      </h3>
      <p className="mt-2 text-[0.85rem] text-[#666688]">{plan.description}</p>
      <div className="mt-6 font-display text-[2.5rem] font-bold leading-none text-white">
        {plan.price}
      </div>
      <p className="mt-1 mb-8 text-[0.75rem] text-[#55557a]">{plan.note}</p>
      <ul className="mb-8 list-none">
        {plan.features.map((f, i, arr) => (
          <li
            key={f}
            className={`flex items-center gap-2.5 py-2.5 text-[0.9rem] text-[#a0a0c0] ${
              i < arr.length - 1 ? "border-b border-white/[0.04]" : ""
            }`}
          >
            <span className="flex-shrink-0 font-bold text-[#00cec9]">✓</span>
            {f}
          </li>
        ))}
      </ul>
      <Link
        href="#book"
        className="inline-flex w-full items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 font-semibold text-[#e0e0f0] transition-all hover:border-[rgba(108,92,231,0.4)] hover:bg-white/[0.08]"
      >
        {plan.cta}
      </Link>
    </div>
  );
}

export function PricingSection() {
  return (
    <SectionShell id="pricing">
      <Reveal>
        <SectionHeader
          tag="05 // Pricing"
          title="Transparent Plans,"
          gradientTitle="Real Results"
          description="Choose the package that fits your goals. Every plan includes dedicated strategy and ongoing support."
        />
      </Reveal>
      <div className="mx-auto grid max-w-[850px] items-start gap-6 md:grid-cols-2">
        {PLANS.map((p, i) => (
          <Reveal key={p.tier} delay={i * 100}>
            <TiltCard className="h-full">
              <PricingCard plan={p} />
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
