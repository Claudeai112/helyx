"use client";
import { EmailCapture } from "@/components/marketing/email-capture";
import { Reveal } from "@/components/reveal";
import { SectionShell } from "@/components/sections/_shared";

export function SignupSection() {
  return (
    <SectionShell id="signup">
      <Reveal>
        <div className="mx-auto max-w-[560px] rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
          <h2 className="mb-2 font-heading text-2xl font-semibold text-foreground">
            Stay informed
          </h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Receive protocol updates and research announcements from the Helyx team.
          </p>
          <div className="flex justify-center">
            <EmailCapture source="homepage-signup" />
          </div>
          {/* SMS opt-in field — visual only; full consent flow is a later specification */}
          <div className="mt-4 flex items-center gap-3 rounded-lg border border-border bg-secondary/30 px-4 py-3 text-left">
            <input
              type="tel"
              placeholder="+1 (555) 000-0000"
              aria-label="Phone number for SMS updates"
              className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              disabled
            />
            <span className="shrink-0 text-xs text-muted-foreground">
              SMS updates — coming soon
            </span>
          </div>
        </div>
      </Reveal>
    </SectionShell>
  );
}
