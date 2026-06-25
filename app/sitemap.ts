import type { MetadataRoute } from "next";
import { getAllProducts, getAllCategories, getAllStacks } from "@/lib/catalog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const staticPaths = [
    "", "/shop", "/stacks", "/consultation", "/waitlist",
    "/legal/terms", "/legal/privacy", "/legal/refund", "/legal/shipping", "/legal/medical-disclaimer",
  ];
  let dynamicPaths: string[] = [];
  try {
    const [products, categories, stacks] = await Promise.all([
      getAllProducts(), getAllCategories(), getAllStacks(),
    ]);
    dynamicPaths = [
      ...categories.map((c) => `/category/${c.slug}`),
      ...products.map((p) => `/product/${p.slug}`),
      ...stacks.map((s) => `/stacks/${s.slug}`),
    ];
  } catch {
    // DB unavailable (e.g. at build with no DATABASE_URL) — ship static routes only
  }
  return [...staticPaths, ...dynamicPaths].map((u) => ({ url: `${site}${u}`, lastModified: new Date() }));
}
