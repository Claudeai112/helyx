"use client";

import dynamic from "next/dynamic";
import { useIsMobile } from "@/hooks/use-is-mobile";

const HeroScene = dynamic(
  () => import("./hero-scene").then((m) => m.HeroScene),
  { ssr: false }
);

export function HeroCanvas() {
  const isMobile = useIsMobile();

  return (
    <>
      {isMobile ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-[2]"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 50% 45%, rgba(108,92,231,0.35), rgba(0,206,201,0.12) 50%, transparent 80%)",
          }}
        />
      ) : (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-[2] opacity-70"
        >
          <HeroScene />
        </div>
      )}
      {/* Dark radial vignette over the canvas, under the copy */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-[1]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(5,5,16,0) 0%, rgba(5,5,16,0.55) 55%, rgba(5,5,16,0.85) 100%)",
        }}
      />
    </>
  );
}
