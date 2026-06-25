import { describe, it, expect, vi, beforeEach } from "vitest";
vi.mock("server-only", () => ({}));
const { get } = vi.hoisted(() => ({ get: vi.fn() }));
vi.mock("next/headers", () => ({ cookies: async () => ({ get }) }));
const { findFirst } = vi.hoisted(() => ({ findFirst: vi.fn() }));
vi.mock("@/lib/db", () => ({ prisma: { prescriptionCode: { findFirst } } }));
import { getRedeemedCode } from "@/lib/rx-auth";
import { signRxCookie } from "@/lib/rx-cookie";

beforeEach(() => { get.mockReset(); findFirst.mockReset(); });

describe("getRedeemedCode", () => {
  it("returns the code when cookie is valid AND code still ACTIVE", async () => {
    get.mockReturnValue({ value: signRxCookie("c1") });
    findFirst.mockResolvedValue({ id: "c1", code: "X" });
    expect(await getRedeemedCode()).toEqual({ id: "c1" });
  });
  it("returns null when the code was revoked (no longer ACTIVE)", async () => {
    get.mockReturnValue({ value: signRxCookie("c1") });
    findFirst.mockResolvedValue(null);
    expect(await getRedeemedCode()).toBeNull();
  });
  it("returns null when no/invalid cookie", async () => {
    get.mockReturnValue(undefined);
    expect(await getRedeemedCode()).toBeNull();
  });
});
