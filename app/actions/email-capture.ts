"use server";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { parseEmailCapture } from "@/lib/validation";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export async function captureEmail(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  // Throttle by client IP before doing any work, to resist abuse/scraping.
  const limit = rateLimit(`email-capture:${clientIp(await headers())}`, 5, 60_000);
  if (!limit.ok) {
    return { ok: false, error: "Too many requests. Please try again in a moment." };
  }
  const parsed = parseEmailCapture({
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    smsConsent: formData.get("smsConsent") === "true",
    source: formData.get("source"),
  });
  if (!parsed.ok) return { ok: false, error: parsed.error };
  try {
    await prisma.emailCapture.create({
      data: {
        email: parsed.data.email,
        phone: parsed.data.phone,
        smsConsent: parsed.data.smsConsent,
        source: parsed.data.source,
      },
    });
  } catch {
    // DB unavailable or write failed — surface a graceful message instead of throwing.
    return { ok: false, error: "We couldn't save your email right now. Please try again." };
  }
  return { ok: true };
}
