export function HelyxLogo({ className }: { className?: string }) {
  return (
    <span className={className}>
      <svg width="28" height="28" viewBox="0 0 28 28" aria-label="Helyx Peptides" className="inline-block align-middle">
        {/* simple hexagon mark in medical blue */}
        <path
          d="M14 2.5l10 5.75v11.5L14 25.5 4 19.75V8.25L14 2.5z"
          fill="none"
          stroke="#1E5CA8"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <circle cx="14" cy="14" r="3.2" fill="#1E5CA8" />
      </svg>
      <span className="ml-2 align-middle font-heading text-[1.05rem] font-semibold tracking-tight text-foreground">
        Helyx <span className="text-muted-foreground">Peptides</span>
      </span>
    </span>
  );
}
