import { describe, it, expect } from "vitest";
import { parseEmailCapture, parseBulkInquiry } from "@/lib/validation";

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

describe("bulk inquiry validation", () => {
  const valid = {
    fullName: "Dr. Jane Smith",
    email: "jane@lab.org",
    organization: "Acme Research Institute",
    compounds: "BPC-157 5mg, TB-500 5mg",
    quantities: "50 vials each",
    ruoConfirmed: true,
  };

  it("accepts a complete valid inquiry", () => {
    expect(parseBulkInquiry(valid).ok).toBe(true);
  });

  it("accepts optional fields", () => {
    const r = parseBulkInquiry({ ...valid, phone: "5551234567", role: "PI", poNumber: "PO-99", notes: "rush" });
    expect(r.ok).toBe(true);
  });

  it("rejects a missing full name", () => {
    expect(parseBulkInquiry({ ...valid, fullName: "" }).ok).toBe(false);
  });

  it("rejects an invalid email", () => {
    expect(parseBulkInquiry({ ...valid, email: "nope" }).ok).toBe(false);
  });

  it("rejects a missing organization", () => {
    expect(parseBulkInquiry({ ...valid, organization: "" }).ok).toBe(false);
  });

  it("rejects missing compounds", () => {
    expect(parseBulkInquiry({ ...valid, compounds: "" }).ok).toBe(false);
  });

  it("rejects missing quantities", () => {
    expect(parseBulkInquiry({ ...valid, quantities: "" }).ok).toBe(false);
  });

  it("requires the research-use-only confirmation", () => {
    expect(parseBulkInquiry({ ...valid, ruoConfirmed: false }).ok).toBe(false);
  });
});
