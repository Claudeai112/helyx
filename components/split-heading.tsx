"use client";

import { createElement, ReactNode, useLayoutEffect, useRef } from "react";
import SplitType from "split-type";
import { gsap, ScrollTrigger } from "@/lib/gsap";

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export function SplitHeading({
  children,
  as = "h2",
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  as?: HeadingTag;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const split = new SplitType(el, { types: "chars,words" });

    const ctx = gsap.context(() => {
      gsap.from(split.chars, {
        y: 100,
        opacity: 0,
        stagger: 0.018,
        duration: 0.8,
        ease: "power3.out",
        delay,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    }, el);

    return () => {
      ctx.revert();
      split.revert();
      ScrollTrigger.getAll()
        .filter((st) => st.trigger === el)
        .forEach((st) => st.kill());
    };
  }, [delay]);

  // eslint-disable-next-line react-hooks/refs
  return createElement(as, { ref, className }, children);
}
