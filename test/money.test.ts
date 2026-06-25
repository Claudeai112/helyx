import { describe, it, expect } from "vitest";
import { formatCents, stackPriceCents, savingsCents, percentOff } from "@/lib/money";

describe("money helpers", () => {
  it("formats cents as USD", () => {
    expect(formatCents(12900)).toBe("$129.00");
    expect(formatCents(0)).toBe("$0.00");
    expect(formatCents(5)).toBe("$0.05");
  });
  it("applies a basis-point discount to a stack sum", () => {
    expect(stackPriceCents(20000, 1500)).toBe(17000); // 15% off
    expect(stackPriceCents(10000, 0)).toBe(10000);
  });
  it("computes savings and percent off", () => {
    expect(savingsCents(15000, 12000)).toBe(3000);
    expect(percentOff(15000, 12000)).toBe(20);
    expect(percentOff(0, 0)).toBe(0);
  });
});
