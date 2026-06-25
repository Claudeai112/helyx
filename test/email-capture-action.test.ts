import { describe, it, expect, vi, beforeEach } from "vitest";

const { create } = vi.hoisted(() => ({ create: vi.fn() }));
vi.mock("@/lib/db", () => ({ prisma: { emailCapture: { create } } }));

import { captureEmail } from "@/app/actions/email-capture";

beforeEach(() => create.mockReset());

function fd(obj: Record<string, string>) {
  const f = new FormData();
  for (const [k, v] of Object.entries(obj)) f.set(k, v);
  return f;
}

describe("captureEmail action", () => {
  it("stores a valid email", async () => {
    create.mockResolvedValue({ id: "1" });
    const r = await captureEmail(fd({ email: "a@b.com", source: "footer", smsConsent: "false" }));
    expect(r.ok).toBe(true);
    expect(create).toHaveBeenCalled();
  });
  it("rejects an invalid email and does not write", async () => {
    const r = await captureEmail(fd({ email: "nope", source: "footer", smsConsent: "false" }));
    expect(r.ok).toBe(false);
    expect(create).not.toHaveBeenCalled();
  });
});
