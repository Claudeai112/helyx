"use client";

import { useLayoutEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { sceneState } from "./scene-state";

/**
 * Registers one GSAP ScrollTrigger per section. Each tweens sceneState
 * toward that section's target snapshot. With scrub:2 + power2.inOut
 * the visual transitions cross-fade smoothly across adjacent sections.
 */

type Snapshot = Partial<typeof sceneState>;

const SECTION_STATES: { id: string; state: Snapshot }[] = [
  {
    id: "#services",
    state: {
      distort: 1.3,
      tintR: 0.65, tintG: 0.54, tintB: 0.98, // violet dominant
      opIco: 0, opTorus: 1, opHelix: 0, opLattice: 0, opPrism: 0, opStar: 0,
      meshX: 0.9, meshY: -1.3, meshZ: -1.5,
      meshRotZ: 0.26,
      meshScale: 1.25,
      camX: 0.9, camY: 0.2, camZ: 5.4,
      bloomIntensity: 0.35,
    },
  },
  {
    id: "#process",
    state: {
      distort: 1.1,
      tintR: 0.0, tintG: 0.81, tintB: 0.78, // cyan dominant
      opIco: 0, opTorus: 0, opHelix: 1, opLattice: 0, opPrism: 0, opStar: 0,
      meshX: -0.6, meshY: -0.6, meshZ: -1.5,
      meshRotZ: 1.57,
      meshScale: 1.15,
      camX: -0.8, camY: 0.6, camZ: 5.0,
      bloomIntensity: 0.5,
    },
  },
  {
    id: "#results",
    state: {
      distort: 0.9,
      tintR: 0.4, tintG: 0.7, tintB: 0.82, // cyan + pink accent
      opIco: 0, opTorus: 0, opHelix: 0, opLattice: 1, opPrism: 0, opStar: 0,
      meshX: -0.3, meshY: -0.2, meshZ: -2.5,
      meshRotZ: 0.9,
      meshScale: 1.0,
      camX: -0.4, camY: 1.4, camZ: 4.6,
      bloomIntensity: 0.45,
    },
  },
  {
    id: "#pricing",
    state: {
      distort: 0.7,
      tintR: 0.5, tintG: 0.42, tintB: 0.94, // purple + violet
      opIco: 0, opTorus: 0, opHelix: 0, opLattice: 0, opPrism: 1, opStar: 0,
      meshX: 0, meshY: -1.3, meshZ: -2.8,
      meshRotZ: 0,
      meshScale: 1.1,
      camX: 0, camY: 0.1, camZ: 7.2,
      bloomIntensity: 0.4,
    },
  },
  {
    id: "#portfolio",
    state: {
      distort: 0.6,
      tintR: 0.3, tintG: 0.55, tintB: 0.85, // cool blue ambient
      opIco: 0, opTorus: 0, opHelix: 0, opLattice: 0.35, opPrism: 0.35, opStar: 0,
      meshX: 0.7, meshY: -0.6, meshZ: -3.5,
      meshRotZ: -0.3,
      meshScale: 0.95,
      camX: 0.7, camY: -0.4, camZ: 6.4,
      bloomIntensity: 0.35,
    },
  },
  {
    id: "#reviews",
    state: {
      distort: 0.8,
      tintR: 0.99, tintG: 0.80, tintB: 0.43, // amber accent
      opIco: 0, opTorus: 0, opHelix: 0, opLattice: 0, opPrism: 0, opStar: 1,
      meshX: 0, meshY: 0, meshZ: -2.5,
      meshRotZ: 0.5,
      meshScale: 1.1,
      camX: 0, camY: 0, camZ: 5.8,
      bloomIntensity: 0.55,
    },
  },
  {
    id: "#ads-work",
    state: {
      distort: 1.0,
      tintR: 0.0, tintG: 0.81, tintB: 0.78, // cyan streaks
      opIco: 0, opTorus: 0, opHelix: 0, opLattice: 0, opPrism: 0, opStar: 1,
      meshX: -1.2, meshY: 0.4, meshZ: -2,
      meshRotZ: 0.8,
      meshScale: 1.3,
      camX: -1.0, camY: 0.3, camZ: 5.4,
      bloomIntensity: 0.5,
    },
  },
  {
    id: "#faq",
    state: {
      distort: 0.45,
      tintR: 0.35, tintG: 0.25, tintB: 0.70, // deep purple
      opIco: 0.8, opTorus: 0, opHelix: 0, opLattice: 0, opPrism: 0, opStar: 0,
      meshX: 0, meshY: -1.2, meshZ: -1.8,
      meshRotZ: 0,
      meshScale: 1.0,
      camX: 0, camY: 0, camZ: 6.2,
      bloomIntensity: 0.3,
    },
  },
];

export function ScrollTimeline() {
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      SECTION_STATES.forEach(({ id, state }) => {
        const el = document.querySelector(id);
        if (!el) return;
        gsap.to(sceneState, {
          ...state,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            end: "bottom 20%",
            scrub: 2,
            invalidateOnRefresh: true,
          },
        });
      });
    });

    const id = window.setTimeout(() => ScrollTrigger.refresh(), 300);

    return () => {
      window.clearTimeout(id);
      ctx.revert();
    };
  }, []);

  return null;
}
