import type { Metadata } from "next";
import { EmailCapture } from "@/components/marketing/email-capture";
import { DisclaimerBar } from "@/components/ui/disclaimer-bar";

export const metadata: Metadata = {
  title: "Join the Waitlist",
  description:
    "Join the Helyx waitlist for early access to new protocols and the Ambassador Program.",
};

export default function WaitlistPage() {
  return (
    <main className="relative z-[2] mx-auto min-h-screen max-w-[760px] px-6 pb-24 pt-36">
      <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[rgba(40,224,200,0.25)] bg-[rgba(40,224,200,0.08)] px-4 py-1.5 text-xs font-medium uppercase tracking-[2px] text-[#28e0c8]">
        Limited access
      </div>
      <h1 className="mt-4 font-display text-[clamp(2rem,4vw,3rem)] font-bold leading-tight text-white">
        Join the Waitlist
      </h1>
      <p className="mt-4 max-w-[640px] text-[1.05rem] text-[#c8c8dc]">
        Helyx is currently in private beta. Spots open on a rolling basis as we
        expand provider capacity. Sign up below and we will notify you when access opens
        in your area.
      </p>

      {/* Ambassador callout */}
      <div className="mt-10 rounded-2xl border border-[rgba(40,224,200,0.15)] bg-[rgba(40,224,200,0.04)] p-6">
        <p className="mb-2 font-semibold text-white">Ambassador Program</p>
        <p className="text-sm leading-relaxed text-[#7777aa]">
          Members with an approved consultation can refer others and earn rewards through the
          Helyx Ambassador Program. Ambassador spots are invite-only during the beta period.
          Signing up here puts you at the front of the list when invites go out.
        </p>
      </div>

      {/* What to expect */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {[
          { title: "Early protocol access", body: "Be the first to access new peptide protocols as they launch." },
          { title: "Provider priority queue", body: "Waitlist members receive priority placement in the consultation queue." },
          { title: "Member pricing", body: "Founding members receive locked-in pricing on all protocols." },
          { title: "Ambassador invites", body: "Waitlist members are first considered for Ambassador Program spots." },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-white/10 bg-white/[0.02] p-5 hover:border-[rgba(40,224,200,0.2)] transition-colors"
          >
            <p className="mb-1 font-semibold text-white">{item.title}</p>
            <p className="text-sm text-[#7777aa]">{item.body}</p>
          </div>
        ))}
      </div>

      {/* Email capture */}
      <div className="mt-10 rounded-2xl border border-[rgba(40,224,200,0.15)] bg-[rgba(40,224,200,0.04)] px-8 py-10">
        <p className="mb-1 text-sm font-semibold uppercase tracking-[1.5px] text-[#28e0c8]">
          Reserve your place
        </p>
        <p className="mb-5 text-[0.95rem] text-[#7777aa]">
          We respect your inbox. Expect one email when your spot opens, nothing else.
        </p>
        <EmailCapture source="waitlist" />
      </div>

      <div className="mt-10 border-t border-white/5 pt-6">
        <DisclaimerBar />
      </div>
    </main>
  );
}
