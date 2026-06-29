// Fulfillment status. The listed peptides are kept in stock; everything else
// is made to order with a longer delivery window. Research supplies are stocked
// consumables, so they're treated as in stock too.
export const IN_STOCK_SLUGS = new Set<string>([
  "semaglutide",
  "tirzepatide",
  "retatrutide",
  "tesamorelin",
  "bpc-157",
  "tb-500",
  "ghk-cu",
  "cjc-1295-no-dac",
  "cjc-1295-dac",
  "ipamorelin",
  "pt-141",
]);

export const MADE_TO_ORDER_DELIVERY = "2–3 weeks";

export function isInStock(slug: string, categorySlug?: string | null): boolean {
  return IN_STOCK_SLUGS.has(slug) || categorySlug === "supplies";
}
