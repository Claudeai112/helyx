import { VIALS_PER_REWARD, type LoyaltyProgress } from "@/lib/loyalty";

// Visual progress toward the next free vial. Pure presentational component —
// the count is computed server-side from paid orders.
export function LoyaltyTracker({ progress }: { progress: LoyaltyProgress }) {
  const { totalVials, earnedRewards, availableRewards, progressInCycle, untilNext } = progress;

  return (
    <div className="mt-6 max-w-md rounded-xl border border-border bg-card p-6">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-sm font-semibold text-foreground">Loyalty rewards</h2>
        <span className="text-xs text-muted-foreground">
          Buy {VIALS_PER_REWARD}, the next is free
        </span>
      </div>

      {availableRewards > 0 && (
        <div className="mt-4 rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
          🎉 You have {availableRewards} free vial{availableRewards === 1 ? "" : "s"} ready — applied
          automatically at checkout.
        </div>
      )}

      {/* 10-segment progress toward the next reward */}
      <div className="mt-4 flex gap-1.5">
        {Array.from({ length: VIALS_PER_REWARD }).map((_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full ${i < progressInCycle ? "bg-primary" : "bg-secondary"}`}
          />
        ))}
      </div>

      <p className="mt-3 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{progressInCycle}</span> / {VIALS_PER_REWARD}{" "}
        vials toward your next free vial — buy{" "}
        <span className="font-medium text-foreground">
          {untilNext} more vial{untilNext === 1 ? "" : "s"}
        </span>{" "}
        to earn it.
      </p>

      <p className="mt-1 text-xs text-muted-foreground">
        {totalVials} qualifying vial{totalVials === 1 ? "" : "s"} purchased
        {earnedRewards > 0 ? ` · ${earnedRewards} free vial${earnedRewards === 1 ? "" : "s"} earned` : ""}.
      </p>
    </div>
  );
}
