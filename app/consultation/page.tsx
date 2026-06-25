import type { Metadata } from "next";
import { EmailCapture } from "@/components/marketing/email-capture";
import { DisclaimerBar } from "@/components/ui/disclaimer-bar";

export const metadata: Metadata = {
  title: "Start a Consultation",
  description:
    "Begin your provider consultation to determine eligibility for Helyx protocols.",
};

const STEPS = [
  {
    step: "01",
    title: "Complete your intake",
    body: "Answer a short set of health questions. This typically takes 5–10 minutes and is reviewed by a licensed provider.",
  },
  {
    step: "02",
    title: "Provider review",
    body: "A licensed U.S. healthcare provider reviews your intake, usually within 48 hours. They may send follow-up questions.",
  },
  {
    step: "03",
    title: "Prescription & fulfillment",
    body: "If approved, the provider issues a prescription. Your order is then fulfilled through a licensed pharmacy and shipped discreetly.",
  },
];

export default function ConsultationPage() {
  return (
    <main className="relative z-[2] mx-auto min-h-screen max-w-[900px] px-6 pb-24 pt-36">
      <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[rgba(40,224,200,0.25)] bg-[rgba(40,224,200,0.08)] px-4 py-1.5 text-xs font-medium uppercase tracking-[2px] text-[#28e0c8]">
        Research supply
      </div>
      <h1 className="mt-4 font-display text-[clamp(2rem,4vw,3rem)] font-bold leading-tight text-white">
        Start Your Consultation
      </h1>
      <p className="mt-4 max-w-[640px] text-[1.05rem] text-[#c8c8dc]">
        All Helyx protocols require a provider consultation. A licensed healthcare
        professional reviews your intake and determines whether a prescription is appropriate
        for you. The full intake form is coming soon — join the list below to be notified
        when your spot opens.
      </p>

      {/* Process steps */}
      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {STEPS.map((s) => (
          <div
            key={s.step}
            className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-[rgba(40,224,200,0.2)] transition-colors"
          >
            <div className="mb-3 font-display text-2xl font-bold text-[#28e0c8]">{s.step}</div>
            <h3 className="mb-2 font-semibold text-white">{s.title}</h3>
            <p className="text-sm leading-relaxed text-[#7777aa]">{s.body}</p>
          </div>
        ))}
      </div>

      {/* Email capture */}
      <div className="mt-12 rounded-2xl border border-[rgba(40,224,200,0.15)] bg-[rgba(40,224,200,0.04)] px-8 py-10">
        <p className="mb-1 text-sm font-semibold uppercase tracking-[1.5px] text-[#28e0c8]">
          Get early access
        </p>
        <p className="mb-5 text-[0.95rem] text-[#7777aa]">
          Enter your email and we will notify you as soon as consultation intake opens for your area.
        </p>
        <EmailCapture source="consultation" />
      </div>

      <div className="mt-10 border-t border-white/5 pt-6">
        <DisclaimerBar />
      </div>
    </main>
  );
}
