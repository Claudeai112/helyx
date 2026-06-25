import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about Helyx Peptides research supply products.",
};

const FAQS = [
  {
    q: "What are research peptides?",
    a: "Research peptides are synthetic amino acid chains used exclusively in laboratory and preclinical research settings. They are sold for research use only and are not for human or animal consumption.",
  },
  {
    q: "Who can purchase from Helyx Peptides?",
    a: "Our products are sold strictly to licensed researchers, academic institutions, and qualified laboratory professionals for research purposes only.",
  },
  {
    q: "What purity standards do your products meet?",
    a: "All Helyx Peptides products are manufactured to ≥98% purity and verified by third-party HPLC and mass spectrometry analysis.",
  },
  {
    q: "Do you ship internationally?",
    a: "We currently ship within the United States. International availability may vary — contact us for details.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-[900px] px-6 pb-24 pt-20">
      <h1 className="text-3xl font-semibold tracking-tight">Frequently Asked Questions</h1>
      <dl className="mt-10 divide-y divide-border">
        {FAQS.map((item) => (
          <div key={item.q} className="py-6">
            <dt className="font-medium">{item.q}</dt>
            <dd className="mt-2 text-muted-foreground">{item.a}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
