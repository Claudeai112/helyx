import "server-only";
import { cookies } from "next/headers";
import { verifyRxCookie } from "@/lib/rx-cookie";
import { prisma } from "@/lib/db";

export const RX_COOKIE_NAME = "rx_auth";

export async function getRedeemedCode(): Promise<{ id: string } | null> {
  const raw = (await cookies()).get(RX_COOKIE_NAME)?.value;
  const codeId = verifyRxCookie(raw);
  if (!codeId) return null;
  // Re-check the code is still ACTIVE so revocation takes effect immediately.
  const active = await prisma.prescriptionCode.findFirst({
    where: { id: codeId, status: "ACTIVE" },
    select: { id: true },
  });
  return active ? { id: codeId } : null;
}
