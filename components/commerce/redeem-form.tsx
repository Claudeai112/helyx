"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { redeemCode } from "@/app/actions/redeem";

export function RedeemForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  return (
    <form
      action={async (fd) => {
        setError(null);
        const r = await redeemCode(fd);
        if (r.ok) router.refresh();
        else setError(r.error ?? "Could not redeem that code.");
      }}
      className="flex w-full max-w-md flex-col gap-3"
    >
      <label htmlFor="code" className="text-sm text-muted-foreground">
        Access code
      </label>
      <div className="flex gap-2">
        <input
          id="code"
          name="code"
          required
          autoComplete="off"
          placeholder="XXXX-XXXX-XXXX"
          className="flex-1 rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm tracking-widest text-foreground uppercase"
        />
        <Button type="submit">Unlock</Button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </form>
  );
}
