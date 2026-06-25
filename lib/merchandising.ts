// Static merchandising curation. No sales data exists, so "popular / new /
// best-selling" are curated here (no DB field, no reseed). Tweak freely.
const POPULAR_ORDER = [
  "tirzepatide", "retatrutide", "semaglutide", "cagrilintide",
  "bpc-157", "tb-500", "ghk-cu", "nad-plus", "ipamorelin", "mots-c",
];
const POPULAR = new Set(POPULAR_ORDER);
const NEW = new Set(["retatrutide", "cagrilintide", "5-amino-1mq", "ss-31", "foxo4"]);

export function isPopular(slug: string): boolean {
  return POPULAR.has(slug);
}
export function isNew(slug: string): boolean {
  return NEW.has(slug);
}
export function popularityRank(slug: string): number {
  const i = POPULAR_ORDER.indexOf(slug);
  // popular slugs rank 0..N-1; everything else ties at 1000 (stable sort keeps catalog order)
  return i === -1 ? 1000 : i;
}
