export type SeedVariant = { label: string; sku: string; mg: number; subscriptionEligible: boolean };
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

const RECON =
  "For research use, reconstitute the lyophilised peptide in an appropriate sterile research solvent. " +
  "Store refrigerated; minimise freeze-thaw cycles.";
const RECON_SOLID =
  "For research use, dissolve the lyophilised material in an appropriate sterile research solvent. " +
  "Store refrigerated; minimise freeze-thaw cycles.";

export const categories: SeedCategory[] = [
  {
    slug: "glp-1", name: "GLP-1 & Metabolic", order: 1,
    description: "Incretin and amylin analogues studied for glycemic and metabolic pathway research.",
    heroCopy: "Research peptides studied for metabolic and glycemic signalling pathways.",
  },
  {
    slug: "metabolic-fat-loss", name: "Metabolic & Fat Loss Research", order: 2,
    description: "Peptides and small molecules studied in the context of lipid metabolism and metabolic homeostasis.",
  },
  {
    slug: "healing-recovery", name: "Healing & Recovery", order: 3,
    description: "Peptides studied for tissue repair, angiogenesis, and anti-inflammatory signalling in pre-clinical models.",
  },
  {
    slug: "muscle-gh", name: "Muscle & GH-Axis Research", order: 4,
    description: "Growth-hormone-axis secretagogues and IGF-pathway peptides investigated in body-composition research.",
  },
  {
    slug: "longevity", name: "Longevity", order: 5,
    description: "Peptides and cofactors studied in the context of cellular ageing, mitochondrial function, and immunosenescence.",
  },
  {
    slug: "cognitive", name: "Cognitive & Nootropic Research", order: 6,
    description: "Neuropeptides studied for neurological function, stress response, and cognitive signalling pathways.",
  },
  {
    slug: "hormonal-reproductive", name: "Hormonal & Reproductive Research", order: 7,
    description: "Peptides investigated in the context of endocrine and reproductive signalling pathways.",
  },
  {
    slug: "sleep-recovery", name: "Sleep & Recovery", order: 8,
    description: "Neuropeptides studied for sleep-architecture regulation and neuroendocrine signalling.",
  },
  {
    slug: "skin-cosmetic", name: "Skin & Cosmetic Research", order: 9,
    description: "Peptides studied for collagen synthesis, pigmentation pathways, and dermal-repair models.",
  },
  {
    slug: "supplies", name: "Research Supplies", order: 10,
    description: "Research-grade solvents and consumables suitable for reconstituting lyophilised research peptides.",
  },
];

