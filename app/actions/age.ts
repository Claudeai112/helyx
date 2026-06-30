"use server";
import { cookies } from "next/headers";
import { AGE_COOKIE, AGE_COOKIE_MAX_AGE } from "@/lib/age";

// Records that the visitor confirmed the research-use attestation (18+). The
// cookie is read in the root layout so the gate is never rendered again for
// confirmed visitors (no flash of the gate on subsequent loads).
export async function confirmAge(): Promise<void> {
  const store = await cookies();
  store.set(AGE_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: AGE_COOKIE_MAX_AGE,
  });
}
