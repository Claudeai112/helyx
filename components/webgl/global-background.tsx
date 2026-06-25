"use client";

import dynamic from "next/dynamic";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

const GlobalScene = dynamic(
  () => import("./global-scene").then((m) => m.GlobalScene),
  { ssr: false }
);

/**
 * Fixed full-viewport WebGL scene that sits behind everything.
 * Mobile viewports and prefers-reduced-motion users get a static
 * shader-painted gradient fallback — no Canvas, no animation.
 */
export function GlobalWebglBackground() {
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();

  if (isMobile || reducedMotion) {
    return (
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-[10]"
        style={{
          background:
            "radial-gradient(ellipse 80% 65% at 50% 40%, rgba(108,92,231,0.32) 0%, rgba(167,139,250,0.16) 35%, rgba(0,206,201,0.10) 60%, rgba(5,5,16,0) 85%), #050510",
        }}
      />
    );
  }

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-[10] opacity-80"
    >
      <GlobalScene />
    </div>
  );
}
