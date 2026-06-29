"use server";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { parseSignUp, parseSignIn } from "@/lib/validation";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { createSession, destroySession } from "@/lib/session";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export async function signUp(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  const limit = rateLimit(`sign-up:${clientIp(await headers())}`, 5, 60_000);
  if (!limit.ok) return { ok: false, error: "Too many attempts. Please try again in a moment." };

  const parsed = parseSignUp({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.ok) return { ok: false, error: parsed.error };

  const email = parsed.data.email.toLowerCase();
  try {
    const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (existing) return { ok: false, error: "An account with this email already exists. Please sign in." };

    const passwordHash = await hashPassword(parsed.data.password);
    const user = await prisma.user.create({
      data: { name: parsed.data.name, email, passwordHash },
      select: { id: true },
    });
    await createSession(user.id);
  } catch {
    return { ok: false, error: "We couldn't create your account right now. Please try again." };
  }
  return { ok: true };
}

export async function signIn(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  const limit = rateLimit(`sign-in:${clientIp(await headers())}`, 10, 60_000);
  if (!limit.ok) return { ok: false, error: "Too many attempts. Please try again in a moment." };

  const parsed = parseSignIn({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.ok) return { ok: false, error: parsed.error };

  const email = parsed.data.email.toLowerCase();
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, passwordHash: true },
    });
    // Generic message so we don't reveal which emails have accounts.
    const invalid = { ok: false as const, error: "Incorrect email or password." };
    if (!user || !user.passwordHash) return invalid;
    const valid = await verifyPassword(parsed.data.password, user.passwordHash);
    if (!valid) return invalid;
    await createSession(user.id);
  } catch {
    return { ok: false, error: "We couldn't sign you in right now. Please try again." };
  }
  return { ok: true };
}

export async function signOut(): Promise<void> {
  await destroySession();
}
