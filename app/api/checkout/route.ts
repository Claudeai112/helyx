import { NextResponse } from "next/server";
import { canCheckout } from "@/lib/cart";
import { createCheckoutSession } from "@/lib/stripe";

export async function POST(request: Request) {
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
