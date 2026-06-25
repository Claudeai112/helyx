import "server-only";
import { prisma } from "@/lib/db";
export { generateCodeString, buildCodeBatch } from "@/lib/codes-pure";

export function findActiveCode(code: string) {
  return prisma.prescriptionCode.findFirst({
    where: { code, status: "ACTIVE" },
    select: { id: true, code: true },
  });
}

export async function revokeCode(code: string): Promise<number> {
  const r = await prisma.prescriptionCode.updateMany({
    where: { code, status: "ACTIVE" },
    data: { status: "REVOKED" },
  });
  return r.count;
}
