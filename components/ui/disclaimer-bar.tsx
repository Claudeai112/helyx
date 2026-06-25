import { cn } from "@/lib/utils";

export const COMPLIANCE_DISCLAIMER =
  "For research use only. Not for human consumption. Products are intended for " +
  "laboratory and research purposes.";

export function DisclaimerBar({ className }: { className?: string }) {
  return (
    <p className={cn("text-xs leading-relaxed text-muted-foreground", className)}>
      {COMPLIANCE_DISCLAIMER}
    </p>
  );
}
