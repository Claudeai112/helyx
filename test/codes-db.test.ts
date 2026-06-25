import { describe, it, expect, vi, beforeEach } from "vitest";
vi.mock("server-only", () => ({}));
const { findFirst, updateMany } = vi.hoisted(() => ({ findFirst: vi.fn(), updateMany: vi.fn() }));
vi.mock("@/lib/db", () => ({ prisma: { prescriptionCode: { findFirst, updateMany } } }));
import { findActiveCode, revokeCode } from "@/lib/codes";

beforeEach(() => { findFirst.mockReset(); updateMany.mockReset(); });

describe("findActiveCode", () => {
  it("queries by code AND status ACTIVE", async () => {
    findFirst.mockResolvedValue({ id: "c1", code: "AAAA-BBBB-CCCC" });
    const r = await findActiveCode("AAAA-BBBB-CCCC");
    expect(r?.id).toBe("c1");
    expect(findFirst).toHaveBeenCalledWith(expect.objectContaining({
      where: { code: "AAAA-BBBB-CCCC", status: "ACTIVE" },
    }));
  });
  it("returns null for an unknown/revoked code", async () => {
    findFirst.mockResolvedValue(null);
    expect(await findActiveCode("nope")).toBeNull();
  });
});
describe("revokeCode", () => {
  it("flips matching ACTIVE codes to REVOKED", async () => {
    updateMany.mockResolvedValue({ count: 1 });
    const n = await revokeCode("AAAA-BBBB-CCCC");
    expect(n).toBe(1);
    expect(updateMany).toHaveBeenCalledWith({
      where: { code: "AAAA-BBBB-CCCC", status: "ACTIVE" },
      data: { status: "REVOKED" },
    });
  });
});
