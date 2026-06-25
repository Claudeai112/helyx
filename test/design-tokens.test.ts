import { readFileSync } from "node:fs";
import { describe, it, expect } from "vitest";
const css = readFileSync("app/globals.css", "utf8");
describe("design tokens", () => {
  it("uses the light clinical palette", () => {
    expect(css).toMatch(/--background:\s*#FFFFFF/i);
    expect(css).toMatch(/--foreground:\s*#1A2230/i);
    expect(css).toMatch(/--primary:\s*#1E5CA8/i);
    expect(css).toMatch(/--border:\s*#E6E9EE/i);
  });
  it("drops the old glowy teal/dark base", () => {
    expect(css).not.toMatch(/#28e0c8/i);
    expect(css).not.toMatch(/--background:\s*#050510/i);
  });
});
