import { randomInt } from "node:crypto";

const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no 0/O/1/I/L

export function generateCodeString(): string {
  const chars = Array.from({ length: 12 }, () => ALPHABET[randomInt(ALPHABET.length)]);
  return `${chars.slice(0, 4).join("")}-${chars.slice(4, 8).join("")}-${chars.slice(8, 12).join("")}`;
}

export function buildCodeBatch(count: number, batchId: string): { code: string; batchId: string }[] {
  const seen = new Set<string>();
  const out: { code: string; batchId: string }[] = [];
  while (out.length < count) {
    const code = generateCodeString();
    if (seen.has(code)) continue;
    seen.add(code);
    out.push({ code, batchId });
  }
  return out;
}
