export type CartItem = { variantId: string; slug: string; name: string; unitPriceCents: number; quantity: number };

export function addToCart(items: CartItem[], item: CartItem): CartItem[] {
  const existing = items.find((i) => i.variantId === item.variantId);
  if (existing) {
    return items.map((i) => (i.variantId === item.variantId ? { ...i, quantity: i.quantity + item.quantity } : i));
  }
  return [...items, item];
}
export function removeFromCart(items: CartItem[], variantId: string): CartItem[] {
  return items.filter((i) => i.variantId !== variantId);
}
export function cartCount(items: CartItem[]): number {
  return items.reduce((n, i) => n + i.quantity, 0);
}
export function cartSubtotalCents(items: CartItem[]): number {
  return items.reduce((s, i) => s + i.unitPriceCents * i.quantity, 0);
}
