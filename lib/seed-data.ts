export type SeedVariant = {
  label: string; sku: string; priceCents: number;
  compareAtCents?: number; subscriptionEligible: boolean;
};
export type SeedProduct = {
  slug: string; name: string; subtitle: string; categorySlug: string;
  researchOverview: string; benefits: string[]; reconstitution: string;
  status: "ACTIVE" | "COMING_SOON" | "WAITLIST";
  variants: SeedVariant[]; relatedSlugs: string[];
};
export type SeedCategory = { slug: string; name: string; description: string; order: number; heroCopy?: string };
export type SeedStack = {
  slug: string; name: string; tagline: string; overview: string;
  protocol: string; discountBps: number; productSlugs: string[];
};

export const categories: SeedCategory[] = [
  { slug: "glp-1", name: "GLP-1 Peptides", order: 1,
    description: "Metabolic peptides studied for appetite and weight regulation.",
    heroCopy: "Provider-guided GLP-1 protocols." },
  { slug: "fat-loss", name: "Fat Loss", order: 2,
    description: "Peptides studied in the context of lipid metabolism." },
  { slug: "recovery", name: "Recovery", order: 3,
    description: "Peptides studied for tissue recovery and repair." },
  { slug: "muscle-growth", name: "Muscle Growth", order: 4,
    description: "Growth-hormone-axis peptides studied for body composition." },
  { slug: "longevity", name: "Longevity", order: 5,
    description: "Peptides and cofactors studied in cellular-aging research." },
  { slug: "cognitive", name: "Cognitive Enhancement", order: 6,
    description: "Peptides studied for sleep and neurological function." },
  { slug: "healing", name: "Healing Peptides", order: 7,
    description: "Peptides studied for repair and regeneration pathways." },
  { slug: "stacks", name: "Stacks & Bundles", order: 8,
    description: "Provider-reviewed combinations at a bundle price." },
];

