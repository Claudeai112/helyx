import { ReactNode } from "react";

export function SectionShell({
  id,
  className = "",
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={`px-6 py-16 md:px-8 ${className}`}
    >
      {children}
    </section>
  );
}

export function SectionHeader({
  tag,
  title,
  gradientTitle,
  description,
}: {
  tag?: string;
  title: string;
  gradientTitle?: string;
  description?: string;
}) {
  return (
    <div className="mx-auto mb-12 max-w-[900px] text-center">
      {tag && (
        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
          {tag}
        </p>
      )}
      <h2 className="mb-4 font-heading text-[clamp(1.75rem,3.5vw,2.75rem)] font-semibold text-foreground">
        {title}
        {gradientTitle && ` ${gradientTitle}`}
      </h2>
      {description && (
        <p className="mx-auto max-w-[680px] text-base text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}

/** Plain text passthrough — gradient/glow removed in the redesign. */
export function GradientText({ children }: { children: ReactNode }) {
  return <span className="text-primary">{children}</span>;
}
