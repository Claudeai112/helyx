import { Reveal } from "../reveal";
import { SectionHeader, SectionShell } from "./_shared";

type Service = {
  number: string;
  title: string;
  description: string;
  chips: string[];
  icon: React.ReactNode;
  iconTint: string;
  featured?: boolean;
};

const featuredTop: Service = {
  number: "01 // Core Service",
  title: "Custom Website Design & Development",
  description:
    "We don't do cookie-cutter templates. Every website we build is designed around your brand, built for speed, and focused on turning visitors into paying customers. Whether you need a clean landing page or a full e-commerce store, we create sites that look sharp and actually perform.",
  chips: [
    "Responsive Design",
    "SEO-Optimized",
    "Lightning Fast",
    "Conversion-Focused",
    "E-Commerce Ready",
  ],
  iconTint: "rgba(108,92,231,0.15)",
  icon: (
    <svg width="28" height="28" fill="none" stroke="#6c5ce7" strokeWidth={2} viewBox="0 0 24 24">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  ),
  featured: true,
};

const mid: Service[] = [
  {
    number: "02",
    title: "Facebook & Instagram Ads",
    description:
      "We build hyper-targeted campaigns that reach the exact people who need your product or service. Advanced audience segmentation, retargeting funnels, and creative that stops the scroll.",
    chips: ["Audience Targeting", "Retargeting", "Creative Design"],
    iconTint: "rgba(0,206,201,0.15)",
    icon: (
      <svg width="28" height="28" fill="none" stroke="#00cec9" strokeWidth={2} viewBox="0 0 24 24">
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Google Search & Display Ads",
    description:
      "Capture high-intent buyers the moment they search for what you offer. We build and optimize Google Ads campaigns that dominate search results and the Display Network.",
    chips: ["Search Campaigns", "Display Network", "Shopping Ads"],
    iconTint: "rgba(253,121,168,0.15)",
    icon: (
      <svg width="28" height="28" fill="none" stroke="#fd79a8" strokeWidth={2} viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Analytics & Performance Tracking",
    description:
      "We install enterprise-grade tracking so you see exactly where every dollar goes. Real-time dashboards, conversion tracking, and monthly performance reports.",
    chips: ["Real-Time Dashboards", "Conversion Tracking", "Monthly Reports"],
    iconTint: "rgba(253,203,110,0.15)",
    icon: (
      <svg width="28" height="28" fill="none" stroke="#fdcb6e" strokeWidth={2} viewBox="0 0 24 24">
        <path d="M12 20V10M18 20V4M6 20v-4" />
      </svg>
    ),
  },
];

const featuredBottom: Service = {
  number: "05 // The Full Package",
  title: "Full-Funnel Growth Strategy",
  description:
    "Most agencies just run ads. We build the whole system. We map out every step from first click to final sale: landing pages, retargeting, and upsells. Your website becomes the engine, ads become the fuel, and we keep everything running so you can focus on what you do best.",
  chips: ["Sales Funnels", "Ad Optimization", "Landing Pages", "Lead Generation", "CRO"],
  iconTint: "rgba(116,185,255,0.15)",
  icon: (
    <svg width="28" height="28" fill="none" stroke="#74b9ff" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  featured: true,
};

function IconTile({
  children,
  tint,
}: {
  children: React.ReactNode;
  tint: string;
}) {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute inset-[-6px] -z-[1] rounded-[20px] blur-[12px]"
        style={{ background: tint, opacity: 0.3 }}
      />
      <div
        className="flex size-16 items-center justify-center rounded-2xl"
        style={{ background: tint }}
      >
        {children}
      </div>
    </div>
  );
}

function Chip({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[0.72rem] text-[#a0a0c0] transition-all group-hover:border-[rgba(108,92,231,0.2)] group-hover:bg-[rgba(108,92,231,0.06)]">
      {label}
    </span>
  );
}

function StandardCard({ s }: { s: Service }) {
  return (
    <div className="service-card group relative flex flex-col items-center overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.02] p-10 text-center transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-1.5 hover:bg-white/[0.04] hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
      <div className="mb-5 text-[0.7rem] font-semibold uppercase tracking-[2px] text-[#55557a]">
        {s.number}
      </div>
      <IconTile tint={s.iconTint}>{s.icon}</IconTile>
      <h3 className="mt-6 font-display text-[1.2rem] font-semibold text-white">
        {s.title}
      </h3>
      <div className="my-4 h-0.5 w-10 rounded-sm bg-gradient-to-r from-[#6c5ce7] to-[#00cec9] opacity-50" />
      <p className="max-w-[420px] text-[0.9rem] leading-[1.7] text-[#7777aa]">
        {s.description}
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {s.chips.map((c) => (
          <Chip key={c} label={c} />
        ))}
      </div>
    </div>
  );
}

function FeaturedCard({ s }: { s: Service }) {
  return (
    <div
      className="service-card group relative overflow-hidden rounded-[20px] border p-12 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-1.5 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)] md:col-span-3"
      style={{
        background:
          "linear-gradient(135deg, rgba(108,92,231,0.06), rgba(0,206,201,0.03))",
        borderColor: "rgba(108,92,231,0.12)",
      }}
    >
      <div className="flex flex-col gap-10 md:flex-row md:items-start md:gap-10">
        <IconTile tint={s.iconTint}>{s.icon}</IconTile>
        <div className="flex-1 text-left">
          <div className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[2px] text-[#55557a]">
            {s.number}
          </div>
          <h3 className="font-display text-[1.4rem] font-semibold text-white">
            {s.title}
          </h3>
          <div className="my-4 h-0.5 w-10 rounded-sm bg-gradient-to-r from-[#6c5ce7] to-[#00cec9] opacity-50" />
          <p className="text-[0.95rem] leading-[1.7] text-[#7777aa]">
            {s.description}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {s.chips.map((c) => (
              <Chip key={c} label={c} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ServicesSection() {
  return (
    <SectionShell id="services">
      <Reveal>
        <SectionHeader
          tag="01 // What We Do"
          title="We Build a Real"
          gradientTitle="Foundation"
          description="Not templates. Not guesswork. We build a professional website, pair it with smart ad targeting, and put a strategy behind it that gets stronger every month. Everything works together so your business grows with momentum — not luck."
        />
      </Reveal>
      <div className="mx-auto grid max-w-[1100px] gap-6 md:grid-cols-3">
        <Reveal className="md:col-span-3">
          <FeaturedCard s={featuredTop} />
        </Reveal>
        {mid.map((s, i) => (
          <Reveal key={s.number} delay={i * 80}>
            <StandardCard s={s} />
          </Reveal>
        ))}
        <Reveal className="md:col-span-3">
          <FeaturedCard s={featuredBottom} />
        </Reveal>
      </div>
    </SectionShell>
  );
}
