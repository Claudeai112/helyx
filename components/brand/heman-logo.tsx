export function HemanLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Heman Peptide"
    >
      <defs>
        <linearGradient id="heman-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#28e0c8" />
          <stop offset="100%" stopColor="#00a896" />
        </linearGradient>
      </defs>
      {/* Stylised H letterform */}
      <rect x="4" y="6" width="5" height="36" rx="1.5" fill="white" opacity="0.92" />
      <rect x="4" y="21" width="18" height="5" rx="1.5" fill="white" opacity="0.92" />
      <rect x="17" y="6" width="5" height="36" rx="1.5" fill="white" opacity="0.92" />
      {/* Accent dot */}
      <circle cx="40" cy="10" r="6" fill="url(#heman-grad)" />
    </svg>
  );
}
