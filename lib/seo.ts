const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function organizationJsonLd() {
  return { "@context": "https://schema.org", "@type": "Organization",
    name: "Helyx", url: SITE };
}

export function productJsonLd(p: { name: string; description: string; priceCents: number; slug: string }) {
  return {
    "@context": "https://schema.org", "@type": "Product", name: p.name, description: p.description,
    offers: { "@type": "Offer", priceCurrency: "USD", price: (p.priceCents / 100).toFixed(2),
      url: `${SITE}/product/${p.slug}`, availability: "https://schema.org/InStock" },
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question", name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
}
