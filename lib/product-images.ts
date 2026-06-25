// Standardized product photos. Every catalog product has a Helyx vial at
// /images/products/<slug>.png — one master bottle template (Helyx branding,
// fixed label layout, no MG text) with the peptide name stamped on the band.
const SLUGS = new Set<string>([
  "semaglutide", "tirzepatide", "retatrutide", "cagrilintide",
  "aod-9604", "tesamorelin", "mots-c", "5-amino-1mq", "adipotide",
  "bpc-157", "tb-500", "ghk-cu", "kpv", "ll-37", "ara-290", "vip",
  "cjc-1295-no-dac", "cjc-1295-dac", "ipamorelin", "sermorelin", "hexarelin",
  "ghrp-2", "ghrp-6", "igf-1-lr3", "mgf", "peg-mgf",
  "nad-plus", "epitalon", "ss-31", "thymalin", "thymosin-alpha-1", "foxo4",
  "pinealon", "glutathione", "aicar",
  "semax", "selank",
  "pt-141", "kisspeptin-10", "gonadorelin", "gonadorelin-acetate", "hcg", "hmg", "oxytocin",
  "dsip",
  "ahk-cu", "melanotan-1", "melanotan-2", "snap-8",
  "sterile-water", "acetic-acid",
]);

export function productImage(slug: string): string | null {
  return SLUGS.has(slug) ? `/images/products/${slug}.png` : null;
}
