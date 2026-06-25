// Static slug → product photo map. Files live in public/images/products/.
// Helyx-branded research vials; products without a photo fall back to a
// placeholder surface in the card/detail views.
export const productImages: Record<string, string> = {
  tirzepatide: "/images/products/tirzepatide.png",
  retatrutide: "/images/products/retatrutide.png",
  "bpc-157": "/images/products/bpc-157.png",
  "tb-500": "/images/products/tb-500.png",
};

export function productImage(slug: string): string | null {
  return productImages[slug] ?? null;
}
