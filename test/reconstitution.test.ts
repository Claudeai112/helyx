import { describe, it, expect } from "vitest";
import { concentrationMgPerMl, vialsRequired } from "@/lib/reconstitution";

describe("reconstitution reference", () => {
  it("concentration = mg per vial / solvent mL", () => {
    expect(concentrationMgPerMl(10, 2)).toBe(5);
  });
  it("guards divide-by-zero", () => {
    expect(concentrationMgPerMl(10, 0)).toBe(0);
    expect(vialsRequired(100, 0)).toBe(0);
  });
  it("vials required rounds up", () => {
    expect(vialsRequired(25, 10)).toBe(3);
  });
});
