const COA_PDF = "/coa/sample-coa.pdf";

// COA / Lab-results trust section for product pages. Uses a clearly-labelled
// sample certificate; batch-specific COAs accompany orders.
export function CoaSection() {
  return (
    <section className="mt-8 rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-foreground">Certificate of Analysis</h2>
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
          ✓ Third-party tested
        </span>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Purity (HPLC)</dt>
          <dd className="font-medium text-foreground">≥ 99%</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Identity (MS)</dt>
          <dd className="font-medium text-foreground">Confirmed</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Batch testing</dt>
          <dd className="font-medium text-foreground">Per batch</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Analysis</dt>
          <dd className="font-medium text-foreground">Independent third-party lab</dd>
        </div>
      </dl>

      <a
        href={COA_PDF}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary"
      >
        ↓ Download Certificate of Analysis (PDF)
      </a>

      <p className="mt-3 text-xs text-muted-foreground">
        Sample certificate shown. A batch-specific COA is provided with each order; purity and
        identity are verified by independent third-party HPLC / MS analysis.
      </p>
    </section>
  );
}
