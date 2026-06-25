import { ReactNode } from "react";
import { SplitHeading } from "../split-heading";

export function SectionShell({
  id,
  className = "",
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={`relative z-[2] px-6 py-16 md:px-8 md:py-28 ${className}`}
    >
      {children}
    </section>
  );
}

export function SectionHeader({
  tag,
  title,
  gradientTitle,
  description,
}: {
  tag: string;
  title: string;
  gradientTitle?: string;
  description?: string;
}) {
  return (
    <div className="relative mx-auto mb-16 flex max-w-[900px] flex-col items-center text-center">
      {/* Local radial scrim — dims the canvas only behind the heading block,
          fades to transparent at edges so it has no visible seam. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[-10%] inset-y-[-20%] -z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 60% 70% at 50% 50%, rgba(5,5,16,0.6) 0%, rgba(5,5,16,0.35) 45%, transparent 78%)",
        }}
      />
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[rgba(108,92,231,0.25)] bg-[rgba(108,92,231,0.12)] px-4 py-1.5 text-[0.75rem] font-medium uppercase tracking-[1px] text-[#a78bfa]">
        {tag}
      </div>
      <SplitHeading
        as="h2"
        className="mb-5 font-display text-[clamp(2rem,4vw,3rem)] font-bold leading-tight text-white"
      >
        {title}
        {gradientTitle && (
          <>
            {" "}
            <span className="gradient-text bg-[linear-gradient(135deg,#6c5ce7_0%,#a78bfa_30%,#00cec9_70%,#6c5ce7_100%)] bg-[length:200%_auto] bg-clip-text text-transparent">
              {gradientTitle}
            </span>
          </>
        )}
      </SplitHeading>
      {description && (
        <p className="max-w-[720px] text-[1.05rem] text-[#c8c8dc]">
          {description}
        </p>
      )}
    </div>
  );
}

export function GradientText({ children }: { children: ReactNode }) {
  return (
    <span className="gradient-text bg-[linear-gradient(135deg,#6c5ce7_0%,#a78bfa_30%,#00cec9_70%,#6c5ce7_100%)] bg-[length:200%_auto] bg-clip-text text-transparent">
      {children}
    </span>
  );
}
