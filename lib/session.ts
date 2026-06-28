import "server-only";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { makeSessionToken, readSessionToken } from "@/lib/auth";

export const SESSION_COOKIE = "helyx_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export type SessionUser = { id: string; email: string; name: string | null };

export async function createSession(userId: string): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, makeSessionToken(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

// Reads the signed session cookie and resolves the current user, or null.
export async function getCurrentUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const userId = readSessionToken(token);
  if (!userId) return null;
  try {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true },
    });
  } catch {
    return null;
  }
}
