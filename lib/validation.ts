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

export const bulkInquirySchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required").max(120),
  email: z.email("Enter a valid work email"),
  phone: z.string().trim().max(40).optional(),
  organization: z.string().trim().min(1, "Organization is required").max(160),
  role: z.string().trim().max(120).optional(),
  compounds: z.string().trim().min(1, "List the compounds of interest").max(4000),
  quantities: z.string().trim().min(1, "Estimated quantities are required").max(2000),
  notes: z.string().trim().max(4000).optional(),
  ruoConfirmed: z.literal(true, { message: "You must confirm research-use-only" }),
});

export type BulkInquiryInput = z.infer<typeof bulkInquirySchema>;

export function parseBulkInquiry(input: unknown):
  | { ok: true; data: BulkInquiryInput }
  | { ok: false; error: string } {
  const r = bulkInquirySchema.safeParse(input);
  return r.success
    ? { ok: true, data: r.data }
    : { ok: false, error: r.error.issues[0]?.message ?? "Invalid input" };
}
