import { NextResponse } from "next/server";
import { canCheckout } from "@/lib/cart";
import { createCheckoutSession } from "@/lib/stripe";

export async function POST(request: Request) {
  const { order } = await request.json();
  if (!canCheckout(order)) {
    return NextResponse.json(
      { error: "A completed consultation and prescription are required before checkout." },
      { status: 403 },
    );
  }
  const session = await createCheckoutSession(order);
  return NextResponse.json({ url: session.url }, { status: 200 });
}
