"use server";
import { prisma } from "@/lib/db";
import { parseEmailCapture } from "@/lib/validation";

export async function captureEmail(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  const parsed = parseEmailCapture({
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    smsConsent: formData.get("smsConsent") === "true",
    source: formData.get("source"),
  });
  if (!parsed.ok) return { ok: false, error: parsed.error };
  await prisma.emailCapture.create({
    data: {
      email: parsed.data.email,
      phone: parsed.data.phone,
      smsConsent: parsed.data.smsConsent,
      source: parsed.data.source,
    },
  });
  return { ok: true };
}
