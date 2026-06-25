"use client";

import { ReactNode, useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * GSAP-powered reveal. Plays a y+scale+opacity tween when the element
 * enters the viewport. Works with Lenis smooth scroll because Lenis
 * proxies scroll events into ScrollTrigger.update from LenisProvider.
 */
export function Reveal({
  children,
  delay = 0,
  y = 60,
  scale = 0.95,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  scale?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Set starting state synchronously to avoid FOUC before ScrollTrigger fires.
    gsap.set(el, { y, opacity: 0, scale });

    const ctx = gsap.context(() => {
      gsap.to(el, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.9,
        ease: "power3.out",
        delay: delay / 1000,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none reverse",
          invalidateOnRefresh: true,
        },
      });
    }, el);

    // Nudge ScrollTrigger to recalc positions once the DOM settles.
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 50);

    return () => {
      window.clearTimeout(id);
      ctx.revert();
    };
  }, [delay, y, scale]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </div>
  );
}
