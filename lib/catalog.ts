import "server-only";
import { prisma } from "@/lib/db";

const productInclude = { variants: true, category: true } as const;

export function getAllProducts() {
  return prisma.product.findMany({ include: productInclude, orderBy: { name: "asc" } });
}

export function getProductBySlug(slug: string) {
  return prisma.product.findUnique({ where: { slug }, include: productInclude });
}

export function getProductsByCategory(slug: string) {
  return prisma.product.findMany({
    where: { category: { slug } }, include: productInclude, orderBy: { name: "asc" },
  });
}

export function getAllCategories() {
  return prisma.category.findMany({ orderBy: { order: "asc" } });
}

export function getStackBySlug(slug: string) {
  return prisma.stack.findUnique({
    where: { slug }, include: { items: { include: { product: { include: { variants: true } } } } },
  });
}

export function getAllStacks() {
  return prisma.stack.findMany({ include: { items: { include: { product: true } } } });
}

export function getRelatedProducts(slugs: string[]) {
  return prisma.product.findMany({ where: { slug: { in: slugs } }, include: productInclude });
}
