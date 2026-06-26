// Retail price map: "<slug>:<mg>" -> price in CENTS.
// Set ~10% below average market retail (research-supply single-vial pricing).
// APPROVED by owner 2026-06-25. Source: market research, June 2026.
// IU/mL items key on their numeric strength (e.g. "hcg:5000", "sterile-water:3").
const PRICES_CENTS: Record<string, number> = {
  // GLP-1 & metabolic
  "semaglutide:5": 6800, "semaglutide:10": 9000, "semaglutide:15": 11900, "semaglutide:20": 14500, "semaglutide:30": 19000,
  "tirzepatide:5": 4500, "tirzepatide:10": 8700, "tirzepatide:15": 11700, "tirzepatide:20": 14000, "tirzepatide:30": 14900,
  "tirzepatide:40": 17500, "tirzepatide:50": 19900, "tirzepatide:60": 22000, "tirzepatide:70": 24200, "tirzepatide:80": 26000,
  "tirzepatide:90": 28000, "tirzepatide:100": 29500, "tirzepatide:120": 34000,
  "retatrutide:5": 6800, "retatrutide:10": 13000, "retatrutide:15": 16500, "retatrutide:20": 19800, "retatrutide:30": 25200,
  "retatrutide:40": 29500, "retatrutide:50": 33800, "retatrutide:60": 37400,
  "cagrilintide:5": 7700, "cagrilintide:10": 13000,

  // Metabolic / fat loss
  "aod-9604:2": 2200, "aod-9604:5": 4000,
  "tesamorelin:2": 4500, "tesamorelin:5": 7700, "tesamorelin:10": 13500, "tesamorelin:20": 23500,
  "mots-c:10": 6800, "mots-c:20": 10800, "mots-c:40": 18000,
  "5-amino-1mq:5": 2000, "5-amino-1mq:50": 5900,
  "adipotide:5": 6800,

  // Healing & recovery
  "bpc-157:5": 4500, "bpc-157:10": 6100,
  "tb-500:5": 2200, "tb-500:10": 3800,
  "ghk-cu:50": 5100, "ghk-cu:100": 7700,
  "kpv:5": 2500, "kpv:10": 4000,
  "ll-37:5": 5000,
  "ara-290:10": 8800,
  "vip:10": 5900,

  // Muscle / GH-axis
  "cjc-1295-no-dac:2": 2000, "cjc-1295-no-dac:5": 4000, "cjc-1295-no-dac:10": 6500,
  "cjc-1295-dac:2": 2700, "cjc-1295-dac:5": 5000,
  "ipamorelin:5": 3600, "ipamorelin:10": 5200,
  "sermorelin:5": 2900, "sermorelin:10": 4300,
  "hexarelin:5": 3200,
  "ghrp-2:5": 2000, "ghrp-2:10": 3200,
  "ghrp-6:5": 2000, "ghrp-6:10": 3200,
  "igf-1-lr3:0.1": 3400, "igf-1-lr3:1": 8500,
  "mgf:2": 3800,
  "peg-mgf:2": 4300,

  // Longevity
  "nad-plus:100": 2000, "nad-plus:500": 7000, "nad-plus:1000": 11300,
  "epitalon:10": 3400, "epitalon:50": 9500,
  "ss-31:10": 8800, "ss-31:50": 31500,
  "thymalin:10": 5000,
  "thymosin-alpha-1:5": 5600, "thymosin-alpha-1:10": 8800,
  "foxo4:10": 19500,
  "pinealon:10": 3800,
  "glutathione:600": 4000, "glutathione:1500": 7400,
  "aicar:50": 6100,

  // Cognitive / nootropic
  "semax:5": 3800, "semax:10": 5900,
  "selank:5": 3600, "selank:10": 5600,

  // Hormonal & reproductive
  "pt-141:10": 4300,
  "kisspeptin-10:5": 4300, "kisspeptin-10:10": 6800,
  "gonadorelin:2": 2500,
  "gonadorelin-acetate:2": 2700,
  "hcg:5000": 2500,
  "hmg:75": 2500,
  "oxytocin:2": 2500, "oxytocin:5": 4000,

  // Sleep & recovery
  "dsip:5": 2700, "dsip:10": 4000, "dsip:15": 5200,

  // Skin & cosmetic
  "ahk-cu:50": 4500, "ahk-cu:100": 7000,
  "melanotan-1:10": 3800,
  "melanotan-2:10": 3200,
  "snap-8:10": 4700,

  // Research supplies
  "sterile-water:3": 900, "sterile-water:10": 1400,
  "acetic-acid:3": 900, "acetic-acid:10": 1400,
  "bac-water:3": 900, "bac-water:10": 1400, "bac-water:30": 2400,
};

export function retailPriceCents(slug: string, mg: number): number {
  return PRICES_CENTS[`${slug}:${mg}`] ?? 0;
}
