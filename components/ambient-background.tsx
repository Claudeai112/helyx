"use client";

import { useEffect, useRef } from "react";

/**
 * Ambient background layer — grid + nebula blobs + vignette + cursor glow.
 * Fixed, pointer-events none, sits behind all content.
 */
export function AmbientBackground() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (glowRef.current) {
        glowRef.current.style.left = `${e.clientX}px`;
        glowRef.current.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <>
      {/* Grid */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(108,92,231,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(108,92,231,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 50%, black 20%, transparent 70%)",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 50%, black 20%, transparent 70%)",
        }}
      />

      {/* Nebula blobs */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <span className="nebula-blob n1" />
        <span className="nebula-blob n2" />
        <span className="nebula-blob n3" />
        <span className="nebula-blob n4" />
        <span className="nebula-blob n5" />
      </div>

      {/* Vignette */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(5,5,16,0.6) 100%)",
        }}
      />

      {/* Cursor glow */}
      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none fixed z-[1] hidden md:block"
        style={{
          width: 500,
          height: 500,
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(108,92,231,0.08) 0%, transparent 70%)",
          transition: "left 0.3s ease, top 0.3s ease",
        }}
      />
    </>
  );
}
