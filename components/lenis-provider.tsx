"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Force ScrollTrigger to recalc positions at multiple settle points.
    // Without this, triggers registered during hydration measure stale
    // layout and never fire for sections below the initial viewport.
    const refreshes = [
      window.setTimeout(() => ScrollTrigger.refresh(), 100),
      window.setTimeout(() => ScrollTrigger.refresh(), 400),
      window.setTimeout(() => ScrollTrigger.refresh(), 1200),
    ];

    const onLoad = () => ScrollTrigger.refresh();
    if (document.readyState === "complete") {
      ScrollTrigger.refresh();
    } else {
      window.addEventListener("load", onLoad);
    }

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      refreshes.forEach((id) => window.clearTimeout(id));
      window.removeEventListener("load", onLoad);
      window.removeEventListener("resize", onResize);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
