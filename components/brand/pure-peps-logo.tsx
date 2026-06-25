export function PurePepsLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Pure Peps"
    >
      <defs>
        <linearGradient id="pp-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#28e0c8" />
          <stop offset="100%" stopColor="#00a896" />
        </linearGradient>
      </defs>
      {/* Rounded tile */}
      <rect x="2" y="2" width="44" height="44" rx="12" fill="url(#pp-grad)" opacity="0.14" />
      <rect
        x="2.75"
        y="2.75"
        width="42.5"
        height="42.5"
        rx="11.25"
        fill="none"
        stroke="url(#pp-grad)"
        strokeWidth="1.5"
        opacity="0.5"
      />
      {/* PP monogram */}
      <text
        x="24"
        y="24"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="var(--font-display), system-ui, sans-serif"
        fontSize="22"
        fontWeight="700"
        letterSpacing="-1"
        fill="white"
      >
        PP
      </text>
      {/* Accent dot */}
      <circle cx="38" cy="11" r="3.5" fill="url(#pp-grad)" />
    </svg>
  );
}
