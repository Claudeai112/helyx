export const dynamic = "force-dynamic";

import { HeroSection } from "@/components/sections/hero";
import { ReviewsSection } from "@/components/sections/reviews";
import { FaqSection } from "@/components/sections/faq";
import { getAllStacks, getAllProducts } from "@/lib/catalog";
import { StackCard } from "@/components/commerce/stack-card";
import { ProductCard } from "@/components/commerce/product-card";
import { EmailCapture } from "@/components/marketing/email-capture";
import { DisclaimerBar } from "@/components/ui/disclaimer-bar";
import { SectionShell, SectionHeader } from "@/components/sections/_shared";
import { Reveal } from "@/components/reveal";
import { toProductCardData, stackComponentSumCents } from "@/lib/product-view";
import { stackPriceCents } from "@/lib/money";
import { organizationJsonLd, faqJsonLd } from "@/lib/seo";
import { HOME_FAQS } from "@/lib/faq-data";

export default async function Home() {
  // Degrade gracefully: if the catalog DB is unavailable, render the static
  // homepage without the dynamic stack/product sections rather than 500-ing.
  let stacks: Awaited<ReturnType<typeof getAllStacks>> = [];
  let products: Awaited<ReturnType<typeof getAllProducts>> = [];
  try {
    [stacks, products] = await Promise.all([getAllStacks(), getAllProducts()]);
  } catch {
    // Catalog database not reachable — sections below are gated on length.
  }
  const trendingProducts = products.slice(0, 6);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(HOME_FAQS)) }}
      />
      <HeroSection />

      {/* Featured Stacks */}
      {stacks.length > 0 && (
        <SectionShell id="stacks">
          <Reveal>
            <SectionHeader
              tag="Protocol Stacks"
              title="Bundled Protocols,"
              gradientTitle="Better Value"
              description="Pre-curated stacks combine complementary peptides into a single prescribed protocol. Bundles are priced at a discount versus ordering each component separately."
            />
          </Reveal>
          <div className="mx-auto grid max-w-[1200px] gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {stacks.map((stack, i) => {
              const componentSum = stackComponentSumCents(stack.items);
              const price = stackPriceCents(componentSum, stack.discountBps);
              return (
                <Reveal key={stack.slug} delay={(i % 3) * 80}>
                  <StackCard
                    stack={{
                      slug: stack.slug,
                      name: stack.name,
                      tagline: stack.tagline,
                      priceCents: price,
                      compareAtCents: componentSum,
                    }}
                  />
                </Reveal>
              );
            })}
          </div>
        </SectionShell>
      )}

      {/* Trending Products */}
      {trendingProducts.length > 0 && (
        <SectionShell id="trending">
          <Reveal>
            <SectionHeader
              tag="Popular Peptides"
              title="Trending"
              gradientTitle="This Month"
              description="Provider-reviewed peptides available by prescription following an approved consultation."
            />
          </Reveal>
          <div className="mx-auto grid max-w-[1200px] gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {trendingProducts.map((product, i) => (
              <Reveal key={product.slug} delay={(i % 3) * 80}>
                <ProductCard product={toProductCardData(product)} />
              </Reveal>
            ))}
          </div>
        </SectionShell>
      )}

      {/* Education / Research Section */}
      <SectionShell id="education" className="overflow-hidden">
        <Reveal>
          <SectionHeader
            tag="Research & Science"
            title="Built on Published"
            gradientTitle="Science"
            description="Helyx protocols are informed by peer-reviewed literature and administered through licensed prescribers."
          />
        </Reveal>
        <div className="mx-auto grid max-w-[1200px] gap-8 md:grid-cols-3">
          {[
            {
              icon: "⚗",
              title: "Peer-Reviewed Foundations",
              body: "Each protocol area is informed by published clinical and pre-clinical literature. Our provider network reviews current evidence when evaluating member eligibility.",
            },
            {
              icon: "🩺",
              title: "Licensed Provider Review",
              body: "Every consultation is evaluated by a licensed U.S. healthcare provider. No product ships without prescriber approval and an active prescription on file.",
            },
            {
              icon: "🔬",
              title: "Pharmacy-Grade Fulfillment",
              body: "Orders are filled by licensed U.S. compounding pharmacies. Products meet applicable quality and labeling standards enforced by state pharmacy boards.",
            },
          ].map((item) => (
            <Reveal key={item.title}>
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 hover:border-[rgba(40,224,200,0.2)] transition-colors">
                <div className="mb-4 text-3xl">{item.icon}</div>
                <h3 className="mb-3 font-display text-lg font-semibold text-white">
                  {item.title}
                </h3>
                <p className="text-[0.9rem] leading-relaxed text-[#7777aa]">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </SectionShell>

      {/* Email Capture */}
      <SectionShell id="newsletter">
        <Reveal>
          <div className="mx-auto max-w-[640px] rounded-2xl border border-[rgba(40,224,200,0.15)] bg-[rgba(40,224,200,0.04)] px-8 py-10 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[1.5px] text-[#28e0c8]">
              Early access
            </p>
            <h2 className="mb-3 font-display text-[clamp(1.5rem,3vw,2rem)] font-bold text-white">
              Be the first to know
            </h2>
            <p className="mb-6 text-[0.95rem] text-[#7777aa]">
              Get notified when new protocols launch and receive provider insights directly to your inbox.
            </p>
            <div className="flex justify-center">
              <EmailCapture source="homepage" />
            </div>
          </div>
        </Reveal>
      </SectionShell>

      <ReviewsSection />
      <FaqSection />

      {/* Closing Disclaimer */}
      <SectionShell id="disclaimer" className="!py-8">
        <div className="mx-auto max-w-[800px] text-center">
          <DisclaimerBar className="leading-relaxed" />
        </div>
      </SectionShell>
    </>
  );
}
