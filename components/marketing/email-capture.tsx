"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { captureEmail } from "@/app/actions/email-capture";

export function EmailCapture({ source }: { source: string }) {
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  if (done) return <p className="text-sm text-primary">You&apos;re on the list. Welcome to Pure Peps.</p>;
  return (
    <form
      action={async (fd) => {
        fd.set("source", source);
        const r = await captureEmail(fd);
        if (r.ok) setDone(true); else setError(r.error ?? "Something went wrong");
      }}
      className="flex w-full max-w-md gap-2"
    >
      <input
        name="email"
        type="email"
        required
        placeholder="you@email.com"
        className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
      />
      <input type="hidden" name="smsConsent" value="false" />
      <Button type="submit">Get early access</Button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </form>
  );
}
