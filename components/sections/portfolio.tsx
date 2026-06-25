import Image from "next/image";
import { Reveal } from "../reveal";
import { TiltCard } from "../tilt-card";
import { SectionHeader, SectionShell } from "./_shared";

type Project = {
  title: string;
  description: string;
  tag: string;
  gradient: string;
  bar: string;
  thumb: string;
};

const PROJECTS: Project[] = [
  {
    title: "Enzo Insurance Group",
    description:
      "Full website build with quote forms, coverage breakdowns, and Google Ads campaign",
    tag: "Website + Ads",
    gradient:
      "linear-gradient(135deg, rgba(37,99,235,0.18), rgba(124,58,237,0.12))",
    bar: "linear-gradient(90deg, #2563EB, #7C3AED, #06B6D4)",
    thumb: "/images/portfolio/enzo.svg",
  },
  {
    title: "GreenEdge Landscaping",
    description:
      "Custom website with quote request forms, service showcase, and Facebook Ads setup",
    tag: "Website + Ads",
    gradient:
      "linear-gradient(135deg, rgba(45,106,79,0.18), rgba(82,183,136,0.12))",
    bar: "linear-gradient(90deg, #2D6A4F, #40916C, #52B788)",
    thumb: "/images/portfolio/greenedge.svg",
  },
  {
    title: "Bright Family Dental",
    description:
      "Website redesign with appointment booking, patient forms, and Instagram Ads campaign",
    tag: "Website + Ads",
    gradient:
      "linear-gradient(135deg, rgba(0,119,182,0.18), rgba(0,180,216,0.12))",
    bar: "linear-gradient(90deg, #0077B6, #00B4D8, #90E0EF)",
    thumb: "/images/portfolio/bright.svg",
  },
];

export function PortfolioSection() {
  return (
    <SectionShell id="portfolio">
      <Reveal>
        <SectionHeader
          tag="06 // Our Work"
          title="Recent"
          gradientTitle="Projects"
          description="A look at some of the websites and campaigns we have built for real businesses."
        />
      </Reveal>
      <div className="mx-auto grid max-w-[1200px] gap-8 md:grid-cols-3">
        {PROJECTS.map((p, i) => (
          <Reveal key={p.title} delay={i * 90}>
          <TiltCard className="h-full">
          <article
            className="group overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.03] backdrop-blur-sm"
          >
            <div
              className="relative flex aspect-[16/10] items-center justify-center overflow-hidden"
              style={{ background: p.gradient }}
            >
              <div className="portfolio-float size-full">
                <Image
                  src={p.thumb}
                  alt={p.title}
                  width={640}
                  height={400}
                  className="size-full object-cover"
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-white">
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                  </svg>
                  View Live Site
                </span>
              </div>
            </div>
            <div className="h-[3px] w-full" style={{ background: p.bar }} />
            <div className="p-6">
              <h4 className="font-display text-[1.15rem] font-bold text-white">
                {p.title}
              </h4>
              <p className="mt-2 text-[0.9rem] text-[#7777aa]">
                {p.description}
              </p>
              <span className="mt-4 inline-block rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[0.7rem] uppercase tracking-[1px] text-[#a0a0c0]">
                {p.tag}
              </span>
            </div>
          </article>
          </TiltCard>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
