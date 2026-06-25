import "server-only";
import { randomInt } from "node:crypto";
import { prisma } from "@/lib/db";

const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no 0/O/1/I/L

export function generateCodeString(): string {
  const chars = Array.from({ length: 12 }, () => ALPHABET[randomInt(ALPHABET.length)]);
  return `${chars.slice(0, 4).join("")}-${chars.slice(4, 8).join("")}-${chars.slice(8, 12).join("")}`;
}

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
