"use server";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { parseBulkInquiry } from "@/lib/validation";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export async function submitBulkInquiry(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  const limit = rateLimit(`bulk-inquiry:${clientIp(await headers())}`, 5, 60_000);
  if (!limit.ok) {
    return { ok: false, error: "Too many requests. Please try again in a moment." };
  }
  const parsed = parseBulkInquiry({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    organization: formData.get("organization"),
    role: formData.get("role") || undefined,
    compounds: formData.get("compounds"),
    quantities: formData.get("quantities"),
    poNumber: formData.get("poNumber") || undefined,
    notes: formData.get("notes") || undefined,
    ruoConfirmed: formData.get("ruoConfirmed") === "true",
  });
  if (!parsed.ok) return { ok: false, error: parsed.error };
  try {
    await prisma.bulkInquiry.create({
      data: {
        fullName: parsed.data.fullName,
        email: parsed.data.email,
        phone: parsed.data.phone,
        organization: parsed.data.organization,
        role: parsed.data.role,
        compounds: parsed.data.compounds,
        quantities: parsed.data.quantities,
        poNumber: parsed.data.poNumber,
        notes: parsed.data.notes,
        ruoConfirmed: parsed.data.ruoConfirmed,
      },
    });
  } catch {
    return { ok: false, error: "We couldn't submit your inquiry right now. Please try again." };
  }
  return { ok: true };
}
