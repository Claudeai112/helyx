import "server-only";
import { randomBytes, scrypt, timingSafeEqual, createHmac } from "node:crypto";
import { promisify } from "node:util";

// Password hashing + session-token signing using only Node's built-in crypto —
// no external auth dependency. Passwords use scrypt with a per-password salt;
// session tokens are HMAC-signed so a tampered cookie is rejected server-side.

const scryptAsync = promisify(scrypt);
const KEY_LEN = 64;

function sessionSecret(): string {
  return process.env.SESSION_SECRET ?? "dev-session-secret-change-me";
}

// Returns "salt:derivedKey" (both hex). Store this whole string in the DB.
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scryptAsync(password, salt, KEY_LEN)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, key] = stored.split(":");
  if (!salt || !key) return false;
  const derived = (await scryptAsync(password, salt, KEY_LEN)) as Buffer;
  const keyBuf = Buffer.from(key, "hex");
  if (keyBuf.length !== derived.length) return false;
  return timingSafeEqual(keyBuf, derived);
}

function sign(value: string): string {
  return createHmac("sha256", sessionSecret()).update(value).digest("hex");
}

// Token = "<userId>.<hmac(userId)>".
export function makeSessionToken(userId: string): string {
  return `${userId}.${sign(userId)}`;
}

// Returns the userId if the signature is valid, else null.
export function readSessionToken(token: string): string | null {
  const idx = token.lastIndexOf(".");
  if (idx <= 0) return null;
  const userId = token.slice(0, idx);
  const sig = token.slice(idx + 1);
  const expected = sign(userId);
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) return null;
  return userId;
}
