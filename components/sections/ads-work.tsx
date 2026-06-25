import { Reveal } from "../reveal";
import { SectionHeader, SectionShell } from "./_shared";

type Phase = {
  label: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  tint: string;
  stroke: string;
};

const PHASES: Phase[] = [
  {
    label: "Phase 01",
    title: "Research & Strategy",
    description:
      "We study your market, competitors, and ideal customers. Then we build an ad strategy around where your audience actually spends time online.",
    tint: "rgba(108,92,231,0.15)",
    stroke: "#6c5ce7",
    icon: (
      <svg width="28" height="28" fill="none" stroke="#6c5ce7" strokeWidth={2} viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
    ),
  },
  {
    label: "Phase 02",
    title: "Creative & Launch",
    description:
      "We write the ad copy, design the visuals, set up the targeting, and launch your campaigns across the platforms that make sense for your business.",
    tint: "rgba(0,206,201,0.15)",
    stroke: "#00cec9",
    icon: (
      <svg width="28" height="28" fill="none" stroke="#00cec9" strokeWidth={2} viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
  },
  {
    label: "Phase 03",
    title: "Optimize & Scale",
    description:
      "We monitor performance daily, cut what is not working, and put more budget behind what is. Over time, your cost per lead drops and your reach grows.",
    tint: "rgba(253,121,168,0.15)",
    stroke: "#fd79a8",
    icon: (
      <svg width="28" height="28" fill="none" stroke="#fd79a8" strokeWidth={2} viewBox="0 0 24 24">
        <path d="M12 20V10M18 20V4M6 20v-4" />
      </svg>
    ),
  },
];

export function AdsWorkSection() {
  return (
    <SectionShell id="ads-work">
      <Reveal>
        <SectionHeader
          tag="08 // Ad Campaigns"
          title="How Our"
          gradientTitle="Ads Work"
          description="We take a data-first approach to ad management. Here is how we go from strategy to results for your business."
        />
      </Reveal>
      <div className="mx-auto grid max-w-[1100px] gap-6 md:grid-cols-3">
        {PHASES.map((p, i) => (
          <Reveal key={p.label} delay={i * 90}>
          <div
            className="rounded-[20px] border border-white/10 bg-white/[0.02] p-8 transition-all duration-400 hover:-translate-y-1 hover:border-[rgba(108,92,231,0.4)]"
          >
            <div className="text-[0.7rem] font-semibold uppercase tracking-[1.5px] text-[#55557a]">
              {p.label}
            </div>
            <div
              className="mt-4 inline-flex size-14 items-center justify-center rounded-2xl"
              style={{ background: p.tint }}
            >
              {p.icon}
            </div>
            <h3 className="mt-5 font-display text-[1.2rem] font-bold text-white">
              {p.title}
            </h3>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-[#7777aa]">
              {p.description}
            </p>
          </div>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
