import { z } from "zod";

export const emailCaptureSchema = z.object({
  email: z.email(),
  phone: z.string().min(7).max(20).optional(),
  smsConsent: z.boolean(),
  source: z.string().min(1),
});

export type EmailCaptureInput = z.infer<typeof emailCaptureSchema>;

export function parseEmailCapture(input: unknown):
  | { ok: true; data: EmailCaptureInput }
  | { ok: false; error: string } {
  const r = emailCaptureSchema.safeParse(input);
  return r.success
    ? { ok: true, data: r.data }
    : { ok: false, error: r.error.issues[0]?.message ?? "Invalid input" };
}
