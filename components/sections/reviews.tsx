import { Reveal } from "../reveal";
import { SectionHeader, SectionShell } from "./_shared";

type Testimonial = {
  quote: string;
  name: string;
  location: string;
  initials: string;
  avatar: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "The consultation was smooth and the provider responded within a day. Shipping was fast and everything arrived exactly as described. Really impressed with the process.",
    name: "Marcus T.",
    location: "Austin, TX",
    initials: "MT",
    avatar: "linear-gradient(135deg,#28e0c8,#00a896)",
  },
  {
    quote:
      "I appreciated how straightforward the intake process was. The provider took time to explain the protocol options, and the ordering experience was seamless from start to finish.",
    name: "Danielle R.",
    location: "Scottsdale, AZ",
    initials: "DR",
    avatar: "linear-gradient(135deg,#00cec9,#55efc4)",
  },
  {
    quote:
      "First time going through an online consultation for anything like this. They made it clear, professional, and I never felt rushed. Order arrived quickly and well-packaged.",
    name: "Jordan M.",
    location: "Nashville, TN",
    initials: "JM",
    avatar: "linear-gradient(135deg,#a78bfa,#6c5ce7)",
  },
  {
    quote:
      "The support team was responsive every time I had a question about my order status. Communication was excellent throughout. Will be back for my next cycle.",
    name: "Priya S.",
    location: "Denver, CO",
    initials: "PS",
    avatar: "linear-gradient(135deg,#fdcb6e,#e17055)",
  },
  {
    quote:
      "Professional, legit, and transparent. Everything on the site matched what I received. The consultation felt thorough and the turnaround time was faster than expected.",
    name: "Alex W.",
    location: "Miami, FL",
    initials: "AW",
    avatar: "linear-gradient(135deg,#74b9ff,#0984e3)",
  },
  {
    quote:
      "Great experience from consultation to delivery. The provider's notes were clear and the packaging was discreet and professional. Exactly what I was looking for.",
    name: "Chris L.",
    location: "Portland, OR",
    initials: "CL",
    avatar: "linear-gradient(135deg,#fd79a8,#e84393)",
  },
];

export function ReviewsSection() {
  return (
    <SectionShell id="reviews" className="overflow-hidden">
      <Reveal>
        <SectionHeader
          tag="Customer Reviews"
          title="What Members"
          gradientTitle="Are Saying"
          description="Feedback from members about the consultation process, ordering experience, and support."
        />
      </Reveal>
      <div className="mx-auto grid max-w-[1200px] gap-6 md:grid-cols-2 lg:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <Reveal key={t.name} delay={(i % 3) * 80}>
            <figure
              className="flex h-full flex-col rounded-[20px] border border-white/10 bg-white/[0.02] p-8 transition-all duration-400 hover:-translate-y-1 hover:border-[rgba(40,224,200,0.2)]"
            >
              <div
                className="mb-4 text-[0.9rem]"
                style={{ color: "#fdcb6e", letterSpacing: "2px" }}
              >
                ★★★★★
              </div>
              <blockquote className="flex-1 text-[0.95rem] italic leading-relaxed text-[#a0a0c0]">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <div
                  className="flex size-[54px] items-center justify-center rounded-full font-display text-base font-bold text-white"
                  style={{ background: t.avatar }}
                >
                  {t.initials}
                </div>
                <div>
                  <div className="text-[0.9rem] font-semibold text-white">
                    {t.name}
                  </div>
                  <div className="text-[0.8rem] text-[#55557a]">{t.location}</div>
                </div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
