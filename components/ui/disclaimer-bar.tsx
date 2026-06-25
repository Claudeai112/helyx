import { cn } from "@/lib/utils";

export const COMPLIANCE_DISCLAIMER =
  "Prescription products require an online consultation and approval by a licensed " +
  "healthcare provider. Individual eligibility is determined by the provider. This site " +
  "does not provide medical advice.";

export function DisclaimerBar({ className }: { className?: string }) {
  return (
    <p className={cn("text-xs leading-relaxed text-muted-foreground", className)}>
      {COMPLIANCE_DISCLAIMER}
    </p>
  );
}
