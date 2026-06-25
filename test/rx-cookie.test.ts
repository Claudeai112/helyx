import { describe, it, expect, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { signRxCookie, verifyRxCookie } from "@/lib/rx-cookie";

describe("rx cookie", () => {
  it("round-trips a codeId", () => {
    const signed = signRxCookie("code_123");
    expect(signed.startsWith("code_123.")).toBe(true);
    expect(verifyRxCookie(signed)).toBe("code_123");
  });
  it("rejects tampering and junk", () => {
    const signed = signRxCookie("code_123");
    expect(verifyRxCookie(signed.replace("code_123", "code_999"))).toBeNull();
    expect(verifyRxCookie("garbage")).toBeNull();
    expect(verifyRxCookie(undefined)).toBeNull();
  });
});
