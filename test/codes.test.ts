import { describe, it, expect, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { generateCodeString } from "@/lib/codes";

describe("generateCodeString", () => {
  it("returns a grouped code from the safe alphabet", () => {
    const c = generateCodeString();
    expect(c).toMatch(/^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{4}-[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{4}-[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{4}$/);
  });
  it("is effectively unique across many draws", () => {
    const set = new Set(Array.from({ length: 2000 }, () => generateCodeString()));
    expect(set.size).toBe(2000);
  });
});
