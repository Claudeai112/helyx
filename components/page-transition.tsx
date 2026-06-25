"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Fluid wipe on initial mount: purple panel slides in from bottom,
 * then slides out top. 0.6s each direction.
 */
export function PageTransition() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const id = window.setTimeout(() => setShow(false), 650);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="transition"
          aria-hidden
          initial={{ y: "100%" }}
          animate={{ y: "0%" }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.6, ease: [0.77, 0, 0.175, 1] }}
          className="pointer-events-none fixed inset-0 z-[9997]"
          style={{
            background:
              "linear-gradient(180deg, #6c5ce7 0%, #4c3fc7 50%, #050510 100%)",
          }}
        />
      )}
    </AnimatePresence>
  );
}
