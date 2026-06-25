import { NextResponse } from "next/server";
import { canCheckout } from "@/lib/cart";
import { createCheckoutSession } from "@/lib/stripe";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { getRedeemedCode } from "@/lib/rx-auth";

export async function POST(request: Request) {
  const limit = rateLimit(`checkout:${clientIp(request.headers)}`, 10, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }
  const redeemed = await getRedeemedCode();
  if (!canCheckout({ redeemedCodeId: redeemed?.id ?? null })) {
    return NextResponse.json(
      { error: "A valid access code is required before checkout." },
      { status: 403 },
    );
  }
  // Real order creation + line items land in Plan 2B; keep the gated scaffold session.
  const session = await createCheckoutSession({ prescriptionId: redeemed!.id });
  return NextResponse.json({ url: session.url }, { status: 200 });
}
