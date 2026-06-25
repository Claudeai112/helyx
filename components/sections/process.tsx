import { Reveal } from "../reveal";
import { SectionHeader, SectionShell } from "./_shared";

const STEPS = [
  {
    number: "01",
    title: "Discovery Call",
    description:
      "We learn your business, your goals, and your market. This free strategy session maps out exactly what you need to win online.",
  },
  {
    number: "02",
    title: "Strategy & Design",
    description:
      "We build your custom website and craft a targeted ad strategy designed around your ideal customer and revenue targets.",
  },
  {
    number: "03",
    title: "Launch & Optimize",
    description:
      "Your website goes live and ads start running. We monitor everything in real-time, optimizing daily for maximum ROI.",
  },
  {
    number: "04",
    title: "Scale & Grow",
    description:
      "Once we know what's working, we scale it. More traffic, more leads, more revenue. Growth compounds over time as your campaigns mature.",
  },
];

export function ProcessSection() {
  return (
    <SectionShell id="process" className="bg-[rgba(108,92,231,0.02)]">
      <Reveal>
        <SectionHeader
          tag="02 // How It Works"
          title="From Zero to Revenue in"
          gradientTitle="4 Steps"
          description="We've streamlined our process so you can go from no online presence to a fully optimized growth system, fast."
        />
      </Reveal>
      <div className="relative mx-auto max-w-[1100px]">
        <div
          aria-hidden
          className="absolute left-[10%] right-[10%] top-[45px] hidden h-0.5 opacity-30 md:block"
          style={{
            background:
              "linear-gradient(90deg, transparent, #6c5ce7, #00cec9, transparent)",
          }}
        />
        <div className="grid gap-10 md:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.number} delay={i * 90}>
              <div className="relative flex flex-col items-center text-center">
                <div className="relative z-[2] flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-[#6c5ce7] to-[#00cec9] font-display text-[1.2rem] font-bold text-white shadow-[0_0_30px_rgba(108,92,231,0.3)]">
                  {s.number}
                </div>
                <h3 className="mt-6 font-display text-[1.1rem] font-semibold text-white">
                  {s.title}
                </h3>
                <p className="mt-2 max-w-[260px] text-[0.85rem] leading-[1.6] text-[#666688]">
                  {s.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
