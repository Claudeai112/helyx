import { describe, it, expect } from "vitest";
import { loyaltyProgress, VIALS_PER_REWARD } from "@/lib/loyalty";

describe("loyalty progress", () => {
  it("starts empty", () => {
    expect(loyaltyProgress(0)).toEqual({
      totalVials: 0,
      earnedRewards: 0,
      progressInCycle: 0,
      untilNext: VIALS_PER_REWARD,
    });
  });

  it("tracks mid-cycle progress", () => {
    const p = loyaltyProgress(7);
    expect(p.progressInCycle).toBe(7);
    expect(p.untilNext).toBe(3);
    expect(p.earnedRewards).toBe(0);
  });

  it("earns a reward at exactly 10", () => {
    const p = loyaltyProgress(10);
    expect(p.earnedRewards).toBe(1);
    expect(p.progressInCycle).toBe(0);
  });

  it("counts multiple rewards and the next cycle", () => {
    const p = loyaltyProgress(23);
    expect(p.earnedRewards).toBe(2);
    expect(p.progressInCycle).toBe(3);
    expect(p.untilNext).toBe(7);
  });

  it("clamps and floors junk input", () => {
    expect(loyaltyProgress(-5).totalVials).toBe(0);
    expect(loyaltyProgress(4.9).progressInCycle).toBe(4);
  });
});
