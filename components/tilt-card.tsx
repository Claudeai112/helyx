"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ReactNode, useRef } from "react";

const MAX_TILT = 12;

export function TiltCard({
  children,
  className = "",
  float = false,
}: {
  children: ReactNode;
  className?: string;
  float?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [MAX_TILT, -MAX_TILT]), {
    stiffness: 240,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-MAX_TILT, MAX_TILT]), {
    stiffness: 240,
    damping: 18,
  });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
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

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      animate={float ? { y: [0, -8, 0] } : undefined}
      transition={float ? { duration: 6, repeat: Infinity, ease: "easeInOut" } : undefined}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
        transformStyle: "preserve-3d",
      }}
      className={`tilt-card will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
}
