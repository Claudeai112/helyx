import { Reveal } from "@/components/reveal";
import { SectionShell, SectionHeader } from "@/components/sections/_shared";

const CARDS = [
  {
    icon: "🧪",
    title: "Handling and storage protocols",
    body: "Lyophilized peptides are sensitive to moisture and temperature. Recommended practice is storage at −20 °C in a sealed desiccant environment. Reconstitute with bacteriostatic water under aseptic conditions and aliquot into single-use volumes to avoid repeated freeze-thaw cycles.",
  },
  {
    icon: "❄️",
    title: "Cold-chain integrity",
    body: "An unbroken cold chain from synthesis to delivery is critical for maintaining peptide stability. Research-grade shipments include validated cold-pack packaging rated for the expected transit window, plus temperature-monitoring documentation available on request.",
  },
  {
    icon: "📋",
    title: "Purity and certificate of analysis",
    body: "Every research batch is accompanied by an independent third-party certificate of analysis (CoA) confirming peptide identity by mass spectrometry, purity by HPLC (≥ 98%), and — where applicable — sterility testing results.",
  },
];

export function EducationSection() {
  return (
    <SectionShell id="education">
      <Reveal>
        <SectionHeader
          tag="Research resources"
          title="Handling, storage and purity"
          description="Reference information for laboratory researchers working with peptide compounds."
        />
      </Reveal>
      <div className="mx-auto grid max-w-[1200px] gap-6 md:grid-cols-3">
        {CARDS.map((card) => (
          <Reveal key={card.title}>
            <div className="rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-sm">
              <div className="mb-3 text-2xl" aria-hidden="true">
                {card.icon}
              </div>
              <h3 className="mb-2 font-heading text-base font-semibold text-foreground">
                {card.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {card.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