export const products: SeedProduct[] = [
  // ── GLP-1 ──────────────────────────────────────────────────────────────────
  {
    slug: "tirzepatide",
    name: "Tirzepatide",
    subtitle: "Dual GIP/GLP-1 receptor agonist",
    categorySlug: "glp-1",
    researchOverview:
      "Tirzepatide is a dual glucose-dependent insulinotropic polypeptide (GIP) and " +
      "glucagon-like peptide-1 (GLP-1) receptor agonist studied extensively for glycemic " +
      "regulation and body-weight management. Eligibility and dosing are determined by a " +
      "licensed provider during your consultation.",
    benefits: [
      "Studied for appetite and satiety signaling",
      "Investigated for weight-management protocols",
      "Dual-receptor mechanism of action",
    ],
    reconstitution:
      "If prescribed, your provider and pharmacy supply exact reconstitution and dosing " +
      "instructions with your medication. Follow only those instructions.",
    status: "ACTIVE",
    variants: [
      { label: "10mg vial", sku: "HP-TIRZ-10", priceCents: 17900, compareAtCents: 19900, subscriptionEligible: true },
      { label: "20mg vial", sku: "HP-TIRZ-20", priceCents: 29900, compareAtCents: 33900, subscriptionEligible: true },
    ],
    relatedSlugs: ["semaglutide", "retatrutide", "cagrilintide"],
  },
  {
    slug: "semaglutide",
    name: "Semaglutide",
    subtitle: "GLP-1 receptor agonist",
    categorySlug: "glp-1",
    researchOverview:
      "Semaglutide is a glucagon-like peptide-1 (GLP-1) receptor agonist that has been " +
      "studied extensively in clinical settings for its role in glycemic regulation and " +
      "metabolic health. Access is subject to provider evaluation and approval.",
    benefits: [
      "Studied for appetite regulation and satiety pathways",
      "Investigated in metabolic health research",
      "Well-characterized GLP-1 receptor binding profile",
    ],
    reconstitution:
      "If prescribed, your provider and compounding pharmacy supply exact reconstitution " +
      "and dosing instructions with your medication. Follow only those instructions.",
    status: "ACTIVE",
    variants: [
      { label: "5mg vial", sku: "HP-SEMA-5", priceCents: 14900, compareAtCents: 16900, subscriptionEligible: true },
      { label: "10mg vial", sku: "HP-SEMA-10", priceCents: 24900, compareAtCents: 27900, subscriptionEligible: true },
    ],
    relatedSlugs: ["tirzepatide", "retatrutide", "cagrilintide"],
  },
  {
    slug: "retatrutide",
    name: "Retatrutide",
    subtitle: "Triple GIP/GLP-1/glucagon receptor agonist",
    categorySlug: "glp-1",
    researchOverview:
      "Retatrutide is a tri-agonist investigated in clinical research for its activity " +
      "at GIP, GLP-1, and glucagon receptors simultaneously. Its multi-receptor profile " +
      "is an active area of metabolic research. Provider approval required for access.",
    benefits: [
      "Studied across three distinct metabolic receptor pathways",
      "Investigated for body-weight and composition research",
      "Emerging compound with an active clinical-research profile",
    ],
    reconstitution:
      "If prescribed, your provider and pharmacy supply exact reconstitution and dosing " +
      "instructions. Follow only those instructions.",
    status: "ACTIVE",
    variants: [
      { label: "10mg vial", sku: "HP-RETA-10", priceCents: 21900, compareAtCents: 24900, subscriptionEligible: true },
      { label: "20mg vial", sku: "HP-RETA-20", priceCents: 36900, compareAtCents: 41900, subscriptionEligible: true },
    ],
    relatedSlugs: ["tirzepatide", "semaglutide", "cagrilintide"],
  },
  {
    slug: "cagrilintide",
    name: "Cagrilintide",
    subtitle: "Long-acting amylin receptor agonist",
    categorySlug: "glp-1",
    researchOverview:
      "Cagrilintide is a long-acting amylin analogue studied for its role in appetite " +
      "and energy-balance signaling pathways. It is frequently investigated in combination " +
      "with GLP-1 receptor agonists in clinical research programs. Provider approval required.",
    benefits: [
      "Studied for amylin-pathway contributions to appetite signaling",
      "Investigated in combination metabolic research protocols",
      "Long-acting formulation studied in sustained-exposure models",
    ],
    reconstitution:
      "If prescribed, your provider and pharmacy supply exact reconstitution and dosing " +
      "instructions with your medication. Follow only those instructions.",
    status: "ACTIVE",
    variants: [
      { label: "10mg vial", sku: "HP-CAGR-10", priceCents: 19900, compareAtCents: 22900, subscriptionEligible: true },
    ],
    relatedSlugs: ["semaglutide", "retatrutide", "tirzepatide"],
  },

  // ── Fat Loss ────────────────────────────────────────────────────────────────
  {
    slug: "tesamorelin",
    name: "Tesamorelin",
    subtitle: "Growth-hormone-releasing hormone analogue",
    categorySlug: "fat-loss",
    researchOverview:
      "Tesamorelin is a synthetic analogue of growth-hormone-releasing hormone (GHRH) " +
      "studied for its effects on visceral adipose tissue. It is among the more " +
      "extensively characterized GHRH analogues in peer-reviewed literature. " +
      "Eligibility is determined by a licensed provider during consultation.",
    benefits: [
      "Studied for effects on visceral adipose tissue",
      "Investigated in growth-hormone secretion research",
      "GHRH-analogue with a characterized research profile",
    ],
    reconstitution:
      "If prescribed, follow the reconstitution and dosing instructions provided by " +
      "your pharmacy with your medication.",
    status: "ACTIVE",
    variants: [
      { label: "2mg vial", sku: "HP-TESA-2", priceCents: 7900, compareAtCents: 8900, subscriptionEligible: true },
      { label: "5mg vial", sku: "HP-TESA-5", priceCents: 15900, compareAtCents: 17900, subscriptionEligible: true },
    ],
    relatedSlugs: ["aod-9604", "ipamorelin", "cjc-1295"],
  },
  {
    slug: "aod-9604",
    name: "AOD-9604",
    subtitle: "Modified GH fragment 177–191",
    categorySlug: "fat-loss",
    researchOverview:
      "AOD-9604 is a synthetic fragment of the human growth-hormone (hGH) C-terminus " +
      "studied in preclinical and early-phase models for lipid-metabolism pathways. " +
      "Its research focuses on lipolytic signaling without full GH receptor activation. " +
      "Availability is subject to provider approval.",
    benefits: [
      "Studied for lipolytic signaling pathways",
      "Investigated as a modified GH fragment in metabolic models",
      "Explored in the context of fat-oxidation research",
    ],
    reconstitution:
      "If prescribed, follow the reconstitution and dosing instructions provided by " +
      "your pharmacy with your medication.",
    status: "ACTIVE",
    variants: [
      { label: "5mg vial", sku: "HP-AOD-5", priceCents: 6900, compareAtCents: 7900, subscriptionEligible: true },
    ],
    relatedSlugs: ["tesamorelin", "ipamorelin", "cjc-1295"],
  },

  // ── Healing / Recovery ──────────────────────────────────────────────────────
  {
    slug: "bpc-157",
    name: "BPC-157",
    subtitle: "Body-protection compound",
    categorySlug: "healing",
    researchOverview:
      "BPC-157 is a synthetic peptide studied in preclinical models for its role in " +
      "tissue-repair and angiogenic pathways. Availability is subject to provider approval.",
    benefits: [
      "Studied for tendon and soft-tissue repair pathways",
      "Investigated for gut-lining research models",
      "Frequently paired with TB-500 in recovery research",
    ],
    reconstitution:
      "If prescribed, follow the reconstitution and dosing instructions provided by your " +
      "pharmacy with your medication.",
    status: "ACTIVE",
    variants: [
      { label: "5mg vial", sku: "HP-BPC-5", priceCents: 5900, compareAtCents: 6900, subscriptionEligible: true },
      { label: "10mg vial", sku: "HP-BPC-10", priceCents: 9900, compareAtCents: 11900, subscriptionEligible: true },
    ],
    relatedSlugs: ["tb-500", "ghk-cu"],
  },
  {
    slug: "tb-500",
    name: "TB-500",
    subtitle: "Thymosin beta-4 synthetic fragment",
    categorySlug: "recovery",
    researchOverview:
      "TB-500 is a synthetic analogue of Thymosin Beta-4, a ubiquitous protein involved " +
      "in actin-regulation and cellular-migration pathways. It is studied in preclinical " +
      "models for tissue-repair and inflammatory-response research. " +
      "Provider approval is required for access.",
    benefits: [
      "Studied in actin-regulation and cell-motility research",
      "Investigated for soft-tissue and connective-tissue recovery models",
      "Frequently studied alongside BPC-157 in repair-pathway research",
    ],
    reconstitution:
      "If prescribed, follow the reconstitution and dosing instructions provided by " +
      "your pharmacy with your medication.",
    status: "ACTIVE",
    variants: [
      { label: "5mg vial", sku: "HP-TB5-5", priceCents: 6900, compareAtCents: 7900, subscriptionEligible: true },
      { label: "10mg vial", sku: "HP-TB5-10", priceCents: 11900, compareAtCents: 13900, subscriptionEligible: true },
    ],
    relatedSlugs: ["bpc-157", "ghk-cu"],
  },
  {
    slug: "ghk-cu",
    name: "GHK-Cu",
    subtitle: "Copper peptide complex",
    categorySlug: "healing",
    researchOverview:
      "GHK-Cu (glycyl-L-histidyl-L-lysine copper complex) is a naturally occurring " +
      "plasma peptide studied for its involvement in wound-healing, collagen-synthesis, " +
      "and anti-inflammatory signaling pathways. A substantial body of in-vitro and " +
      "preclinical research examines its regenerative potential. Provider approval required.",
    benefits: [
      "Studied for collagen-synthesis and wound-healing pathways",
      "Investigated in skin-regeneration research models",
      "Explored for anti-inflammatory signaling in preclinical studies",
    ],
    reconstitution:
      "If prescribed, follow the reconstitution and dosing instructions provided by " +
      "your pharmacy with your medication.",
    status: "ACTIVE",
    variants: [
      { label: "50mg vial", sku: "HP-GHKCU-50", priceCents: 7900, compareAtCents: 8900, subscriptionEligible: true },
    ],
    relatedSlugs: ["bpc-157", "tb-500"],
  },

  // ── Muscle Growth ───────────────────────────────────────────────────────────
  {
    slug: "ipamorelin",
    name: "Ipamorelin",
    subtitle: "Selective growth-hormone secretagogue",
    categorySlug: "muscle-growth",
    researchOverview:
      "Ipamorelin is a selective growth-hormone secretagogue receptor (GHSR) agonist " +
      "studied for its ability to stimulate pulsatile growth-hormone release with " +
      "a favorable selectivity profile. It is frequently investigated in body-composition " +
      "and recovery research. Provider approval required for access.",
    benefits: [
      "Studied for selective GH-secretagogue receptor activity",
      "Investigated for pulsatile GH-release kinetics",
      "Frequently combined with CJC-1295 in research protocols",
    ],
    reconstitution:
      "If prescribed, follow the reconstitution and dosing instructions provided by " +
      "your pharmacy with your medication.",
    status: "ACTIVE",
    variants: [
      { label: "5mg vial", sku: "HP-IPA-5", priceCents: 6500, compareAtCents: 7500, subscriptionEligible: true },
      { label: "10mg vial", sku: "HP-IPA-10", priceCents: 10900, compareAtCents: 12900, subscriptionEligible: true },
    ],
    relatedSlugs: ["cjc-1295", "tesamorelin", "aod-9604"],
  },
  {
    slug: "cjc-1295",
    name: "CJC-1295",
    subtitle: "GHRH analogue with DAC",
    categorySlug: "muscle-growth",
    researchOverview:
      "CJC-1295 is a synthetic GHRH analogue with a Drug Affinity Complex (DAC) " +
      "modification that extends its plasma half-life. It is studied for sustained " +
      "growth-hormone-axis stimulation and is frequently investigated alongside " +
      "ipamorelin in body-composition research. Provider approval required.",
    benefits: [
      "Studied for prolonged GHRH-axis stimulation via DAC modification",
      "Investigated in body-composition and recovery research",
      "Frequently paired with Ipamorelin in growth-hormone research protocols",
    ],
    reconstitution:
      "If prescribed, follow the reconstitution and dosing instructions provided by " +
      "your pharmacy with your medication.",
    status: "ACTIVE",
    variants: [
      { label: "5mg vial", sku: "HP-CJC-5", priceCents: 6500, compareAtCents: 7500, subscriptionEligible: true },
      { label: "10mg vial", sku: "HP-CJC-10", priceCents: 10900, compareAtCents: 12900, subscriptionEligible: true },
    ],
    relatedSlugs: ["ipamorelin", "tesamorelin", "aod-9604"],
  },

  // ── Longevity ───────────────────────────────────────────────────────────────
  {
    slug: "mots-c",
    name: "MOTS-c",
    subtitle: "Mitochondrial-derived peptide",
    categorySlug: "longevity",
    researchOverview:
      "MOTS-c (mitochondrial ORF of the 12S rRNA type-c) is a mitochondria-derived " +
      "peptide studied for its role in metabolic homeostasis, insulin signaling, and " +
      "cellular-stress response pathways. It represents an active area of aging and " +
      "exercise-physiology research. Provider approval required for access.",
    benefits: [
      "Studied in mitochondrial-signaling and metabolic research",
      "Investigated in insulin-sensitivity and cellular-stress models",
      "Explored in aging and exercise-physiology research programs",
    ],
    reconstitution:
      "If prescribed, follow the reconstitution and dosing instructions provided by " +
      "your pharmacy with your medication.",
    status: "ACTIVE",
    variants: [
      { label: "10mg vial", sku: "HP-MOTS-10", priceCents: 12900, compareAtCents: 14900, subscriptionEligible: true },
    ],
    relatedSlugs: ["nad-plus", "ghk-cu"],
  },
  {
    slug: "nad-plus",
    name: "NAD+",
    subtitle: "Nicotinamide adenine dinucleotide",
    categorySlug: "longevity",
    researchOverview:
      "NAD+ is a coenzyme central to cellular energy metabolism and is studied widely in " +
      "the context of cellular-aging and mitochondrial research. Provider approval required.",
    benefits: [
      "Central coenzyme in cellular energy metabolism",
      "Studied in mitochondrial-function research",
      "Investigated in cellular-aging protocols",
    ],
    reconstitution:
      "If prescribed, follow the instructions supplied by your pharmacy with your medication.",
    status: "ACTIVE",
    variants: [
      { label: "500mg vial", sku: "HP-NAD-500", priceCents: 8900, subscriptionEligible: true },
    ],
    relatedSlugs: ["mots-c", "ghk-cu"],
  },

  // ── Cognitive ───────────────────────────────────────────────────────────────
  {
    slug: "dsip",
    name: "DSIP",
    subtitle: "Delta sleep-inducing peptide",
    categorySlug: "cognitive",
    researchOverview:
      "Delta sleep-inducing peptide (DSIP) is a neuropeptide originally characterized " +
      "in thalamic tissue and studied for its involvement in sleep-cycle regulation " +
      "and neuroendocrine signaling pathways. Research examines its interactions with " +
      "multiple neurological systems. Availability is subject to provider approval.",
    benefits: [
      "Studied in sleep-architecture and circadian-rhythm research",
      "Investigated for neuroendocrine signaling interactions",
      "Explored in stress-response and cortisol-regulation research models",
    ],
    reconstitution:
      "If prescribed, follow the reconstitution and dosing instructions provided by " +
      "your pharmacy with your medication.",
    status: "ACTIVE",
    variants: [
      { label: "5mg vial", sku: "HP-DSIP-5", priceCents: 5900, compareAtCents: 6900, subscriptionEligible: true },
    ],
    relatedSlugs: ["mots-c", "nad-plus"],
  },
];