export const products: SeedProduct[] = [
  // ── GLP-1 & Metabolic ──────────────────────────────────────────────────────
  {
    slug: "semaglutide",
    name: "Semaglutide",
    subtitle: "GLP-1 receptor agonist",
    categorySlug: "glp-1",
    researchOverview:
      "Semaglutide is a GLP-1 receptor agonist studied for its role in glycemic regulation and appetite " +
      "signalling pathways. It is a frequently referenced compound in metabolic pharmacology research.",
    benefits: [
      "Studied for GLP-1 receptor binding and downstream signalling",
      "Investigated in glycemic and metabolic homeostasis research",
      "Well-characterised reference compound in appetite-pathway studies",
    ],
    reconstitution: RECON,
    status: "ACTIVE",
    variants: [
      { label: "5mg vial",  sku: "HX-SEMA-5",  mg: 5,  subscriptionEligible: false },
      { label: "10mg vial", sku: "HX-SEMA-10", mg: 10, subscriptionEligible: false },
      { label: "15mg vial", sku: "HX-SEMA-15", mg: 15, subscriptionEligible: false },
      { label: "20mg vial", sku: "HX-SEMA-20", mg: 20, subscriptionEligible: false },
      { label: "30mg vial", sku: "HX-SEMA-30", mg: 30, subscriptionEligible: false },
    ],
    relatedSlugs: ["tirzepatide", "retatrutide", "cagrilintide"],
  },
  {
    slug: "tirzepatide",
    name: "Tirzepatide",
    subtitle: "Dual GIP/GLP-1 receptor agonist",
    categorySlug: "glp-1",
    researchOverview:
      "Tirzepatide is a dual GIP and GLP-1 receptor agonist studied in metabolic pharmacology for its effects on " +
      "glycemic regulation and energy-balance signalling. Its dual-receptor mechanism is an active subject of " +
      "preclinical and clinical investigation.",
    benefits: [
      "Studied for dual GIP and GLP-1 receptor activity",
      "Investigated in glycemic and appetite signalling research",
      "Dual-receptor mechanism examined in metabolic pharmacology literature",
    ],
    reconstitution: RECON,
    status: "ACTIVE",
    variants: [
      { label: "5mg vial",   sku: "HX-TIRZ-5",   mg: 5,   subscriptionEligible: false },
      { label: "10mg vial",  sku: "HX-TIRZ-10",  mg: 10,  subscriptionEligible: false },
      { label: "15mg vial",  sku: "HX-TIRZ-15",  mg: 15,  subscriptionEligible: false },
      { label: "20mg vial",  sku: "HX-TIRZ-20",  mg: 20,  subscriptionEligible: false },
      { label: "30mg vial",  sku: "HX-TIRZ-30",  mg: 30,  subscriptionEligible: false },
      { label: "40mg vial",  sku: "HX-TIRZ-40",  mg: 40,  subscriptionEligible: false },
      { label: "50mg vial",  sku: "HX-TIRZ-50",  mg: 50,  subscriptionEligible: false },
      { label: "60mg vial",  sku: "HX-TIRZ-60",  mg: 60,  subscriptionEligible: false },
      { label: "70mg vial",  sku: "HX-TIRZ-70",  mg: 70,  subscriptionEligible: false },
      { label: "80mg vial",  sku: "HX-TIRZ-80",  mg: 80,  subscriptionEligible: false },
      { label: "90mg vial",  sku: "HX-TIRZ-90",  mg: 90,  subscriptionEligible: false },
      { label: "100mg vial", sku: "HX-TIRZ-100", mg: 100, subscriptionEligible: false },
      { label: "120mg vial", sku: "HX-TIRZ-120", mg: 120, subscriptionEligible: false },
    ],
    relatedSlugs: ["semaglutide", "retatrutide", "cagrilintide"],
  },
  {
    slug: "retatrutide",
    name: "Retatrutide",
    subtitle: "Triple GIP/GLP-1/glucagon receptor agonist",
    categorySlug: "glp-1",
    researchOverview:
      "Retatrutide is a tri-agonist studied for simultaneous activity at GIP, GLP-1, and glucagon receptors. " +
      "Its multi-receptor pharmacology represents an active direction in metabolic peptide research.",
    benefits: [
      "Studied across three distinct metabolic receptor pathways",
      "Investigated for multi-receptor pharmacology in preclinical models",
      "Emerging reference compound in GLP-1/GIP/glucagon axis research",
    ],
    reconstitution: RECON,
    status: "ACTIVE",
    variants: [
      { label: "5mg vial",  sku: "HX-RETA-5",  mg: 5,  subscriptionEligible: false },
      { label: "10mg vial", sku: "HX-RETA-10", mg: 10, subscriptionEligible: false },
      { label: "15mg vial", sku: "HX-RETA-15", mg: 15, subscriptionEligible: false },
      { label: "20mg vial", sku: "HX-RETA-20", mg: 20, subscriptionEligible: false },
      { label: "30mg vial", sku: "HX-RETA-30", mg: 30, subscriptionEligible: false },
      { label: "40mg vial", sku: "HX-RETA-40", mg: 40, subscriptionEligible: false },
      { label: "50mg vial", sku: "HX-RETA-50", mg: 50, subscriptionEligible: false },
      { label: "60mg vial", sku: "HX-RETA-60", mg: 60, subscriptionEligible: false },
    ],
    relatedSlugs: ["tirzepatide", "semaglutide", "cagrilintide"],
  },
  {
    slug: "cagrilintide",
    name: "Cagrilintide",
    subtitle: "Long-acting amylin analogue",
    categorySlug: "glp-1",
    researchOverview:
      "Cagrilintide is a long-acting amylin analogue investigated for its role in appetite and energy-balance " +
      "signalling. It is frequently studied alongside GLP-1 receptor agonists in clinical research programmes.",
    benefits: [
      "Studied for amylin-pathway contributions to appetite signalling",
      "Investigated in combination metabolic research settings",
      "Long-acting formulation studied in sustained-exposure models",
    ],
    reconstitution: RECON,
    status: "ACTIVE",
    variants: [
      { label: "5mg vial",  sku: "HX-CAGR-5",  mg: 5,  subscriptionEligible: false },
      { label: "10mg vial", sku: "HX-CAGR-10", mg: 10, subscriptionEligible: false },
    ],
    relatedSlugs: ["semaglutide", "retatrutide", "tirzepatide"],
  },

  // ── Metabolic & Fat Loss ────────────────────────────────────────────────────
  {
    slug: "aod-9604",
    name: "AOD-9604",
    subtitle: "Modified hGH C-terminal fragment",
    categorySlug: "metabolic-fat-loss",
    researchOverview:
      "AOD-9604 is a synthetic fragment of the human growth hormone C-terminus studied in preclinical models " +
      "for lipolytic signalling. It is investigated for fat-oxidation pathway activity independent of full GH-receptor activation.",
    benefits: [
      "Studied for lipolytic signalling in metabolic research models",
      "Investigated as a modified hGH fragment without full GH-receptor activation",
      "Explored in pre-clinical fat-oxidation pathway research",
    ],
    reconstitution: RECON,
    status: "ACTIVE",
    variants: [
      { label: "2mg vial", sku: "HX-AOD-2", mg: 2, subscriptionEligible: false },
      { label: "5mg vial", sku: "HX-AOD-5", mg: 5, subscriptionEligible: false },
    ],
    relatedSlugs: ["tesamorelin", "mots-c", "5-amino-1mq"],
  },
  {
    slug: "tesamorelin",
    name: "Tesamorelin",
    subtitle: "Synthetic GHRH analogue",
    categorySlug: "metabolic-fat-loss",
    researchOverview:
      "Tesamorelin is a synthetic analogue of growth-hormone-releasing hormone (GHRH) studied for effects on " +
      "visceral adipose tissue. It is one of the more extensively characterised GHRH analogues in peer-reviewed " +
      "metabolic literature.",
    benefits: [
      "Studied for GHRH receptor binding and GH-axis stimulation",
      "Investigated for effects on visceral adipose tissue in research models",
      "Characterised GHRH analogue with a defined research profile",
    ],
    reconstitution: RECON,
    status: "ACTIVE",
    variants: [
      { label: "2mg vial",  sku: "HX-TESA-2",  mg: 2,  subscriptionEligible: false },
      { label: "5mg vial",  sku: "HX-TESA-5",  mg: 5,  subscriptionEligible: false },
      { label: "10mg vial", sku: "HX-TESA-10", mg: 10, subscriptionEligible: false },
      { label: "20mg vial", sku: "HX-TESA-20", mg: 20, subscriptionEligible: false },
    ],
    relatedSlugs: ["aod-9604", "sermorelin", "mots-c"],
  },
  {
    slug: "mots-c",
    name: "MOTS-C",
    subtitle: "Mitochondria-derived peptide",
    categorySlug: "metabolic-fat-loss",
    researchOverview:
      "MOTS-c is a mitochondria-derived peptide encoded by the mitochondrial genome, studied for its role in " +
      "metabolic homeostasis, insulin signalling, and cellular stress response. It is an active subject in ageing " +
      "and exercise-physiology research.",
    benefits: [
      "Studied in mitochondrial signalling and metabolic homeostasis research",
      "Investigated in insulin-sensitivity and cellular stress models",
      "Explored in ageing and exercise-physiology research programmes",
    ],
    reconstitution: RECON,
    status: "ACTIVE",
    variants: [
      { label: "10mg vial", sku: "HX-MOTS-10", mg: 10, subscriptionEligible: false },
      { label: "20mg vial", sku: "HX-MOTS-20", mg: 20, subscriptionEligible: false },
      { label: "40mg vial", sku: "HX-MOTS-40", mg: 40, subscriptionEligible: false },
    ],
    relatedSlugs: ["nad-plus", "aicar", "tesamorelin"],
  },
  {
    slug: "5-amino-1mq",
    name: "5-Amino-1MQ",
    subtitle: "NNMT inhibitor small molecule",
    categorySlug: "metabolic-fat-loss",
    researchOverview:
      "5-Amino-1MQ is a small-molecule inhibitor of nicotinamide N-methyltransferase (NNMT) studied in preclinical " +
      "models for its effects on metabolic signalling and adipogenesis pathways.",
    benefits: [
      "Studied as an NNMT inhibitor in metabolic research models",
      "Investigated for effects on adipogenesis signalling pathways",
      "Pre-clinical reference compound in NAD+-linked metabolic research",
    ],
    reconstitution: RECON_SOLID,
    status: "ACTIVE",
    variants: [
      { label: "5mg vial",  sku: "HX-5AMQ-5",  mg: 5,  subscriptionEligible: false },
      { label: "50mg vial", sku: "HX-5AMQ-50", mg: 50, subscriptionEligible: false },
    ],
    relatedSlugs: ["mots-c", "aicar", "aod-9604"],
  },
  {
    slug: "adipotide",
    name: "Adipotide",
    subtitle: "Peptidomimetic targeting adipose vasculature",
    categorySlug: "metabolic-fat-loss",
    researchOverview:
      "Adipotide (CKGGRAKDC-GG-D(KLAKLAK)2) is a peptidomimetic studied in preclinical models for activity on " +
      "adipose-tissue vasculature and lipid metabolism signalling pathways.",
    benefits: [
      "Studied for targeted activity on adipose-tissue vasculature in pre-clinical models",
      "Investigated in lipid metabolism pathway research",
      "Unique peptidomimetic mechanism examined in animal-model research",
    ],
    reconstitution: RECON,
    status: "ACTIVE",
    variants: [
      { label: "5mg vial", sku: "HX-ADIP-5", mg: 5, subscriptionEligible: false },
    ],
    relatedSlugs: ["aod-9604", "tesamorelin", "mots-c"],
  },

  // ── Healing & Recovery ──────────────────────────────────────────────────────
  {
    slug: "bpc-157",
    name: "BPC-157",
    subtitle: "Body-protection compound pentadecapeptide",
    categorySlug: "healing-recovery",
    researchOverview:
      "BPC-157 is a synthetic pentadecapeptide studied in preclinical models for tissue-repair and angiogenic " +
      "signalling pathways. A substantial body of in-vitro and animal research examines its effects on connective " +
      "tissue, gut lining, and vascular biology.",
    benefits: [
      "Studied for tissue-repair and angiogenesis signalling",
      "Investigated in gut-lining and connective-tissue research models",
      "Frequently paired with TB-500 in recovery-pathway research",
    ],
    reconstitution: RECON,
    status: "ACTIVE",
    variants: [
      { label: "5mg vial",  sku: "HX-BPC-5",  mg: 5,  subscriptionEligible: false },
      { label: "10mg vial", sku: "HX-BPC-10", mg: 10, subscriptionEligible: false },
    ],
    relatedSlugs: ["tb-500", "ghk-cu", "kpv"],
  },
  {
    slug: "tb-500",
    name: "TB-500",
    subtitle: "Synthetic Thymosin Beta-4 fragment",
    categorySlug: "healing-recovery",
    researchOverview:
      "TB-500 is a synthetic analogue of Thymosin Beta-4 studied in preclinical models for actin-regulation, " +
      "cellular migration, and tissue-repair signalling. It is investigated extensively alongside BPC-157 in " +
      "recovery research.",
    benefits: [
      "Studied in actin-regulation and cell-motility research",
      "Investigated for soft-tissue and connective-tissue repair pathways",
      "Frequently studied alongside BPC-157 in repair-pathway research",
    ],
    reconstitution: RECON,
    status: "ACTIVE",
    variants: [
      { label: "5mg vial",  sku: "HX-TB5-5",  mg: 5,  subscriptionEligible: false },
      { label: "10mg vial", sku: "HX-TB5-10", mg: 10, subscriptionEligible: false },
    ],
    relatedSlugs: ["bpc-157", "ghk-cu", "kpv"],
  },
  {
    slug: "ghk-cu",
    name: "GHK-Cu",
    subtitle: "Copper peptide triplex",
    categorySlug: "healing-recovery",
    researchOverview:
      "GHK-Cu (glycyl-L-histidyl-L-lysine copper complex) is a naturally occurring plasma peptide studied for its " +
      "involvement in wound-healing, collagen synthesis, and anti-inflammatory signalling in pre-clinical models.",
    benefits: [
      "Studied for collagen-synthesis and wound-healing signalling",
      "Investigated in skin-regeneration and anti-inflammatory research",
      "Well-characterised copper complex with broad pre-clinical research interest",
    ],
    reconstitution: RECON,
    status: "ACTIVE",
    variants: [
      { label: "50mg vial",  sku: "HX-GHK-50",  mg: 50,  subscriptionEligible: false },
      { label: "100mg vial", sku: "HX-GHK-100", mg: 100, subscriptionEligible: false },
    ],
    relatedSlugs: ["bpc-157", "tb-500", "kpv"],
  },
  {
    slug: "kpv",
    name: "KPV",
    subtitle: "Alpha-MSH C-terminal tripeptide",
    categorySlug: "healing-recovery",
    researchOverview:
      "KPV (Lys-Pro-Val) is a C-terminal tripeptide of alpha-melanocyte-stimulating hormone studied in preclinical " +
      "models for anti-inflammatory and gut-repair signalling pathways.",
    benefits: [
      "Studied for anti-inflammatory signalling in gut-model research",
      "Investigated as an alpha-MSH C-terminal fragment in skin and GI research",
      "Explored in inflammatory-pathway modulation studies",
    ],
    reconstitution: RECON,
    status: "ACTIVE",
    variants: [
      { label: "5mg vial",  sku: "HX-KPV-5",  mg: 5,  subscriptionEligible: false },
      { label: "10mg vial", sku: "HX-KPV-10", mg: 10, subscriptionEligible: false },
    ],
    relatedSlugs: ["bpc-157", "tb-500", "ghk-cu"],
  },
  {
    slug: "ll-37",
    name: "LL-37",
    subtitle: "Cathelicidin-derived antimicrobial peptide",
    categorySlug: "healing-recovery",
    researchOverview:
      "LL-37 is a cathelicidin-derived peptide studied for antimicrobial activity, innate-immune modulation, and " +
      "wound-healing signalling in preclinical research models.",
    benefits: [
      "Studied for innate-immune signalling and antimicrobial research",
      "Investigated in wound-healing and angiogenesis pathway research",
      "Explored in inflammatory and immunomodulatory pre-clinical studies",
    ],
    reconstitution: RECON,
    status: "ACTIVE",
    variants: [
      { label: "5mg vial", sku: "HX-LL37-5", mg: 5, subscriptionEligible: false },
    ],
    relatedSlugs: ["bpc-157", "kpv", "ghk-cu"],
  },
  {
    slug: "ara-290",
    name: "ARA-290",
    subtitle: "Erythropoietin-derived non-haematopoietic peptide",
    categorySlug: "healing-recovery",
    researchOverview:
      "ARA-290 is an 11-amino-acid peptide derived from the non-haematopoietic domain of erythropoietin, studied " +
      "for its activity on innate-repair receptor pathways and anti-inflammatory signalling.",
    benefits: [
      "Studied for innate-repair receptor activity in pre-clinical research",
      "Investigated in anti-inflammatory and neuroprotective signalling models",
      "Non-haematopoietic EPO fragment with a distinct pharmacological profile",
    ],
    reconstitution: RECON,
    status: "ACTIVE",
    variants: [
      { label: "10mg vial", sku: "HX-ARA-10", mg: 10, subscriptionEligible: false },
    ],
    relatedSlugs: ["bpc-157", "kpv", "ll-37"],
  },
  {
    slug: "vip",
    name: "VIP",
    subtitle: "Vasoactive intestinal peptide",
    categorySlug: "healing-recovery",
    researchOverview:
      "Vasoactive intestinal peptide (VIP) is a neuropeptide studied for its roles in vasodilation, smooth-muscle " +
      "relaxation, anti-inflammatory signalling, and neuroendocrine modulation in pre-clinical research.",
    benefits: [
      "Studied for vasodilatory and smooth-muscle signalling research",
      "Investigated in anti-inflammatory and neuroendocrine pathway research",
      "Explored in immunomodulatory and gut-motility pre-clinical models",
    ],
    reconstitution: RECON,
    status: "ACTIVE",
    variants: [
      { label: "10mg vial", sku: "HX-VIP-10", mg: 10, subscriptionEligible: false },
    ],
    relatedSlugs: ["bpc-157", "ll-37", "ara-290"],
  },

  // ── Muscle & GH-Axis ────────────────────────────────────────────────────────
  {
    slug: "cjc-1295-no-dac",
    name: "CJC-1295 (no DAC)",
    subtitle: "Short-acting GHRH analogue",
    categorySlug: "muscle-gh",
    researchOverview:
      "CJC-1295 without DAC (Mod GRF 1-29) is a truncated GHRH analogue studied for pulsatile " +
      "growth-hormone-axis stimulation in preclinical research models.",
    benefits: [
      "Studied for short-acting GHRH-receptor activation in research models",
      "Investigated for pulsatile GH-secretion kinetics",
      "Frequently paired with GH secretagogues in GH-axis research",
    ],
    reconstitution: RECON,
    status: "ACTIVE",
    variants: [
      { label: "2mg vial",  sku: "HX-CJC-2",  mg: 2,  subscriptionEligible: false },
      { label: "5mg vial",  sku: "HX-CJC-5",  mg: 5,  subscriptionEligible: false },
      { label: "10mg vial", sku: "HX-CJC-10", mg: 10, subscriptionEligible: false },
    ],
    relatedSlugs: ["ipamorelin", "sermorelin", "cjc-1295-dac"],
  },
  {
    slug: "cjc-1295-dac",
    name: "CJC-1295 (with DAC)",
    subtitle: "Long-acting GHRH analogue with Drug Affinity Complex",
    categorySlug: "muscle-gh",
    researchOverview:
      "CJC-1295 with DAC is a GHRH analogue bearing a Drug Affinity Complex (DAC) modification that extends " +
      "plasma half-life. It is studied for sustained GH-axis stimulation and examined in body-composition research.",
    benefits: [
      "Studied for prolonged GHRH-axis stimulation via DAC modification",
      "Investigated in body-composition and GH-secretion research",
      "Long-acting GHRH reference compound with characterised PK profile",
    ],
    reconstitution: RECON,
    status: "ACTIVE",
    variants: [
      { label: "2mg vial", sku: "HX-CJCD-2", mg: 2, subscriptionEligible: false },
      { label: "5mg vial", sku: "HX-CJCD-5", mg: 5, subscriptionEligible: false },
    ],
    relatedSlugs: ["cjc-1295-no-dac", "ipamorelin", "sermorelin"],
  },
  {
    slug: "ipamorelin",
    name: "Ipamorelin",
    subtitle: "Selective GH secretagogue receptor agonist",
    categorySlug: "muscle-gh",
    researchOverview:
      "Ipamorelin is a selective growth-hormone secretagogue receptor (GHSR) agonist studied for pulsatile " +
      "growth-hormone release with a favourable selectivity profile in preclinical and research settings.",
    benefits: [
      "Studied for selective GHSR agonism and pulsatile GH-release kinetics",
      "Investigated in body-composition and GH-axis research",
      "Frequently combined with CJC-1295 in GH-secretagogue research protocols",
    ],
    reconstitution: RECON,
    status: "ACTIVE",
    variants: [
      { label: "5mg vial",  sku: "HX-IPA-5",  mg: 5,  subscriptionEligible: false },
      { label: "10mg vial", sku: "HX-IPA-10", mg: 10, subscriptionEligible: false },
    ],
    relatedSlugs: ["cjc-1295-no-dac", "sermorelin", "ghrp-2"],
  },
  {
    slug: "sermorelin",
    name: "Sermorelin",
    subtitle: "Synthetic GHRH(1-29) analogue",
    categorySlug: "muscle-gh",
    researchOverview:
      "Sermorelin is a synthetic analogue of the first 29 amino acids of endogenous GHRH, studied for " +
      "growth-hormone-axis stimulation and GH-secretion research in preclinical models.",
    benefits: [
      "Studied for GHRH(1-29) receptor binding and GH-axis stimulation",
      "Investigated in GH-secretion and body-composition research",
      "Well-characterised short-sequence GHRH reference peptide",
    ],
    reconstitution: RECON,
    status: "ACTIVE",
    variants: [
      { label: "5mg vial",  sku: "HX-SERM-5",  mg: 5,  subscriptionEligible: false },
      { label: "10mg vial", sku: "HX-SERM-10", mg: 10, subscriptionEligible: false },
    ],
    relatedSlugs: ["ipamorelin", "cjc-1295-no-dac", "ghrp-6"],
  },
  {
    slug: "hexarelin",
    name: "Hexarelin",
    subtitle: "Synthetic hexapeptide GH secretagogue",
    categorySlug: "muscle-gh",
    researchOverview:
      "Hexarelin is a synthetic hexapeptide growth-hormone secretagogue studied for potent GHSR agonism and " +
      "cardioprotective pathway research in preclinical models.",
    benefits: [
      "Studied for potent GHSR agonism in GH-axis research",
      "Investigated in cardioprotective signalling pathway research",
      "Synthetic hexapeptide with a well-characterised pre-clinical profile",
    ],
    reconstitution: RECON,
    status: "ACTIVE",
    variants: [
      { label: "5mg vial", sku: "HX-HEX-5", mg: 5, subscriptionEligible: false },
    ],
    relatedSlugs: ["ghrp-2", "ipamorelin", "sermorelin"],
  },
  {
    slug: "ghrp-2",
    name: "GHRP-2",
    subtitle: "Growth hormone-releasing peptide 2",
    categorySlug: "muscle-gh",
    researchOverview:
      "GHRP-2 is a synthetic hexapeptide studied for potent GH-secretagogue activity and ghrelin-receptor " +
      "agonism in preclinical research models.",
    benefits: [
      "Studied for GH-secretagogue and ghrelin-receptor agonist activity",
      "Investigated in GH-axis and metabolic pathway research",
      "Well-studied reference hexapeptide in secretagogue pharmacology",
    ],
    reconstitution: RECON,
    status: "ACTIVE",
    variants: [
      { label: "5mg vial",  sku: "HX-GH2-5",  mg: 5,  subscriptionEligible: false },
      { label: "10mg vial", sku: "HX-GH2-10", mg: 10, subscriptionEligible: false },
    ],
    relatedSlugs: ["ghrp-6", "ipamorelin", "hexarelin"],
  },
  {
    slug: "ghrp-6",
    name: "GHRP-6",
    subtitle: "Growth hormone-releasing peptide 6",
    categorySlug: "muscle-gh",
    researchOverview:
      "GHRP-6 is a synthetic hexapeptide studied for GH-releasing activity and appetite-stimulating signalling " +
      "pathways mediated via ghrelin-receptor agonism in pre-clinical models.",
    benefits: [
      "Studied for GH-releasing and ghrelin-receptor agonist activity",
      "Investigated in appetite-signalling and metabolic research models",
      "Classic secretagogue reference compound in GH-axis pharmacology",
    ],
    reconstitution: RECON,
    status: "ACTIVE",
    variants: [
      { label: "5mg vial",  sku: "HX-GH6-5",  mg: 5,  subscriptionEligible: false },
      { label: "10mg vial", sku: "HX-GH6-10", mg: 10, subscriptionEligible: false },
    ],
    relatedSlugs: ["ghrp-2", "ipamorelin", "sermorelin"],
  },
  {
    slug: "igf-1-lr3",
    name: "IGF-1 LR3",
    subtitle: "Long Arg3 IGF-1 analogue",
    categorySlug: "muscle-gh",
    researchOverview:
      "IGF-1 LR3 is a long-acting analogue of insulin-like growth factor-1 studied for IGF receptor binding and " +
      "downstream anabolic signalling pathways in preclinical muscle and tissue research.",
    benefits: [
      "Studied for IGF-1 receptor binding and anabolic signalling research",
      "Investigated in muscle-tissue and protein-synthesis pathway models",
      "Long-acting analogue with extended half-life examined in pre-clinical settings",
    ],
    reconstitution: RECON,
    status: "ACTIVE",
    variants: [
      { label: "0.1mg vial", sku: "HX-IGF-01", mg: 0.1, subscriptionEligible: false },
      { label: "1mg vial",   sku: "HX-IGF-1",  mg: 1,   subscriptionEligible: false },
    ],
    relatedSlugs: ["mgf", "peg-mgf", "ghrp-2"],
  },
  {
    slug: "mgf",
    name: "MGF",
    subtitle: "Mechano growth factor",
    categorySlug: "muscle-gh",
    researchOverview:
      "MGF (mechano growth factor) is a splice variant of the IGF-1 gene studied for its role in satellite-cell " +
      "activation, muscle-tissue repair, and anabolic signalling pathways in preclinical research.",
    benefits: [
      "Studied for satellite-cell activation signalling in muscle-repair research",
      "Investigated as an IGF-1 splice variant in anabolic pathway research",
      "Explored in muscle-tissue regeneration and hypertrophy signalling models",
    ],
    reconstitution: RECON,
    status: "ACTIVE",
    variants: [
      { label: "2mg vial", sku: "HX-MGF-2", mg: 2, subscriptionEligible: false },
    ],
    relatedSlugs: ["igf-1-lr3", "peg-mgf", "ghrp-2"],
  },
  {
    slug: "peg-mgf",
    name: "PEG-MGF",
    subtitle: "PEGylated mechano growth factor",
    categorySlug: "muscle-gh",
    researchOverview:
      "PEG-MGF is a PEGylated form of mechano growth factor studied for extended systemic availability and " +
      "muscle-repair signalling pathways in preclinical research models.",
    benefits: [
      "Studied for PEGylation-extended half-life in MGF pathway research",
      "Investigated in muscle satellite-cell and anabolic signalling research",
      "Systemic availability profile examined in preclinical research models",
    ],
    reconstitution: RECON,
    status: "ACTIVE",
    variants: [
      { label: "2mg vial", sku: "HX-PEGM-2", mg: 2, subscriptionEligible: false },
    ],
    relatedSlugs: ["mgf", "igf-1-lr3", "ghrp-2"],
  },

  // ── Longevity ───────────────────────────────────────────────────────────────
  {
    slug: "nad-plus",
    name: "NAD+",
    subtitle: "Nicotinamide adenine dinucleotide",
    categorySlug: "longevity",
    researchOverview:
      "NAD+ is a coenzyme central to cellular energy metabolism, redox signalling, and sirtuin activation. " +
      "It is studied extensively in cellular-ageing, mitochondrial function, and DNA-repair research contexts.",
    benefits: [
      "Central coenzyme studied in cellular energy metabolism research",
      "Investigated in mitochondrial function and sirtuin-activation models",
      "Extensively researched in cellular-ageing and DNA-repair pathway contexts",
    ],
    reconstitution: RECON_SOLID,
    status: "ACTIVE",
    variants: [
      { label: "100mg vial",  sku: "HX-NAD-100",  mg: 100,  subscriptionEligible: false },
      { label: "500mg vial",  sku: "HX-NAD-500",  mg: 500,  subscriptionEligible: false },
      { label: "1000mg vial", sku: "HX-NAD-1000", mg: 1000, subscriptionEligible: false },
    ],
    relatedSlugs: ["mots-c", "aicar", "glutathione"],
  },
  {
    slug: "epitalon",
    name: "Epitalon",
    subtitle: "Tetrapeptide pineal gland bioregulator",
    categorySlug: "longevity",
    researchOverview:
      "Epitalon (Ala-Glu-Asp-Gly) is a synthetic tetrapeptide studied as a bioregulator of pineal-gland " +
      "function, telomerase activation, and circadian-rhythm signalling in pre-clinical ageing research.",
    benefits: [
      "Studied for telomerase activation signalling in ageing research",
      "Investigated as a pineal-gland bioregulator in pre-clinical models",
      "Explored in circadian-rhythm and immunosenescence pathway research",
    ],
    reconstitution: RECON,
    status: "ACTIVE",
    variants: [
      { label: "10mg vial", sku: "HX-EPIT-10", mg: 10, subscriptionEligible: false },
      { label: "50mg vial", sku: "HX-EPIT-50", mg: 50, subscriptionEligible: false },
    ],
    relatedSlugs: ["thymalin", "thymosin-alpha-1", "pinealon"],
  },
  {
    slug: "ss-31",
    name: "SS-31",
    subtitle: "Mitochondria-targeted tetrapeptide",
    categorySlug: "longevity",
    researchOverview:
      "SS-31 (Szeto-Schiller 31) is a mitochondria-targeted antioxidant tetrapeptide studied for cardiolipin " +
      "interaction, mitochondrial membrane stabilisation, and ROS-attenuation signalling in pre-clinical ageing " +
      "and cardiac research.",
    benefits: [
      "Studied for mitochondrial membrane stabilisation in pre-clinical models",
      "Investigated in ROS-attenuation and cardiolipin-interaction research",
      "Explored in cardiac and ageing pathway research programmes",
    ],
    reconstitution: RECON,
    status: "ACTIVE",
    variants: [
      { label: "10mg vial", sku: "HX-SS31-10", mg: 10, subscriptionEligible: false },
      { label: "50mg vial", sku: "HX-SS31-50", mg: 50, subscriptionEligible: false },
    ],
    relatedSlugs: ["nad-plus", "aicar", "mots-c"],
  },
  {
    slug: "thymalin",
    name: "Thymalin",
    subtitle: "Thymic peptide complex bioregulator",
    categorySlug: "longevity",
    researchOverview:
      "Thymalin is a thymic peptide complex studied as a bioregulator of immune function and thymic activity, " +
      "investigated in the context of immunosenescence and age-related immune decline in preclinical research.",
    benefits: [
      "Studied for thymic bioregulator activity in immune-function research",
      "Investigated in immunosenescence and age-related immune pathway models",
      "Explored in thymic function and T-cell signalling research",
    ],
    reconstitution: RECON,
    status: "ACTIVE",
    variants: [
      { label: "10mg vial", sku: "HX-THYM-10", mg: 10, subscriptionEligible: false },
    ],
    relatedSlugs: ["thymosin-alpha-1", "epitalon", "pinealon"],
  },
  {
    slug: "thymosin-alpha-1",
    name: "Thymosin alpha-1",
    subtitle: "Thymic immune-modulatory peptide",
    categorySlug: "longevity",
    researchOverview:
      "Thymosin alpha-1 is a thymic peptide studied extensively for immune-modulation, T-cell function, and " +
      "innate-immune signalling pathway research in preclinical and clinical research settings.",
    benefits: [
      "Studied for T-cell activation and immune-modulation pathway research",
      "Investigated in innate-immune and adaptive-immune signalling models",
      "Well-characterised thymic peptide with a broad pre-clinical research profile",
    ],
    reconstitution: RECON,
    status: "ACTIVE",
    variants: [
      { label: "5mg vial",  sku: "HX-THYA-5",  mg: 5,  subscriptionEligible: false },
      { label: "10mg vial", sku: "HX-THYA-10", mg: 10, subscriptionEligible: false },
    ],
    relatedSlugs: ["thymalin", "epitalon", "pinealon"],
  },
  {
    slug: "foxo4",
    name: "FOXO4",
    subtitle: "Senolytic FOXO4-p53 interfering peptide",
    categorySlug: "longevity",
    researchOverview:
      "FOXO4-DRI is a D-amino-acid retro-inverso peptide designed to interfere with FOXO4-p53 interaction. " +
      "It is studied in preclinical models for senolytic activity and clearance of senescent cell populations.",
    benefits: [
      "Studied for FOXO4-p53 interaction interference and senolytic activity",
      "Investigated in senescent-cell clearance signalling research models",
      "Pre-clinical reference compound in cellular-senescence biology",
    ],
    reconstitution: RECON,
    status: "ACTIVE",
    variants: [
      { label: "10mg vial", sku: "HX-FOX4-10", mg: 10, subscriptionEligible: false },
    ],
    relatedSlugs: ["nad-plus", "aicar", "ss-31"],
  },
  {
    slug: "pinealon",
    name: "Pinealon",
    subtitle: "Pineal gland tripeptide bioregulator",
    categorySlug: "longevity",
    researchOverview:
      "Pinealon (EDR tripeptide) is a synthetic peptide bioregulator studied for pineal-gland function, " +
      "neuroprotective signalling, and circadian-rhythm modulation in pre-clinical research models.",
    benefits: [
      "Studied for pineal-gland bioregulation and neuroprotective signalling",
      "Investigated in circadian-rhythm modulation pathway research",
      "Explored in cognitive and age-associated neurological pre-clinical research",
    ],
    reconstitution: RECON,
    status: "ACTIVE",
    variants: [
      { label: "10mg vial", sku: "HX-PINE-10", mg: 10, subscriptionEligible: false },
    ],
    relatedSlugs: ["epitalon", "thymalin", "thymosin-alpha-1"],
  },
  {
    slug: "glutathione",
    name: "Glutathione",
    subtitle: "Tripeptide antioxidant cofactor",
    categorySlug: "longevity",
    researchOverview:
      "Glutathione (gamma-L-glutamyl-L-cysteinyl-glycine) is a ubiquitous tripeptide antioxidant studied for its " +
      "role in redox homeostasis, oxidative-stress attenuation, and detoxification pathway research.",
    benefits: [
      "Studied for redox homeostasis and oxidative-stress attenuation signalling",
      "Investigated in detoxification and GSH-pathway research models",
      "Well-characterised antioxidant cofactor in cellular-health research",
    ],
    reconstitution: RECON_SOLID,
    status: "ACTIVE",
    variants: [
      { label: "600mg vial",  sku: "HX-GLUT-600",  mg: 600,  subscriptionEligible: false },
      { label: "1500mg vial", sku: "HX-GLUT-1500", mg: 1500, subscriptionEligible: false },
    ],
    relatedSlugs: ["nad-plus", "aicar", "ss-31"],
  },
  {
    slug: "aicar",
    name: "AICAR",
    subtitle: "AMPK-activating nucleotide analogue",
    categorySlug: "longevity",
    researchOverview:
      "AICAR (5-aminoimidazole-4-carboxamide ribonucleotide) is a cell-permeable nucleotide analogue studied for " +
      "AMPK activation and downstream metabolic and longevity signalling pathways in preclinical models.",
    benefits: [
      "Studied for AMPK activation and metabolic signalling pathway research",
      "Investigated in mitochondrial biogenesis and energy-homeostasis models",
      "Pre-clinical reference compound in AMPK-pathway and longevity research",
    ],
    reconstitution: RECON_SOLID,
    status: "ACTIVE",
    variants: [
      { label: "50mg vial", sku: "HX-AICR-50", mg: 50, subscriptionEligible: false },
    ],
    relatedSlugs: ["mots-c", "nad-plus", "ss-31"],
  },

  // ── Cognitive & Nootropic ────────────────────────────────────────────────────
  {
    slug: "semax",
    name: "Semax",
    subtitle: "ACTH-derived neuropeptide analogue",
    categorySlug: "cognitive",
    researchOverview:
      "Semax is a synthetic heptapeptide analogue of ACTH(4-7)PGP studied for neurotrophic signalling, BDNF " +
      "upregulation, and cognitive-function pathway research in preclinical neurological models.",
    benefits: [
      "Studied for BDNF upregulation and neurotrophic signalling research",
      "Investigated in cognitive-function and stress-response pathway models",
      "ACTH-derived neuropeptide with characterised pre-clinical neurological profile",
    ],
    reconstitution: RECON,
    status: "ACTIVE",
    variants: [
      { label: "5mg vial",  sku: "HX-SEMX-5",  mg: 5,  subscriptionEligible: false },
      { label: "10mg vial", sku: "HX-SEMX-10", mg: 10, subscriptionEligible: false },
    ],
    relatedSlugs: ["selank", "dsip"],
  },
  {
    slug: "selank",
    name: "Selank",
    subtitle: "Anxiolytic heptapeptide analogue",
    categorySlug: "cognitive",
    researchOverview:
      "Selank is a synthetic heptapeptide analogue of the endogenous tetrapeptide Tuftsin, studied for " +
      "anxiolytic signalling, GABA-pathway modulation, and neurotrophic activity in preclinical models.",
    benefits: [
      "Studied for anxiolytic signalling and GABA-pathway modulation in pre-clinical research",
      "Investigated in neurotrophic and stress-response pathway research",
      "Tuftsin-analogue with characterised pre-clinical neurological research profile",
    ],
    reconstitution: RECON,
    status: "ACTIVE",
    variants: [
      { label: "5mg vial",  sku: "HX-SLNK-5",  mg: 5,  subscriptionEligible: false },
      { label: "10mg vial", sku: "HX-SLNK-10", mg: 10, subscriptionEligible: false },
    ],
    relatedSlugs: ["semax", "dsip"],
  },

  // ── Hormonal & Reproductive ─────────────────────────────────────────────────
  {
    slug: "pt-141",
    name: "PT-141",
    subtitle: "Melanocortin receptor agonist",
    categorySlug: "hormonal-reproductive",
    researchOverview:
      "PT-141 (Bremelanotide) is a cyclic heptapeptide melanocortin receptor agonist studied for central and " +
      "peripheral sexual-function signalling pathways in preclinical and clinical research.",
    benefits: [
      "Studied for melanocortin receptor agonism in sexual-function pathway research",
      "Investigated in central and peripheral arousal-signalling pre-clinical models",
      "Characterised melanocortin reference compound in reproductive pharmacology",
    ],
    reconstitution: RECON,
    status: "ACTIVE",
    variants: [
      { label: "10mg vial", sku: "HX-PT14-10", mg: 10, subscriptionEligible: false },
    ],
    relatedSlugs: ["kisspeptin-10", "gonadorelin", "oxytocin"],
  },
  {
    slug: "kisspeptin-10",
    name: "Kisspeptin-10",
    subtitle: "GPR54 receptor agonist neuropeptide",
    categorySlug: "hormonal-reproductive",
    researchOverview:
      "Kisspeptin-10 is a 10-amino-acid C-terminal fragment of kisspeptin studied for GPR54 receptor agonism " +
      "and downstream GnRH-pulse regulation signalling in reproductive neuroendocrinology research.",
    benefits: [
      "Studied for GPR54 agonism and GnRH-pulse signalling research",
      "Investigated in hypothalamic-pituitary-gonadal axis pathway research",
      "Reference neuropeptide in reproductive neuroendocrinology research",
    ],
    reconstitution: RECON,
    status: "ACTIVE",
    variants: [
      { label: "5mg vial",  sku: "HX-KISS-5",  mg: 5,  subscriptionEligible: false },
      { label: "10mg vial", sku: "HX-KISS-10", mg: 10, subscriptionEligible: false },
    ],
    relatedSlugs: ["gonadorelin", "pt-141", "gonadorelin-acetate"],
  },
  {
    slug: "gonadorelin",
    name: "Gonadorelin",
    subtitle: "Synthetic GnRH decapeptide",
    categorySlug: "hormonal-reproductive",
    researchOverview:
      "Gonadorelin is a synthetic decapeptide identical to endogenous gonadotropin-releasing hormone (GnRH) " +
      "studied for pituitary LH and FSH secretion stimulation in reproductive endocrinology research.",
    benefits: [
      "Studied for GnRH receptor agonism and pituitary-LH/FSH stimulation research",
      "Investigated in hypothalamic-pituitary-gonadal axis signalling models",
      "Reference GnRH compound in reproductive neuroendocrinology research",
    ],
    reconstitution: RECON,
    status: "ACTIVE",
    variants: [
      { label: "2mg vial", sku: "HX-GOND-2", mg: 2, subscriptionEligible: false },
    ],
    relatedSlugs: ["gonadorelin-acetate", "kisspeptin-10", "hmg"],
  },
  {
    slug: "gonadorelin-acetate",
    name: "Gonadorelin Acetate",
    subtitle: "Acetate salt form of synthetic GnRH",
    categorySlug: "hormonal-reproductive",
    researchOverview:
      "Gonadorelin Acetate is the acetate salt form of synthetic GnRH, offering equivalent GnRH receptor agonism " +
      "in research settings. It is studied for pituitary stimulation and HPG-axis signalling research.",
    benefits: [
      "Studied for GnRH receptor agonism equivalent to free-base gonadorelin",
      "Investigated in HPG-axis signalling and pituitary-stimulation research",
      "Acetate salt formulation with characterised solubility in research solvents",
    ],
    reconstitution: RECON,
    status: "ACTIVE",
    variants: [
      { label: "2mg vial", sku: "HX-GNDA-2", mg: 2, subscriptionEligible: false },
    ],
    relatedSlugs: ["gonadorelin", "kisspeptin-10", "hmg"],
  },
  {
    slug: "hcg",
    name: "HCG",
    subtitle: "Human chorionic gonadotropin",
    categorySlug: "hormonal-reproductive",
    researchOverview:
      "Human chorionic gonadotropin (hCG) is a glycoprotein hormone studied for LH-receptor agonism, " +
      "steroidogenesis stimulation, and Leydig-cell function in reproductive endocrinology research models.",
    benefits: [
      "Studied for LH-receptor agonism and steroidogenesis pathway research",
      "Investigated in Leydig-cell function and gonadal endocrinology research",
      "Reference glycoprotein in reproductive-axis pharmacology studies",
    ],
    reconstitution:
      "For research use, reconstitute the lyophilised glycoprotein in an appropriate sterile research solvent. " +
      "Store refrigerated; minimise freeze-thaw cycles.",
    status: "ACTIVE",
    variants: [
      { label: "5000iu vial", sku: "HX-HCG-5000", mg: 5000, subscriptionEligible: false },
    ],
    relatedSlugs: ["hmg", "gonadorelin", "kisspeptin-10"],
  },
  {
    slug: "hmg",
    name: "HMG",
    subtitle: "Human menopausal gonadotropin",
    categorySlug: "hormonal-reproductive",
    researchOverview:
      "Human menopausal gonadotropin (hMG) is a gonadotropin preparation studied for combined FSH and LH " +
      "activity, investigated in ovarian and testicular stimulation pathway research.",
    benefits: [
      "Studied for combined FSH and LH activity in gonadotropin research",
      "Investigated in ovarian and testicular stimulation pathway models",
      "Reference gonadotropin preparation in reproductive endocrinology research",
    ],
    reconstitution:
      "For research use, reconstitute the lyophilised preparation in an appropriate sterile research solvent. " +
      "Store refrigerated; minimise freeze-thaw cycles.",
    status: "ACTIVE",
    variants: [
      { label: "75iu vial", sku: "HX-HMG-75", mg: 75, subscriptionEligible: false },
    ],
    relatedSlugs: ["hcg", "gonadorelin", "kisspeptin-10"],
  },
  {
    slug: "oxytocin",
    name: "Oxytocin",
    subtitle: "Nonapeptide neurohypophysial hormone",
    categorySlug: "hormonal-reproductive",
    researchOverview:
      "Oxytocin is a nonapeptide studied for its roles in social bonding signalling, uterine contractility, and " +
      "neuromodulatory pathway research in preclinical and clinical neuroendocrinology studies.",
    benefits: [
      "Studied for social bonding and neuromodulatory signalling pathway research",
      "Investigated in uterine-contractility and reproductive-endocrinology models",
      "Well-characterised nonapeptide in neuroendocrinology research",
    ],
    reconstitution: RECON,
    status: "ACTIVE",
    variants: [
      { label: "2mg vial", sku: "HX-OXT-2", mg: 2, subscriptionEligible: false },
      { label: "5mg vial", sku: "HX-OXT-5", mg: 5, subscriptionEligible: false },
    ],
    relatedSlugs: ["kisspeptin-10", "pt-141", "gonadorelin"],
  },

  // ── Sleep & Recovery ─────────────────────────────────────────────────────────
  {
    slug: "dsip",
    name: "DSIP",
    subtitle: "Delta sleep-inducing peptide",
    categorySlug: "sleep-recovery",
    researchOverview:
      "Delta sleep-inducing peptide (DSIP) is a neuropeptide originally characterised in thalamic tissue, studied " +
      "for sleep-architecture regulation and neuroendocrine signalling interactions in pre-clinical research.",
    benefits: [
      "Studied in sleep-architecture and circadian-rhythm signalling research",
      "Investigated for neuroendocrine interaction pathways",
      "Explored in stress-response and cortisol-regulation pre-clinical models",
    ],
    reconstitution: RECON,
    status: "ACTIVE",
    variants: [
      { label: "5mg vial",  sku: "HX-DSIP-5",  mg: 5,  subscriptionEligible: false },
      { label: "10mg vial", sku: "HX-DSIP-10", mg: 10, subscriptionEligible: false },
      { label: "15mg vial", sku: "HX-DSIP-15", mg: 15, subscriptionEligible: false },
    ],
    relatedSlugs: ["semax", "selank"],
  },

  // ── Skin & Cosmetic ──────────────────────────────────────────────────────────
  {
    slug: "ahk-cu",
    name: "AHK-Cu",
    subtitle: "Copper tripeptide skin-repair complex",
    categorySlug: "skin-cosmetic",
    researchOverview:
      "AHK-Cu (Ala-His-Lys copper complex) is a tripeptide copper complex studied for collagen-synthesis " +
      "signalling, skin-repair pathway activity, and anti-ageing dermal research in pre-clinical models.",
    benefits: [
      "Studied for collagen-synthesis and skin-repair signalling research",
      "Investigated in anti-ageing and dermal-regeneration pathway models",
      "Copper tripeptide complex with characterised pre-clinical dermatology profile",
    ],
    reconstitution: RECON,
    status: "ACTIVE",
    variants: [
      { label: "50mg vial",  sku: "HX-AHK-50",  mg: 50,  subscriptionEligible: false },
      { label: "100mg vial", sku: "HX-AHK-100", mg: 100, subscriptionEligible: false },
    ],
    relatedSlugs: ["ghk-cu", "melanotan-1", "snap-8"],
  },
  {
    slug: "melanotan-1",
    name: "Melanotan-1",
    subtitle: "Alpha-MSH linear analogue",
    categorySlug: "skin-cosmetic",
    researchOverview:
      "Melanotan-1 (afamelanotide) is a linear alpha-MSH analogue studied for melanocortin receptor activation, " +
      "melanogenesis signalling, and photoprotective pathway research in dermatological pre-clinical studies.",
    benefits: [
      "Studied for melanocortin receptor activation and melanogenesis signalling",
      "Investigated in photoprotective pathway research models",
      "Linear alpha-MSH analogue with characterised dermatological research profile",
    ],
    reconstitution: RECON,
    status: "ACTIVE",
    variants: [
      { label: "10mg vial", sku: "HX-MT1-10", mg: 10, subscriptionEligible: false },
    ],
    relatedSlugs: ["melanotan-2", "ahk-cu", "snap-8"],
  },
  {
    slug: "melanotan-2",
    name: "Melanotan-2",
    subtitle: "Cyclic alpha-MSH analogue",
    categorySlug: "skin-cosmetic",
    researchOverview:
      "Melanotan-2 is a cyclic alpha-MSH analogue studied for melanocortin receptor agonism, melanogenesis, and " +
      "sexual-function signalling pathways in pre-clinical research.",
    benefits: [
      "Studied for cyclic melanocortin receptor agonism and melanogenesis signalling",
      "Investigated in pigmentation and sexual-function pathway research models",
      "Cyclic alpha-MSH analogue with broader melanocortin receptor profile vs MT-1",
    ],
    reconstitution: RECON,
    status: "ACTIVE",
    variants: [
      { label: "10mg vial", sku: "HX-MT2-10", mg: 10, subscriptionEligible: false },
    ],
    relatedSlugs: ["melanotan-1", "ahk-cu", "snap-8"],
  },
  {
    slug: "snap-8",
    name: "Snap-8",
    subtitle: "Acetyl octapeptide-3 wrinkle-research peptide",
    categorySlug: "skin-cosmetic",
    researchOverview:
      "Snap-8 (Acetyl Glutamyl Heptapeptide-1) is a synthetic octapeptide studied for SNARE-complex modulation " +
      "and neuromuscular-junction signalling in cosmetic dermatology pre-clinical research.",
    benefits: [
      "Studied for SNARE-complex modulation in neuromuscular signalling research",
      "Investigated in cosmetic dermatology and wrinkle-formation pathway research",
      "Acetyl octapeptide reference compound in aesthetic dermatology research",
    ],
    reconstitution: RECON,
    status: "ACTIVE",
    variants: [
      { label: "10mg vial", sku: "HX-SN8-10", mg: 10, subscriptionEligible: false },
    ],
    relatedSlugs: ["ahk-cu", "melanotan-1", "ghk-cu"],
  },

  // ── Research Supplies ────────────────────────────────────────────────────────
  {
    slug: "sterile-water",
    name: "Sterile Water",
    subtitle: "Research-grade sterile water (WFI specification)",
    categorySlug: "supplies",
    researchOverview:
      "Research-grade sterile water prepared to water-for-injection (WFI) specifications, suitable as a " +
      "primary research solvent for reconstituting lyophilised peptide samples in laboratory settings.",
    benefits: [
      "WFI-specification sterile water suitable for peptide reconstitution research",
      "Tested for particulate matter and endotoxin to research-grade standards",
      "Multi-use vial format convenient for laboratory reconstitution workflows",
    ],
    reconstitution:
      "Research-grade solvent — use as directed for reconstituting lyophilised research compounds. " +
      "Store at room temperature; discard unused solvent per laboratory protocols.",
    status: "ACTIVE",
    variants: [
      { label: "3ml vial",  sku: "HX-H2O-3",  mg: 3,  subscriptionEligible: false },
      { label: "10ml vial", sku: "HX-H2O-10", mg: 10, subscriptionEligible: false },
    ],
    relatedSlugs: ["acetic-acid"],
  },
  {
    slug: "acetic-acid",
    name: "Acetic Acid 0.6%",
    subtitle: "Dilute acetic acid research solvent",
    categorySlug: "supplies",
    researchOverview:
      "0.6% dilute acetic acid solution commonly used as a research solvent for reconstituting acid-soluble " +
      "lyophilised peptides in laboratory research workflows, including IGF-1 analogues and select growth-factor peptides.",
    benefits: [
      "Commonly used research solvent for acid-soluble lyophilised peptides",
      "Appropriate for reconstituting IGF-1 analogues and select growth-factor peptides",
      "Prepared to research-grade standards for laboratory use",
    ],
    reconstitution:
      "Research-grade solvent — use as directed for reconstituting acid-soluble lyophilised research compounds. " +
      "Store at room temperature; discard unused solvent per laboratory protocols.",
    status: "ACTIVE",
    variants: [
      { label: "3ml vial",  sku: "HX-HAC-3",  mg: 3,  subscriptionEligible: false },
      { label: "10ml vial", sku: "HX-HAC-10", mg: 10, subscriptionEligible: false },
    ],
    relatedSlugs: ["sterile-water", "bac-water"],
  },
  {
    slug: "bac-water",
    name: "BAC Water",
    subtitle: "Research-grade preserved reconstitution solvent",
    categorySlug: "supplies",
    researchOverview:
      "Research-grade preserved water solvent for reconstituting lyophilised peptide samples in laboratory " +
      "settings. The added preservative supports multi-use vial workflows across repeated draws during research.",
    benefits: [
      "Preserved multi-use solvent suitable for peptide reconstitution research",
      "Convenient for repeated laboratory draws from a single vial",
      "Pairs with lyophilised research compounds that require reconstitution",
    ],
    reconstitution:
      "Research-grade solvent — use as directed for reconstituting lyophilised research compounds. " +
      "Store at room temperature; discard unused solvent per laboratory protocols.",
    status: "ACTIVE",
    variants: [
      { label: "3ml vial",  sku: "HX-BAC-3",  mg: 3,  subscriptionEligible: false },
      { label: "10ml vial", sku: "HX-BAC-10", mg: 10, subscriptionEligible: false },
      { label: "30ml vial", sku: "HX-BAC-30", mg: 30, subscriptionEligible: false },
    ],
    relatedSlugs: ["sterile-water", "acetic-acid"],
  },
];

