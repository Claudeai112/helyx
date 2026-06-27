"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { submitBulkInquiry } from "@/app/actions/bulk-inquiry";

const fieldCls =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground";
const labelCls = "mb-1 block text-sm font-medium text-foreground";

export function BulkOrderForm() {
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (done) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <p className="text-lg font-semibold text-foreground">Thanks — your bulk inquiry was received.</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Our research-supply team will follow up by email. For anything urgent, reach us at{" "}
          <a href="mailto:info@helyxpeps.com" className="underline underline-offset-4 hover:text-foreground">
            info@helyxpeps.com
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form
      action={async (fd) => {
        setError(null);
        setSubmitting(true);
        fd.set("ruoConfirmed", fd.get("ruoConfirmed") === "on" ? "true" : "false");
        const r = await submitBulkInquiry(fd);
        setSubmitting(false);
        if (r.ok) setDone(true);
        else setError(r.error ?? "Something went wrong");
      }}
      className="rounded-xl border border-border bg-card p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="fullName" className={labelCls}>Full name *</label>
          <input id="fullName" name="fullName" required className={fieldCls} />
        </div>
        <div>
          <label htmlFor="email" className={labelCls}>Work email *</label>
          <input id="email" name="email" type="email" required className={fieldCls} placeholder="you@organization.com" />
        </div>
        <div>
          <label htmlFor="phone" className={labelCls}>Phone</label>
          <input id="phone" name="phone" type="tel" className={fieldCls} />
        </div>
        <div>
          <label htmlFor="organization" className={labelCls}>Organization / institution *</label>
          <input id="organization" name="organization" required className={fieldCls} />
        </div>
        <div>
          <label htmlFor="role" className={labelCls}>Role / title</label>
          <input id="role" name="role" className={fieldCls} />
        </div>
        <div>
          <label htmlFor="quantities" className={labelCls}>Estimated quantities *</label>
          <input id="quantities" name="quantities" required className={fieldCls} placeholder="e.g. 50 vials BPC-157, 25 vials TB-500" />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="compounds" className={labelCls}>Compounds / products of interest *</label>
        <textarea id="compounds" name="compounds" required rows={3} className={fieldCls} placeholder="List the compounds and strengths you're interested in" />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="poNumber" className={labelCls}>Purchase order number</label>
          <input id="poNumber" name="poNumber" className={fieldCls} />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="notes" className={labelCls}>Additional notes</label>
        <textarea id="notes" name="notes" rows={3} className={fieldCls} />
      </div>

      <label className="mt-5 flex cursor-pointer items-start gap-2 text-sm text-foreground">
        <input type="checkbox" name="ruoConfirmed" required className="mt-0.5" />
        <span>I confirm these compounds are for in-vitro / non-clinical research use only.</span>
      </label>

      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

      <Button type="submit" size="lg" className="mt-5" disabled={submitting}>
        {submitting ? "Submitting…" : "Submit bulk inquiry"}
      </Button>
    </form>
  );
}
