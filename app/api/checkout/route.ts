import { NextResponse } from "next/server";
import { canCheckout } from "@/lib/cart";
import { createCheckoutSession } from "@/lib/stripe";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const limit = rateLimit(`checkout:${clientIp(request.headers)}`, 10, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }
  let order: { prescriptionId: string | null } | undefined;
  try {
    ({ order } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  if (!order || !canCheckout(order)) {
    return NextResponse.json(
      { error: "A completed consultation and prescription are required before checkout." },
      { status: 403 },
    );
  }
  const session = await createCheckoutSession(order);
  return NextResponse.json({ url: session.url }, { status: 200 });
}
