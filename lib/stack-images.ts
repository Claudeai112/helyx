// Stack bundle images: overlapping Helyx vials (one per component peptide).
// Files live in public/images/stacks/<slug>.png (transparent background).
const SLUGS = new Set(["wolverine", "glow", "klow", "performance", "glp1-advanced", "glp1-combo"]);

export function stackImage(slug: string): string | null {
  return SLUGS.has(slug) ? `/images/stacks/${slug}.png` : null;
}
