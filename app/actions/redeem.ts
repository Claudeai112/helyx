"use server";
import { cookies, headers } from "next/headers";
import { findActiveCode } from "@/lib/codes";
import { signRxCookie } from "@/lib/rx-cookie";
import { RX_COOKIE_NAME } from "@/lib/rx-auth";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export async function redeemCode(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  const limit = rateLimit(`redeem:${clientIp(await headers())}`, 10, 60_000);
  if (!limit.ok) return { ok: false, error: "Too many attempts. Please try again shortly." };

  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  if (!code) return { ok: false, error: "Enter your access code." };

  const active = await findActiveCode(code);
  if (!active) return { ok: false, error: "That code is not valid. Check it and try again." };

  (await cookies()).set(RX_COOKIE_NAME, signRxCookie(active.id), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // no expiry policy; 1y cookie lifetime
  });
  return { ok: true };
}
