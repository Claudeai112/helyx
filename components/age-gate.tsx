"use client";
import { useState } from "react";
import { HelyxLogo } from "@/components/brand/helyx-logo";
import { Button } from "@/components/ui/button";
import { confirmAge } from "@/app/actions/age";

// Full-screen age-verification gate. The root layout only renders this when the
// confirmation cookie is absent, so confirmed visitors never see it.
export function AgeGate() {
  const [denied, setDenied] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [pending, setPending] = useState(false);

  if (hidden) return null;

  async function accept() {
    setPending(true);
    await confirmAge();
    setHidden(true);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 px-6 backdrop-blur-sm"
    >
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-xl">
        <div className="mb-5 flex items-center justify-center gap-2">
          <HelyxLogo className="size-7" />
          <span className="font-heading text-lg font-semibold">
            Helyx <span className="text-muted-foreground">Peptides</span>
          </span>
        </div>

        {denied ? (
          <>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              This site is for qualified researchers
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              We&apos;re sorry, but access requires that you are a qualified researcher (or
              purchasing on behalf of a research entity) and at least 18 years of age. All
              products are sold for laboratory and research use only.
            </p>
            <button
              type="button"
              onClick={() => setDenied(false)}
              className="mt-6 text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              Go back
            </button>
          </>
        ) : (
          <>
            <h2
              id="age-gate-title"
              className="text-xl font-semibold tracking-tight text-foreground"
            >
              Research-Use Confirmation
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              I confirm I am a qualified researcher or purchasing on behalf of a research
              entity, and that these products are for laboratory research use only — not for
              human or animal consumption. I am at least 18 years of age.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Button size="lg" onClick={accept} disabled={pending}>
                {pending ? "Confirming…" : "I confirm"}
              </Button>
              <button
                type="button"
                onClick={() => setDenied(true)}
                className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
              >
                I do not qualify
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
