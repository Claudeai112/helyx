import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, it, expect } from "vitest";

// Durable sitewide compliance guard. Under the research-supply model,
// human-use / therapeutic / self-administration claims are legally incoherent
// and forbidden. This scans ALL source under app/, components/, and lib/ — not
// just one page — so a forbidden phrase introduced into any component, section,
// or data module fails CI.
const FORBIDDEN_REGEX = [/\bcure\b/i, /\btreats\b/i];
const FORBIDDEN_SUBSTR = [
  "for human use", "intended for human", "inject yourself", "how to inject",
  "your dose", "dose yourself", "weight loss results",
  "consult your doctor", "prescription required",
  "bacteriostatic",
  // Dosing / cycle-calculator stems — the declined self-administration tooling.
  "per injection", "insulin unit", "injections required", "injection schedule",
  "reorder date",
  // Prescription / telehealth framing — dormant under the research-supply model.
  // PHRASE-level on purpose: a bare "provider" collides with React Context
  // Provider / CartProvider, so we forbid only unambiguous prescription phrases.
  "licensed provider", "healthcare provider", "your provider",
  "provider approval", "provider evaluation", "provider consultation",
  "issues a prescription", "prescribed by", "during your consultation",
  "compounding pharmacy", "licensed pharmacy", "eligibility is determined",
];

const ROOTS = ["app", "components", "lib"];
const EXTS = [".ts", ".tsx"];

function sourceFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      out.push(...sourceFiles(full));
    } else if (EXTS.some((e) => full.endsWith(e))) {
      out.push(full);
    }
  }
  return out;
}

describe("sitewide compliance copy", () => {
  const files = ROOTS.flatMap((r) => sourceFiles(r));

  it("scans a non-trivial number of source files", () => {
    expect(files.length).toBeGreaterThan(20);
  });

  it("contains none of the forbidden human-use phrases anywhere", () => {
    const offenders: string[] = [];
    for (const file of files) {
      const text = readFileSync(file, "utf8").toLowerCase();
      // Check regex patterns (word-boundary matched)
      for (const regex of FORBIDDEN_REGEX) {
        const match = text.match(regex);
        if (match) offenders.push(`${file}: regex /${regex.source}/i matched "${match[0]}"`);
      }
      // Check substrings (exact phrase matched)
      for (const phrase of FORBIDDEN_SUBSTR) {
        if (text.includes(phrase)) offenders.push(`${file}: "${phrase}"`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it("ships the research-use disclaimer", () => {
    const bar = readFileSync("components/ui/disclaimer-bar.tsx", "utf8").toLowerCase();
    expect(bar).toContain("for research use only");
    expect(bar).toContain("not for human consumption");
  });
});
