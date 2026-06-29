import { VIALS_PER_REWARD, type LoyaltyProgress } from "@/lib/loyalty";

// Visual progress toward the next free vial. Pure presentational component —
// the count is computed server-side from paid orders.
export function LoyaltyTracker({ progress }: { progress: LoyaltyProgress }) {
  const { totalVials, earnedRewards, progressInCycle, untilNext } = progress;
  const justEarned = totalVials > 0 && progressInCycle === 0;

  return (
    <div className="mt-6 max-w-md rounded-xl border border-border bg-card p-6">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-sm font-semibold text-foreground">Loyalty rewards</h2>
        <span className="text-xs text-muted-foreground">
          Buy {VIALS_PER_REWARD}, the next is free
        </span>
      </div>

      {/* 10-segment progress for the current cycle */}
      <div className="mt-4 flex gap-1.5">
        {Array.from({ length: VIALS_PER_REWARD }).map((_, i) => {
          const filled = justEarned || i < progressInCycle;
          return (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full ${filled ? "bg-primary" : "bg-secondary"}`}
            />
          );
        })}
      </div>

      <p className="mt-3 text-sm text-muted-foreground">
        {justEarned ? (
          <>🎉 You&apos;ve earned a free vial — it&apos;ll be applied to your next order.</>
        ) : (
          <>
            <span className="font-medium text-foreground">{progressInCycle}</span> / {VIALS_PER_REWARD}{" "}
            vials — buy{" "}
            <span className="font-medium text-foreground">
              {untilNext} more vial{untilNext === 1 ? "" : "s"}
            </span>{" "}
            to earn a free one.
          </>
        )}
      </p>

      <p className="mt-1 text-xs text-muted-foreground">
        {totalVials} qualifying vial{totalVials === 1 ? "" : "s"} purchased
        {earnedRewards > 0 ? ` · ${earnedRewards} free vial${earnedRewards === 1 ? "" : "s"} earned` : ""}.
      </p>
    </div>
  );
}
