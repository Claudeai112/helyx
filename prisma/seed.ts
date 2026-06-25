import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { categories, products, stacks } from "../lib/seed-data";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, description: c.description, order: c.order, heroCopy: c.heroCopy },
      create: { slug: c.slug, name: c.name, description: c.description, order: c.order, heroCopy: c.heroCopy },
    });
  }
  for (const p of products) {
    const category = await prisma.category.findUniqueOrThrow({ where: { slug: p.categorySlug } });
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: { name: p.name, subtitle: p.subtitle, categoryId: category.id,
        researchOverview: p.researchOverview, benefits: p.benefits, reconstitution: p.reconstitution,
        status: p.status, relatedSlugs: p.relatedSlugs },
      create: { slug: p.slug, name: p.name, subtitle: p.subtitle, categoryId: category.id,
        researchOverview: p.researchOverview, benefits: p.benefits, reconstitution: p.reconstitution,
        status: p.status, isRx: true, relatedSlugs: p.relatedSlugs },
    });
    for (const v of p.variants) {
      await prisma.productVariant.upsert({
        where: { sku: v.sku },
        update: { label: v.label, priceCents: v.priceCents, compareAtCents: v.compareAtCents,
          subscriptionEligible: v.subscriptionEligible, productId: product.id },
        create: { label: v.label, sku: v.sku, priceCents: v.priceCents, compareAtCents: v.compareAtCents,
          subscriptionEligible: v.subscriptionEligible, productId: product.id },
      });
    }
  }
  for (const s of stacks) {
    const stack = await prisma.stack.upsert({
      where: { slug: s.slug },
      update: { name: s.name, tagline: s.tagline, overview: s.overview, protocol: s.protocol, discountBps: s.discountBps },
      create: { slug: s.slug, name: s.name, tagline: s.tagline, overview: s.overview, protocol: s.protocol, discountBps: s.discountBps },
    });
    await prisma.stackItem.deleteMany({ where: { stackId: stack.id } });
    for (const slug of s.productSlugs) {
      const product = await prisma.product.findUniqueOrThrow({ where: { slug } });
      await prisma.stackItem.create({ data: { stackId: stack.id, productId: product.id } });
    }
  }
}

main().then(() => prisma.$disconnect()).catch(async (e) => {
  console.error(e); await prisma.$disconnect(); process.exit(1);
});
