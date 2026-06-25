import { describe, it, expect, vi } from "vitest";

// Isolated in its own file on purpose: the action's DB-failure guard is verified
// against a freshly-mocked client with no prior successful call. (Vitest's mock
// machinery double-reports a thrown implementation as an unhandled error when a
// prior resolved call ran in the same file; a dedicated file avoids that quirk.)
const { create } = vi.hoisted(() => ({ create: vi.fn() }));
vi.mock("@/lib/db", () => ({ prisma: { emailCapture: { create } } }));

import { captureEmail } from "@/app/actions/email-capture";

function fd(obj: Record<string, string>) {
  const f = new FormData();
  for (const [k, v] of Object.entries(obj)) f.set(k, v);
  return f;
}

describe("captureEmail DB failure", () => {
  it("returns a graceful error instead of throwing when the write fails", async () => {
    create.mockImplementation(() => {
      throw new Error("db unavailable");
    });
    const r = await captureEmail(fd({ email: "a@b.com", source: "footer", smsConsent: "false" }));
    expect(r.ok).toBe(false);
    expect(r.error).toBeTruthy();
  });
});