export const stacks: SeedStack[] = [
  {
    slug: "wolverine",
    name: "Wolverine Stack",
    tagline: "The two most-studied repair peptides, paired.",
    overview:
      "BPC-157 and TB-500 are among the most frequently co-investigated repair peptides in the preclinical " +
      "literature. This stack bundles both for research convenience.",
    protocol:
      "Handle both compounds in accordance with published in-vitro and pre-clinical research protocols. " +
      "Reconstitute each peptide separately in an appropriate sterile research solvent.",
    discountBps: 0,
    productSlugs: ["bpc-157", "tb-500"],
  },
  {
    slug: "glow",
    name: "Glow Stack",
    tagline: "Copper peptides and BPC-157 for dermal and tissue research.",
    overview:
      "GHK-Cu, BPC-157, and TB-500 combined for research programmes examining collagen-synthesis, " +
      "wound-healing, and tissue-repair signalling pathways.",
    protocol:
      "Handle all compounds in accordance with published in-vitro and pre-clinical research protocols. " +
      "Reconstitute each peptide separately in an appropriate sterile research solvent.",
    discountBps: 0,
    productSlugs: ["ghk-cu", "bpc-157", "tb-500"],
  },
  {
    slug: "klow",
    name: "Klow Stack",
    tagline: "Comprehensive tissue-repair and anti-inflammatory research bundle.",
    overview:
      "TB-500, BPC-157, GHK-Cu, and KPV — four peptides with overlapping tissue-repair and anti-inflammatory " +
      "research interests, bundled for pre-clinical laboratory use.",
    protocol:
      "Handle all compounds in accordance with published in-vitro and pre-clinical research protocols. " +
      "Reconstitute each peptide separately in appropriate research solvents.",
    discountBps: 0,
    productSlugs: ["tb-500", "bpc-157", "ghk-cu", "kpv"],
  },
  {
    slug: "performance",
    name: "Performance Stack",
    tagline: "GH-axis secretagogue pair for research.",
    overview:
      "CJC-1295 (no DAC) and Ipamorelin are the most widely co-studied GH-axis secretagogues in the preclinical " +
      "literature, bundled for research convenience.",
    protocol:
      "Handle both compounds in accordance with published in-vitro and pre-clinical research protocols. " +
      "Reconstitute each peptide separately in an appropriate sterile research solvent.",
    discountBps: 0,
    productSlugs: ["cjc-1295-no-dac", "ipamorelin"],
  },
  {
    slug: "glp1-advanced",
    name: "GLP-1 Advanced Stack",
    tagline: "Triple-agonist and amylin analogue for metabolic research.",
    overview:
      "Retatrutide and Cagrilintide paired for research programmes investigating multi-receptor " +
      "GLP-1/GIP/glucagon and amylin pathway interactions.",
    protocol:
      "Handle both compounds in accordance with published pre-clinical and clinical research protocols. " +
      "Reconstitute each peptide separately in an appropriate sterile research solvent.",
    discountBps: 0,
    productSlugs: ["retatrutide", "cagrilintide"],
  },
  {
    slug: "glp1-combo",
    name: "GLP-1 Combo Stack",
    tagline: "Amylin and GLP-1 receptor agonists for metabolic pathway research.",
    overview:
      "Cagrilintide and Semaglutide bundled for research programmes studying combined amylin-GLP-1 pathway " +
      "interactions and metabolic signalling mechanisms.",
    protocol:
      "Handle both compounds in accordance with published pre-clinical and clinical research protocols. " +
      "Reconstitute each peptide separately in an appropriate sterile research solvent.",
    discountBps: 0,
    productSlugs: ["cagrilintide", "semaglutide"],
  },
];
