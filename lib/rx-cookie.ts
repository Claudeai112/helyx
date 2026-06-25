import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

const SECRET = process.env.RX_COOKIE_SECRET ?? "dev-rx-secret";

function mac(codeId: string): string {
  return createHmac("sha256", SECRET).update(codeId).digest("hex");
}

export function signRxCookie(codeId: string): string {
  return `${codeId}.${mac(codeId)}`;
}

export function verifyRxCookie(value: string | undefined): string | null {
  if (!value) return null;
  const idx = value.lastIndexOf(".");
  if (idx <= 0) return null;
  const codeId = value.slice(0, idx);
  const sig = value.slice(idx + 1);
  const expected = mac(codeId);
  if (sig.length !== expected.length) return null;
  try {
    if (!timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"))) return null;
  } catch {
    return null;
  }
  return codeId;
}
