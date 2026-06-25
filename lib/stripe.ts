// `server-only` makes the build fail if this module (which holds the secret
// Stripe key) is ever imported into a Client Component bundle.
import "server-only";
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "sk_test_placeholder");

export async function createCheckoutSession(order: { prescriptionId: string | null }) {
  // Scaffold only: real line items + customer wiring land in Spec #2.
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/order/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart`,
    metadata: { prescriptionId: order.prescriptionId ?? "" },
  });
  return { url: session.url };
}
