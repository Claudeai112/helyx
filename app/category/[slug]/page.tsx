import { redirect } from "next/navigation";

// Category pages are consolidated into the unified storefront at / (sidebar
// filters). Old slugs are aliased so legacy links resolve instead of 404ing.
const ALIAS: Record<string, string> = {
  healing: "healing-recovery",
  "fat-loss": "metabolic-fat-loss",
  recovery: "healing-recovery",
  "muscle-growth": "muscle-gh",
};
const VALID = new Set([
  "glp-1", "metabolic-fat-loss", "healing-recovery", "muscle-gh", "longevity",
  "cognitive", "hormonal-reproductive", "sleep-recovery", "skin-cosmetic", "supplies",
]);

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const target = ALIAS[slug] ?? slug;
  redirect(VALID.has(target) ? `/?purpose=${target}` : "/");
}
