// Loyalty program: buy 10 qualifying vials, the next vial is free.
// Pure logic only (no DB) so it's easy to unit-test.

export const VIALS_PER_REWARD = 10;

export type LoyaltyProgress = {
  totalVials: number; // lifetime qualifying (peptide) vials purchased
  earnedRewards: number; // free vials earned so far (lifetime)
  progressInCycle: number; // 0..VIALS_PER_REWARD-1 toward the next reward
  untilNext: number; // vials remaining to earn the next free vial (1..VIALS_PER_REWARD)
};

export function loyaltyProgress(totalVials: number): LoyaltyProgress {
  const total = Math.max(0, Math.floor(totalVials));
  const earnedRewards = Math.floor(total / VIALS_PER_REWARD);
  const progressInCycle = total % VIALS_PER_REWARD;
  const untilNext = VIALS_PER_REWARD - progressInCycle; // 1..VIALS_PER_REWARD
  return { totalVials: total, earnedRewards, progressInCycle, untilNext };
}
