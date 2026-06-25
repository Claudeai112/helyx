export function formatCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function stackPriceCents(componentCentsSum: number, discountBps: number): number {
  return Math.round(componentCentsSum * (1 - discountBps / 10000));
}

export function savingsCents(compareAtCents: number, priceCents: number): number {
  return Math.max(0, compareAtCents - priceCents);
}

export function percentOff(compareAtCents: number, priceCents: number): number {
  if (compareAtCents <= 0) return 0;
  return Math.round((savingsCents(compareAtCents, priceCents) / compareAtCents) * 100);
}
