import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, getRelatedProducts } from "@/lib/catalog";
import { AddToCart } from "@/components/commerce/add-to-cart";
import { ProductCard } from "@/components/commerce/product-card";
import { DisclaimerBar } from "@/components/ui/disclaimer-bar";
import { Badge } from "@/components/ui/badge";
import { toProductCardData } from "@/lib/product-view";
import { productImage } from "@/lib/product-images";
import { isInStock, MADE_TO_ORDER_DELIVERY } from "@/lib/stock";
import { productJsonLd } from "@/lib/seo";
import { ReconstitutionReference } from "@/components/commerce/reconstitution-reference";
import { ProviderPathway } from "@/components/commerce/provider-pathway";
import { AddBacWater } from "@/components/commerce/add-bac-water";
import { CoaSection } from "@/components/commerce/coa-section";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return { title: product.seoTitle ?? product.name, description: product.seoDescription ?? product.subtitle };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const related = await getRelatedProducts(product.relatedSlugs);
  // Reconstitution add-on: offer BAC water on peptide pages (not on supplies themselves).
  const bac = product.category?.slug !== "supplies" ? await getProductBySlug("bac-water") : null;
  const bacVariants = bac?.variants.map((v) => ({ id: v.id, label: v.label, priceCents: v.priceCents })) ?? [];
  const cheapestCents = product.variants.length
    ? Math.min(...product.variants.map((v) => v.priceCents))
    : 0;
  const firstVariantLabel = product.variants[0]?.label ?? "";
  const mgOptions = [...new Set(
    product.variants.map((v) => parseFloat(v.label)).filter((n) => Number.isFinite(n) && n > 0),
  )].sort((a, b) => a - b);
  const showReconstitution =
    mgOptions.length > 0 &&
    firstVariantLabel.includes("mg") &&
    product.category?.slug !== "supplies";
  return (
    <div className="mx-auto max-w-5xl px-6 py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd({
            name: product.name,
            description: product.subtitle,
            slug: product.slug,
            priceCents: cheapestCents,
          })),
        }}
      />
      <div className="grid gap-12 lg:grid-cols-2">
        <div className="flex aspect-square items-center justify-center overflow-hidden rounded-3xl border border-border bg-card/40">
          {productImage(product.slug) ? (
            // eslint-disable-next-line @next/next/no-img-element -- static local image; next/image not configured
            <img
              src={productImage(product.slug) as string}
              alt={`${product.name} research vial`}
              className="h-full w-full object-contain p-6"
            />
          ) : null}
        </div>
        <div>
          <Badge>Research compound</Badge>
          <h1 className="mt-4 text-4xl font-semibold text-foreground">{product.name}</h1>
          <p className="mt-2 text-lg text-muted-foreground">{product.subtitle}</p>
          {isInStock(product.slug, product.category?.slug) ? (
            <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600">
              ● In stock — ready to ship
            </p>
          ) : (
            <p className="mt-3 text-sm font-medium text-muted-foreground">
              Made to order — ships in {MADE_TO_ORDER_DELIVERY}
            </p>
          )}
          <div className="mt-6">
            <AddToCart
              variants={product.variants.map((v) => ({ id: v.id, label: v.label, priceCents: v.priceCents }))}
              slug={product.slug}
              name={product.name}
            />
          </div>
          {bacVariants.length > 0 ? <AddBacWater variants={bacVariants} /> : null}
          <DisclaimerBar className="mt-6" />
          <div className="mt-6">
            <ProviderPathway />
          </div>
        </div>
      </div>

      <section className="mt-16 max-w-2xl">
        <h2 className="text-2xl font-semibold text-foreground">Research overview</h2>
        <p className="mt-4 text-muted-foreground">{product.researchOverview}</p>
        <h3 className="mt-8 text-xl font-semibold text-foreground">Areas of study</h3>
        <ul className="mt-3 space-y-2 text-muted-foreground">
          {product.benefits.map((b) => <li key={b}>• {b}</li>)}
        </ul>
        <h3 className="mt-8 text-xl font-semibold text-foreground">Reconstitution</h3>
        <p className="mt-3 text-muted-foreground">{product.reconstitution}</p>
        {showReconstitution && (
          <div className="mt-6">
            <ReconstitutionReference mgOptions={mgOptions} />
          </div>
        )}
      </section>

      <div className="max-w-2xl">
        <CoaSection />
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-foreground">Frequently paired</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => <ProductCard key={p.slug} product={toProductCardData(p, p.category?.slug)} />)}
          </div>
        </section>
      )}
    </div>
  );
}
