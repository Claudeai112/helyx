"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

/**
 * Animated Helyx mark: a double-helix that draws its two strands on mount, snaps
 * its base-pair rungs in, then settles into a slow, subtle "living molecule"
 * pulse traveling down the rungs. Respects prefers-reduced-motion (draw-in only,
 * no loop). Pure SVG + transform/opacity, so it's cheap to run in the navbar.
 */
const RUNGS = [
  { y: 12, x1: 18, x2: 30 },
  { y: 18, x1: 18.5, x2: 29.5 },
  { y: 30, x1: 18.5, x2: 29.5 },
  { y: 36, x1: 18, x2: 30 },
];

export function HelyxLogo({ className }: { className?: string }) {
  const reduce = useReducedMotion();

  const strand: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    show: (i: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 1.1, ease: "easeInOut", delay: i * 0.12 },
        opacity: { duration: 0.3, delay: i * 0.12 },
      },
    }),
  };

  const rungEl: Variants = {
    hidden: { scaleX: 0, opacity: 0 },
    show: (i: number) => ({
      scaleX: 1,
      opacity: reduce ? 0.85 : [0.3, 1, 0.45],
      transition: {
        scaleX: { duration: 0.4, ease: "backOut", delay: 0.55 + i * 0.08 },
        opacity: reduce
          ? { duration: 0.4, delay: 0.55 + i * 0.08 }
          : {
              duration: 2.4,
              delay: 0.55 + i * 0.18,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            },
      },
    }),
  };

  return (
    <motion.svg
      className={className}
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      initial="hidden"
      animate="show"
      role="img"
      aria-label="Helyx"
    >
      <defs>
        <linearGradient id="helyx-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#28e0c8" />
          <stop offset="100%" stopColor="#00a896" />
        </linearGradient>
      </defs>

      {/* base-pair rungs */}
      {RUNGS.map((r, i) => (
        <motion.line
          key={r.y}
          x1={r.x1}
          y1={r.y}
          x2={r.x2}
          y2={r.y}
          stroke="url(#helyx-grad)"
          strokeWidth={2}
          strokeLinecap="round"
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
          custom={i}
          variants={rungEl}
        />
      ))}

      {/* two helix strands */}
      <motion.path
        d="M24 5 C 34 12 34 17 24 24 C 14 31 14 36 24 43"
        fill="none"
        stroke="white"
        strokeOpacity={0.95}
        strokeWidth={2.4}
        strokeLinecap="round"
        custom={0}
        variants={strand}
      />
      <motion.path
        d="M24 5 C 14 12 14 17 24 24 C 34 31 34 36 24 43"
        fill="none"
        stroke="url(#helyx-grad)"
        strokeWidth={2.4}
        strokeLinecap="round"
        custom={1}
        variants={strand}
      />

      {/* center crossing node */}
      <motion.circle
        cx={24}
        cy={24}
        r={2.4}
        fill="white"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.05, type: "spring", stiffness: 320, damping: 14 }}
      />
    </motion.svg>
  );
}