export const stacks: SeedStack[] = [
  { slug: "wolverine", name: "Wolverine Stack", tagline: "Recovery & repair, paired.",
    overview: "BPC-157 and TB-500 — the two most-studied recovery peptides, bundled.",
    protocol: "Your provider sets the protocol upon approval.",
    discountBps: 1500, productSlugs: ["bpc-157", "tb-500"] },
  { slug: "glp-1-advanced", name: "GLP-1 Advanced Stack", tagline: "Next-generation metabolic support.",
    overview: "Retatrutide paired with Cagrilintide for advanced metabolic protocols.",
    protocol: "Provider-directed dosing only.",
    discountBps: 1500, productSlugs: ["retatrutide", "cagrilintide"] },
  { slug: "recovery", name: "Recovery Stack", tagline: "Repair & regeneration.",
    overview: "BPC-157 with GHK-Cu for tissue and skin-repair research.",
    protocol: "Provider-directed dosing only.",
    discountBps: 1500, productSlugs: ["bpc-157", "ghk-cu"] },
  { slug: "longevity", name: "Longevity Stack", tagline: "Cellular energy & aging.",
    overview: "MOTS-c with NAD+ for cellular-energy and longevity research.",
    protocol: "Provider-directed dosing only.",
    discountBps: 1500, productSlugs: ["mots-c", "nad-plus"] },
];
