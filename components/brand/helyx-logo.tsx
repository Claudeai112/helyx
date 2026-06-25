/**
 * Helyx mark: an animated double-helix that draws its two strands on load, snaps
 * its base-pair rungs in, then settles into a slow, living-molecule pulse. One
 * strand + the node use `currentColor` so the mark stays crisp on both the light
 * navbar and the dark footer; the other strand and rungs carry the teal gradient.
 * Animation is pure CSS (see `.helyx-*` keyframes in globals.css) and respects
 * prefers-reduced-motion. Mark only — callers add the "Helyx Peptides" wordmark.
 */
export function HelyxLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Helyx"
      fill="none"
    >
      <defs>
        <linearGradient id="helyx-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#28e0c8" />
          <stop offset="100%" stopColor="#00a896" />
        </linearGradient>
      </defs>

      {/* base-pair rungs */}
      <line className="helyx-rung" x1="18" y1="12" x2="30" y2="12" stroke="url(#helyx-grad)" strokeWidth="2" strokeLinecap="round" />
      <line className="helyx-rung" x1="18.5" y1="18" x2="29.5" y2="18" stroke="url(#helyx-grad)" strokeWidth="2" strokeLinecap="round" />
      <line className="helyx-rung" x1="18.5" y1="30" x2="29.5" y2="30" stroke="url(#helyx-grad)" strokeWidth="2" strokeLinecap="round" />
      <line className="helyx-rung" x1="18" y1="36" x2="30" y2="36" stroke="url(#helyx-grad)" strokeWidth="2" strokeLinecap="round" />

      {/* two helix strands */}
      <path
        className="helyx-strand helyx-strand-back"
        d="M24 5 C 34 12 34 17 24 24 C 14 31 14 36 24 43"
        pathLength={1}
        stroke="currentColor"
        strokeOpacity="0.85"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        className="helyx-strand helyx-strand-front"
        d="M24 5 C 14 12 14 17 24 24 C 34 31 34 36 24 43"
        pathLength={1}
        stroke="url(#helyx-grad)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      {/* center crossing node */}
      <circle className="helyx-node" cx="24" cy="24" r="2.4" fill="currentColor" />
    </svg>
  );
}
