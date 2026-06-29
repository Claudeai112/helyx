import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword, makeSessionToken, readSessionToken } from "@/lib/auth";

describe("password hashing", () => {
  it("verifies a correct password", async () => {
    const stored = await hashPassword("correct horse battery");
    expect(await verifyPassword("correct horse battery", stored)).toBe(true);
  });

  it("rejects an incorrect password", async () => {
    const stored = await hashPassword("correct horse battery");
    expect(await verifyPassword("wrong password", stored)).toBe(false);
  });

  it("produces a different hash each time (salted)", async () => {
    const a = await hashPassword("same");
    const b = await hashPassword("same");
    expect(a).not.toBe(b);
  });

  it("rejects a malformed stored value", async () => {
    expect(await verifyPassword("x", "not-a-valid-hash")).toBe(false);
  });
});

describe("session tokens", () => {
  it("round-trips a userId through a signed token", () => {
    const token = makeSessionToken("user_123");
    expect(readSessionToken(token)).toBe("user_123");
  });

  it("rejects a tampered token", () => {
    const token = makeSessionToken("user_123");
    const tampered = token.replace("user_123", "user_999");
    expect(readSessionToken(tampered)).toBeNull();
  });

  it("rejects a token with no signature", () => {
    expect(readSessionToken("user_123")).toBeNull();
  });
});
