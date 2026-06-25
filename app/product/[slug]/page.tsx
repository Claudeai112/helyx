import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, getRelatedProducts } from "@/lib/catalog";
import { ConsultCTA } from "@/components/commerce/consult-cta";
import { VariantSelector } from "@/components/commerce/variant-selector";
import { ProductCard } from "@/components/commerce/product-card";
import { DisclaimerBar } from "@/components/ui/disclaimer-bar";
import { Badge } from "@/components/ui/badge";
import { toProductCardData } from "@/lib/product-view";
import { productJsonLd } from "@/lib/seo";

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
  const cheapestVariant = Math.min(...product.variants.map((v) => v.priceCents));
  return (
    <div className="mx-auto max-w-5xl px-6 py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd({
            name: product.name,
            description: product.subtitle,
            slug: product.slug,
            priceCents: cheapestVariant,
          })),
        }}
      />
      <div className="grid gap-12 lg:grid-cols-2">
        <div className="aspect-square rounded-3xl border border-border bg-card/40" />
        <div>
          <Badge>Rx · Prescription product</Badge>
          <h1 className="mt-4 text-4xl font-semibold text-foreground">{product.name}</h1>
          <p className="mt-2 text-lg text-muted-foreground">{product.subtitle}</p>
          <div className="mt-6">
            <VariantSelector variants={product.variants.map((v) => ({ id: v.id, label: v.label, priceCents: v.priceCents }))} />
          </div>
          <div className="mt-6"><ConsultCTA productName={product.name} status={product.status} /></div>
          <DisclaimerBar className="mt-6" />
        </div>
      </div>

      <section className="mt-16 max-w-2xl">
        <h2 className="text-2xl font-semibold text-foreground">Research overview</h2>
        <p className="mt-4 text-muted-foreground">{product.researchOverview}</p>
        <h3 className="mt-8 text-xl font-semibold text-foreground">Areas of study</h3>
        <ul className="mt-3 space-y-2 text-muted-foreground">
          {product.benefits.map((b) => <li key={b}>• {b}</li>)}
        </ul>
        <h3 className="mt-8 text-xl font-semibold text-foreground">Reconstitution &amp; dosing</h3>
        <p className="mt-3 text-muted-foreground">{product.reconstitution}</p>
      </section>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-foreground">Frequently paired</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => <ProductCard key={p.slug} product={toProductCardData(p)} />)}
          </div>
        </section>
      )}
    </div>
  );
}
