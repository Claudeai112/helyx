import { readFileSync } from "node:fs";
import { describe, it, expect } from "vitest";

const schema = readFileSync("prisma/schema.prisma", "utf8");

describe("prisma schema", () => {
  it("defines all core models", () => {
    for (const m of [
      "model Category", "model Product", "model ProductVariant",
      "model Stack", "model StackItem", "model User", "model Cart",
      "model CartItem", "model Order", "model OrderItem",
      "model Consult", "model Prescription", "model EmailCapture",
    ]) expect(schema).toContain(m);
  });
  it("gates orders with a consult/prescription status", () => {
    expect(schema).toContain("PENDING_CONSULT");
    expect(schema).toContain("model Prescription");
  });
  it("stores money as integer cents", () => {
    expect(schema).toMatch(/priceCents\s+Int/);
    expect(schema).toMatch(/compareAtCents\s+Int/);
    expect(schema).toMatch(/unitPriceCents\s+Int/);
  });
});
