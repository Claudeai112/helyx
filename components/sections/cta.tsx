import Link from "next/link";
import { Reveal } from "../reveal";
import { GradientText } from "./_shared";

export function CtaSection() {
  return (
    <section className="relative z-[2] overflow-hidden px-6 py-24 text-center md:px-8 md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 size-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(108,92,231,0.12) 0%, transparent 60%)",
        }}
      />
      <div className="relative z-[2] mx-auto max-w-[650px]">
        <Reveal>
          <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold leading-tight text-white">
            Your Competitors Are Already Online.{" "}
            <GradientText>Are You?</GradientText>
          </h2>
          <p className="mt-4 text-[1.1rem] text-[#7777aa]">
            Every day without a website and ad strategy is a day your potential
            customers find someone else. Real growth starts with one step.
            Let&apos;s lay the foundation today and build momentum month by
            month.
          </p>
          <Link
            href="#book"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-[#6c5ce7] to-[#00cec9] px-8 py-4 font-semibold text-white shadow-[0_4px_25px_rgba(108,92,231,0.4)] transition-all hover:-translate-y-[3px] hover:shadow-[0_8px_40px_rgba(108,92,231,0.6)]"
          >
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            Start Growing Now
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
