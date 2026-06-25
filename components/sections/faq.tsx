"use client";

import { useState } from "react";
import { Reveal } from "../reveal";
import { GradientText, SectionShell } from "./_shared";

const FAQS = [
  {
    q: "Do I need a prescription to order?",
    a: "Yes. All products on Heman Peptide are prescription items. Before any order ships, you complete an online consultation with a licensed healthcare provider. The provider reviews your intake information and determines eligibility. If approved, a prescription is issued and your order is fulfilled.",
  },
  {
    q: "How does the online consultation work?",
    a: "After you select your protocol and reach checkout, you will be prompted to complete a brief medical intake form. A licensed provider on our partner network reviews your information, typically within 48 hours. You may receive follow-up questions before a decision is made. The consultation is fully asynchronous — no video call required, though one may be requested at the provider's discretion.",
  },
  {
    q: "What are the GLP-1 protocol options?",
    a: "Our GLP-1 collection includes several provider-reviewed protocols. Browse the GLP-1 category to see current offerings, dosing formats, and supporting information. Your provider will select the specific protocol and dosing that fits your clinical profile based on your consultation.",
  },
  {
    q: "What if my consultation is not approved?",
    a: "Eligibility is determined entirely by the licensed provider, not by Heman Peptide. If a provider determines that a protocol is not appropriate for you at this time, you will not be charged and the provider may offer alternative guidance or suggest a follow-up consultation.",
  },
  {
    q: "How are products sourced and fulfilled?",
    a: "All products are fulfilled through licensed U.S. compounding or specialty pharmacies that operate under state board of pharmacy and applicable federal oversight. Products are shipped discreetly with appropriate cold-chain packaging where required.",
  },
  {
    q: "What is the Ambassador Program?",
    a: "The Ambassador Program allows members with an approved consultation to refer others and earn rewards. Membership is invite-based during the current beta period. Join the waitlist at /waitlist?program=ambassador to be notified when spots open.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden border-b border-white/5">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 py-6 text-left font-sans text-[1.05rem] font-medium text-[#e0e0f0] transition-colors hover:text-[#28e0c8]"
      >
        <span>{q}</span>
        <span
          className={`flex size-7 flex-shrink-0 items-center justify-center rounded-full text-[0.9rem] text-[#28e0c8] transition-all duration-300 ${
            open
              ? "rotate-45 bg-[rgba(40,224,200,0.25)]"
              : "bg-[rgba(40,224,200,0.1)]"
          }`}
        >
          +
        </span>
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p className="pb-6 text-[0.95rem] leading-[1.7] text-[#7777aa]">
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}

export function FaqSection() {
  return (
    <SectionShell id="faq">
      <Reveal>
        <div className="mx-auto mb-16 flex max-w-[900px] flex-col items-center text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[rgba(40,224,200,0.2)] bg-[rgba(40,224,200,0.08)] px-4 py-1.5 text-[0.75rem] font-medium uppercase tracking-[2px] text-[#28e0c8]">
            FAQ
          </div>
          <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold leading-tight text-white">
            <GradientText>Common Questions</GradientText>
          </h2>
        </div>
      </Reveal>
      <div className="mx-auto max-w-[750px]">
        {FAQS.map((f, i) => (
          <Reveal key={i} delay={i * 60}>
            <FaqItem q={f.q} a={f.a} />
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
