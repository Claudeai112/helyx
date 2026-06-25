import { describe, it, expect, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { generateCodeString, buildCodeBatch } from "@/lib/codes";

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

describe("buildCodeBatch", () => {
  it("builds N unique codes tagged with the batch", () => {
    const batch = buildCodeBatch(50, "B1");
    expect(batch).toHaveLength(50);
    expect(new Set(batch.map((b) => b.code)).size).toBe(50);
    expect(batch.every((b) => b.batchId === "B1")).toBe(true);
  });
});
