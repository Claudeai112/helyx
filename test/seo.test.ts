import { describe, it, expect } from "vitest";
import { organizationJsonLd, productJsonLd, faqJsonLd } from "@/lib/seo";

describe("seo json-ld", () => {
  it("builds Organization schema", () => {
    const o = organizationJsonLd();
    expect(o["@type"]).toBe("Organization");
    expect(o.name).toBe("Pure Peps");
  });
  it("builds Product schema with offers", () => {
    const p = productJsonLd({ name: "BPC-157", description: "x", priceCents: 5900, slug: "bpc-157" });
    expect(p["@type"]).toBe("Product");
    expect(p.offers.price).toBe("59.00");
  });
  it("builds FAQPage schema", () => {
    const f = faqJsonLd([{ q: "Is a consult required?", a: "Yes." }]);
    expect(f["@type"]).toBe("FAQPage");
    expect(f.mainEntity[0]["@type"]).toBe("Question");
  });
});
