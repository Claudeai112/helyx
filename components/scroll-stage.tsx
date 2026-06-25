"use client";

import { ReactNode, useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Wrap a list of cards — direct children get stagger-reveal on scroll.
 */
export function ScrollStage({
  children,
  selector = ":scope > *",
  y = 60,
  scale = 0.95,
  stagger = 0.12,
  className = "",
}: {
  children: ReactNode;
  selector?: string;
  y?: number;
  scale?: number;
  stagger?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = el.querySelectorAll<HTMLElement>(selector);
    if (!targets.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { y, opacity: 0, scale },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger,
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [selector, y, scale, stagger]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
