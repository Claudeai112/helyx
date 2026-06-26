// Research-framed "studied outcomes" descriptions for each stack — what the
// combination is investigated for in pre-clinical / in-vitro research. No human
// therapeutic claims or promised results.
const OUTCOMES: Record<string, string> = {
  wolverine:
    "Studied in pre-clinical tissue-repair research. BPC-157 is investigated for angiogenesis and " +
    "tendon, ligament, and gut-lining repair pathways, while TB-500 (a thymosin beta-4 fragment) is " +
    "studied for actin regulation, cell migration, and wound-healing models. A common reference " +
    "pairing in recovery and connective-tissue research.",
  glow:
    "A skin- and repair-focused research combination. GHK-Cu is studied for collagen synthesis and " +
    "extracellular-matrix remodelling in dermal research models, paired with BPC-157 and TB-500, which " +
    "are investigated for tissue-repair and angiogenesis pathways. Studied together in regenerative and " +
    "skin-research contexts.",
  klow:
    "A four-compound recovery and inflammation-research stack. It combines the BPC-157 / TB-500 repair " +
    "pair and GHK-Cu's matrix-remodelling research with KPV, a tripeptide studied for anti-inflammatory " +
    "and gut-research pathways. Investigated across tissue-repair and inflammatory-modulation models.",
  performance:
    "A growth-hormone-secretagogue research pair. CJC-1295 (a GHRH analogue) and Ipamorelin (a selective " +
    "ghrelin-receptor agonist) are studied together for pulsatile GH release and downstream IGF-1-axis " +
    "signalling in pre-clinical body-composition and GH-research models.",
  "glp1-advanced":
    "An advanced metabolic-research combination. Retatrutide is studied for multi-receptor " +
    "(GIP / GLP-1 / glucagon) metabolic signalling, paired with Cagrilintide, an amylin analogue studied " +
    "for appetite- and energy-balance pathways. Investigated together in metabolic and glycemic-regulation " +
    "research models.",
  "glp1-combo":
    "A dual amylin / GLP-1 research combination. Cagrilintide (amylin pathway) and Semaglutide (a GLP-1 " +
    "receptor agonist) are studied together for complementary appetite- and glycemic-signalling pathways " +
    "in pre-clinical metabolic research.",
};

export function stackOutcomes(slug: string): string | null {
  return OUTCOMES[slug] ?? null;
}
