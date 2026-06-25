import { Reveal } from "../reveal";
import { SectionHeader, SectionShell } from "./_shared";

const RESULTS = [
  { value: "3.7x", label: "Average Return on Ad Spend", color: "#6c5ce7" },
  { value: "47%", label: "Lower Cost Per Lead", color: "#00cec9" },
  { value: "2.1x", label: "Avg. Revenue Growth in 3 to 6 Months", color: "#fd79a8" },
  { value: "3 Days", label: "Average Site Build Time", color: "#fdcb6e" },
];

export function ResultsSection() {
  return (
    <SectionShell id="results">
      <Reveal>
        <SectionHeader
          tag="04 // Proven Results"
          title="Numbers That"
          gradientTitle="Speak Volumes"
          description="Real growth takes time, not tricks. Here's what our clients typically see over the first 3 to 6 months of working with us."
        />
      </Reveal>
      <div className="mx-auto grid max-w-[1100px] gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {RESULTS.map((r, i) => (
          <Reveal key={r.label} delay={i * 80}>
            <div className="rounded-[20px] border border-white/10 bg-white/[0.02] p-10 text-center transition-all duration-400 hover:-translate-y-1 hover:border-[rgba(108,92,231,0.3)]">
              <div
                className="font-display text-[2.8rem] font-bold leading-none"
                style={{ color: r.color }}
              >
                {r.value}
              </div>
              <div className="mt-2 text-[0.85rem] text-[#7777aa]">{r.label}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
