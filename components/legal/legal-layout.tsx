export function LegalLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="text-4xl font-semibold text-foreground">{title}</h1>
      <div className="mt-8 space-y-4 text-muted-foreground [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground">
        {children}
      </div>
    </div>
  );
}
