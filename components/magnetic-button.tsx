"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { ReactNode, useRef } from "react";

type MagneticProps = {
  children: ReactNode;
  className?: string;
  strength?: number;
  href?: string;
  as?: "a" | "button";
  onClick?: () => void;
  type?: "button" | "submit";
};

/**
 * Subtle magnetic pull toward the cursor, spring-eased. Renders as
 * either <a> or <button>. Framer Motion types for motion.a collide
 * with native anchor drag handlers, so we use a plain cast.
 */
export function MagneticButton({
  children,
  className = "",
  strength = 8,
  href,
  as = href ? "a" : "button",
  onClick,
  type,
}: MagneticProps) {
  const ref = useRef<HTMLElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const sx = useSpring(useTransform(x, (v) => v * strength), {
    stiffness: 200,
    damping: 15,
  });
  const sy = useSpring(useTransform(y, (v) => v * strength), {
    stiffness: 200,
    damping: 15,
  });

  const handleMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (as === "a") {
    return (
      <motion.a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        onClick={onClick}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{ x: sx, y: sy }}
        className={className}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type ?? "button"}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: sx, y: sy }}
      className={className}
    >
      {children}
    </motion.button>
  );
}
