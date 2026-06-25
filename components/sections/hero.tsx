import { MagneticButton } from "../magnetic-button";
import { SplitHeading } from "../split-heading";
import { GradientText } from "./_shared";

const STATS = [
  { value: "Rx", label: "Prescriber-Approved" },
  { value: "48h", label: "Avg. Consult Turnaround" },
  { value: "100%", label: "U.S. Licensed Partners" },
];

const PROTOCOLS = [
  "GLP-1 Support",
  "Recovery",
  "Longevity",
  "Metabolic Health",
  "Performance",
  "Hormone Support",
];

export function HeroSection() {
  return (
    <>
      <section
        id="hero"
        className="relative z-[2] flex min-h-screen items-center justify-center overflow-hidden px-6 pb-16 pt-32 md:px-8"
      >
        {/* Local hero vignette over the global WebGL canvas */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-[1]"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(5,5,16,0) 0%, rgba(5,5,16,0.55) 55%, rgba(5,5,16,0.85) 100%)",
          }}
        />
        <div className="relative z-[2] mx-auto max-w-[900px] text-center">
          <div className="fade-in-up mb-8 inline-flex items-center gap-2 rounded-full border border-[rgba(40,224,200,0.25)] bg-[rgba(40,224,200,0.1)] px-5 py-2 text-[0.8rem] text-[#28e0c8]">
            <span className="pulse-dot inline-block size-2 rounded-full bg-[#28e0c8]" />
            Provider-guided peptide protocols — consultation required
          </div>
          <div
            className="mb-6 inline-block rounded-2xl bg-[#050510]/70 px-6 py-4 md:px-8 md:py-6"
            style={{ backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
          >
            <SplitHeading
              as="h1"
              className="font-display text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[1.1]"
            >
              Precision Peptide Protocols.{" "}
              <span className="gradient-text bg-[linear-gradient(135deg,#28e0c8_0%,#00a896_50%,#28e0c8_100%)] bg-[length:200%_auto] bg-clip-text text-transparent">
                Prescriber-Guided.
              </span>
            </SplitHeading>
          </div>
          <div
            className="fade-in-up delay-2 mx-auto mb-10 max-w-[680px] rounded-2xl bg-[#050510]/70 px-6 py-5 text-center"
            style={{ backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
          >
            <p className="text-[1.15rem] text-[#c8c8dc]">
              Heman Peptide connects you with licensed healthcare providers who evaluate
              your eligibility and, where appropriate, prescribe peptide protocols for
              GLP-1 support, recovery, longevity, and performance. Every order begins
              with a consultation.
            </p>
          </div>

          {/* Four required CTAs */}
          <div className="fade-in-up delay-3 flex flex-wrap justify-center gap-4">
            <MagneticButton
              as="a"
              href="/shop"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-[#28e0c8] to-[#00a896] px-7 py-3.5 font-semibold text-[#050510] shadow-[0_4px_25px_rgba(40,224,200,0.4)] transition-[box-shadow] hover:shadow-[0_8px_40px_rgba(40,224,200,0.6)]"
            >
              Shop Peptides
            </MagneticButton>
            <MagneticButton
              as="a"
              href="/category/glp-1"
              className="inline-flex items-center gap-2 rounded-full border border-[rgba(40,224,200,0.3)] bg-[rgba(40,224,200,0.06)] px-7 py-3.5 font-semibold text-[#28e0c8] transition-all hover:border-[rgba(40,224,200,0.6)] hover:bg-[rgba(40,224,200,0.1)]"
            >
              View GLP-1 Collection
            </MagneticButton>
            <MagneticButton
              as="a"
              href="/consultation"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-7 py-3.5 font-semibold text-[#e0e0f0] transition-[background-color,border-color] hover:border-[rgba(40,224,200,0.4)] hover:bg-white/[0.08]"
            >
              Start a Consultation
            </MagneticButton>
            <MagneticButton
              as="a"
              href="/waitlist?program=ambassador"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-7 py-3.5 font-semibold text-[#e0e0f0] transition-[background-color,border-color] hover:border-[rgba(40,224,200,0.4)] hover:bg-white/[0.08]"
            >
              Ambassador Program
            </MagneticButton>
          </div>

          <div
            className="fade-in-up delay-4 mx-auto mt-14 inline-flex flex-wrap justify-center gap-x-12 gap-y-6 rounded-2xl bg-[#050510]/70 px-8 py-5"
            style={{ backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
          >
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display text-[2.2rem] font-bold">
                  <GradientText>{s.value}</GradientText>
                </div>
                <div className="mt-1 text-[0.8rem] uppercase tracking-[1px] text-[#a0a0c0]">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Protocol trust bar */}
      <div className="relative z-[2] overflow-hidden border-y border-white/5 bg-white/[0.02] py-8">
        <div className="mb-4 text-center text-[0.75rem] uppercase tracking-[2px] text-[#44446a]">
          Provider-reviewed protocol areas
        </div>
        <div className="overflow-hidden">
          <div className="marquee-track flex w-max gap-10 px-4">
            {[...PROTOCOLS, ...PROTOCOLS].map((p, i) => (
              <span
                key={`${p}-${i}`}
                className="whitespace-nowrap rounded-xl border border-white/5 bg-white/[0.02] px-6 py-3 text-[0.9rem] text-[#666688]"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
