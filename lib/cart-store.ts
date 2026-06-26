export type CartVariantOption = { id: string; label: string; priceCents: number };
export type CartItem = {
  variantId: string; slug: string; name: string; unitPriceCents: number; quantity: number;
  variants?: CartVariantOption[]; // available MG options for this product (enables the cart dropdown)
};

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
// Switch a cart line to a different MG variant (updates id + unit price; keeps quantity).
export function changeVariant(items: CartItem[], currentVariantId: string, newVariantId: string): CartItem[] {
  return items.map((i) => {
    if (i.variantId !== currentVariantId) return i;
    const next = i.variants?.find((v) => v.id === newVariantId);
    return next ? { ...i, variantId: next.id, unitPriceCents: next.priceCents } : i;
  });
}
// Set a line's quantity (clamped to >= 1; use removeFromCart to delete).
export function setQuantity(items: CartItem[], variantId: string, quantity: number): CartItem[] {
  const q = Math.max(1, Math.floor(quantity));
  return items.map((i) => (i.variantId === variantId ? { ...i, quantity: q } : i));
}
export function cartCount(items: CartItem[]): number {
  return items.reduce((n, i) => n + i.quantity, 0);
}
export function cartSubtotalCents(items: CartItem[]): number {
  return items.reduce((s, i) => s + i.unitPriceCents * i.quantity, 0);
}

// Bulk tiers count peptide vials + distinct peptide types only — exclude
// reconstitution supplies and stack bundles.
const SUPPLY_SLUGS = new Set(["bac-water", "sterile-water", "acetic-acid"]);
function isPeptideLine(i: CartItem): boolean {
  return !i.variantId.startsWith("stack:") && !SUPPLY_SLUGS.has(i.slug);
}
export function cartPeptideVials(items: CartItem[]): number {
  return items.filter(isPeptideLine).reduce((n, i) => n + i.quantity, 0);
}
export function cartPeptideTypes(items: CartItem[]): number {
  return new Set(items.filter(isPeptideLine).map((i) => i.slug)).size;
}
