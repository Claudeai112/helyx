import { describe, it, expect } from "vitest";
import { parseEmailCapture } from "@/lib/validation";

describe("email capture validation", () => {
  it("accepts a valid email", () => {
    const r = parseEmailCapture({ email: "a@b.com", smsConsent: false, source: "footer" });
    expect(r.ok).toBe(true);
  });
  it("rejects a bad email", () => {
    const r = parseEmailCapture({ email: "nope", smsConsent: false, source: "footer" });
    expect(r.ok).toBe(false);
  });
  it("requires sms consent boolean when phone present", () => {
    const r = parseEmailCapture({ email: "a@b.com", phone: "5551234567", smsConsent: true, source: "popup" });
    expect(r.ok).toBe(true);
  });
});
