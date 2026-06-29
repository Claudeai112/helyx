// Loyalty program: buy 10 qualifying vials, the next vial is free.
// Pure logic only (no DB) so it's easy to unit-test.

export const VIALS_PER_REWARD = 10;

export type LoyaltyProgress = {
  totalVials: number; // lifetime qualifying (peptide) vials purchased
  earnedRewards: number; // free vials earned over all time
  redeemedRewards: number; // free vials already used at checkout
  availableRewards: number; // earned but not yet redeemed (ready to use)
  progressInCycle: number; // 0..VIALS_PER_REWARD-1 toward the next reward
  untilNext: number; // vials remaining to earn the next free vial (1..VIALS_PER_REWARD)
};

export function loyaltyProgress(totalVials: number, redeemedRewards = 0): LoyaltyProgress {
  const total = Math.max(0, Math.floor(totalVials));
  const redeemed = Math.max(0, Math.floor(redeemedRewards));
  const earnedRewards = Math.floor(total / VIALS_PER_REWARD);
  const availableRewards = Math.max(0, earnedRewards - redeemed);
  const progressInCycle = total % VIALS_PER_REWARD;
  const untilNext = VIALS_PER_REWARD - progressInCycle; // 1..VIALS_PER_REWARD
  return {
    totalVials: total,
    earnedRewards,
    redeemedRewards: redeemed,
    availableRewards,
    progressInCycle,
    untilNext,
  };
}

// A free vial is the cheapest *eligible* (peptide, not a supply) vial in the
// order. Returns the discount in cents, or 0 if nothing is eligible.
export function freeVialDiscountCents(
  lines: { priceCents: number; eligible: boolean }[],
): number {
  const prices = lines.filter((l) => l.eligible && l.priceCents > 0).map((l) => l.priceCents);
  return prices.length ? Math.min(...prices) : 0;
}
