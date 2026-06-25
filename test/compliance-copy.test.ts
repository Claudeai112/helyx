import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, it, expect } from "vitest";

// Durable sitewide compliance guard. In a licensed-prescription telehealth model,
// research-chemical disclaimer language is legally incoherent and forbidden. This
// scans ALL source under app/, components/, and lib/ — not just one page — so a
// forbidden phrase introduced into any component, section, or data module fails CI.
const FORBIDDEN = [
  "research purposes only",
  "research use only",
  "not for human consumption",
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

  it("contains none of the forbidden research-chemical phrases anywhere", () => {
    const offenders: string[] = [];
    for (const file of files) {
      const text = readFileSync(file, "utf8").toLowerCase();
      for (const phrase of FORBIDDEN) {
        if (text.includes(phrase)) offenders.push(`${file}: "${phrase}"`);
      }
    }
    expect(offenders).toEqual([]);
  });
});
