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
              You must be 21 or older
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              We&apos;re sorry, but you must be at least 21 years of age to access this site. All
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
              Age Verification
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              You must be 21 years of age or older to enter. All products are intended for
              laboratory and research use only. Please confirm your age to continue.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Button size="lg" onClick={accept} disabled={pending}>
                {pending ? "Confirming…" : "I am 21 or older"}
              </Button>
              <button
                type="button"
                onClick={() => setDenied(true)}
                className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
              >
                I am under 21
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
