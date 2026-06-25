export type CartLine = { variantId: string; quantity: number; unitPriceCents: number };

export function cartSubtotalCents(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.unitPriceCents * l.quantity, 0);
}

export function cartItemCount(lines: CartLine[]): number {
  return lines.reduce((n, l) => n + l.quantity, 0);
}

/** The compliance gate: an order may only proceed to payment with a redeemed, active code. */
export function canCheckout(auth: { redeemedCodeId: string | null }): boolean {
  return auth.redeemedCodeId !== null;
}
