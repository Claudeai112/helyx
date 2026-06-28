"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signIn, signUp } from "@/app/actions/auth";

const fieldCls =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground";
const labelCls = "mb-1 block text-sm font-medium text-foreground";

export function AuthForms() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const isSignup = mode === "signup";

  return (
    <div className="mx-auto max-w-md rounded-xl border border-border bg-card p-6">
      <div className="mb-5 flex rounded-lg border border-border p-1 text-sm">
        <button
          type="button"
          onClick={() => { setMode("signin"); setError(null); }}
          className={`flex-1 rounded-md px-3 py-1.5 font-medium transition-colors ${mode === "signin" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => { setMode("signup"); setError(null); }}
          className={`flex-1 rounded-md px-3 py-1.5 font-medium transition-colors ${mode === "signup" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          Create account
        </button>
      </div>

      <form
        // Re-mount fields when switching modes so stale values don't carry over.
        key={mode}
        action={async (fd) => {
          setError(null);
          setPending(true);
          const r = isSignup ? await signUp(fd) : await signIn(fd);
          setPending(false);
          if (r.ok) router.refresh();
          else setError(r.error ?? "Something went wrong");
        }}
      >
        {isSignup && (
          <div className="mb-4">
            <label htmlFor="name" className={labelCls}>Name *</label>
            <input id="name" name="name" required className={fieldCls} />
          </div>
        )}
        <div className="mb-4">
          <label htmlFor="email" className={labelCls}>Email *</label>
          <input id="email" name="email" type="email" required className={fieldCls} />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className={labelCls}>Password *</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={isSignup ? 8 : undefined}
            autoComplete={isSignup ? "new-password" : "current-password"}
            className={fieldCls}
          />
          {isSignup && <p className="mt-1 text-xs text-muted-foreground">At least 8 characters.</p>}
        </div>

        {error && <p className="mb-3 text-sm text-destructive">{error}</p>}

        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? "Please wait…" : isSignup ? "Create account" : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
