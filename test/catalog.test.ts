import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));

const { findMany, findUnique } = vi.hoisted(() => ({
  findMany: vi.fn(),
  findUnique: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  prisma: {
    product: { findMany, findUnique },
    category: { findMany, findUnique },
    stack: { findMany, findUnique },
  },
}));

import {
  getAllProducts,
  getProductBySlug,
  getProductsByCategory,
  getAllCategories,
  getStackBySlug,
  getAllStacks,
  getRelatedProducts,
} from "@/lib/catalog";

beforeEach(() => { findMany.mockReset(); findUnique.mockReset(); });

describe("catalog queries", () => {
  it("getAllProducts returns products with variants", async () => {
    findMany.mockResolvedValue([{ slug: "tirzepatide", variants: [] }]);
    const res = await getAllProducts();
    expect(res[0].slug).toBe("tirzepatide");
    expect(findMany).toHaveBeenCalledWith(expect.objectContaining({ include: expect.any(Object) }));
  });
  it("getProductBySlug queries by unique slug", async () => {
    findUnique.mockResolvedValue({ slug: "bpc-157" });
    const res = await getProductBySlug("bpc-157");
    expect(res?.slug).toBe("bpc-157");
    expect(findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { slug: "bpc-157" } }));
  });

  it("getProductsByCategory filters by nested category slug and includes variants", async () => {
    findMany.mockResolvedValue([{ slug: "semaglutide", variants: [] }]);
    const res = await getProductsByCategory("weight-loss");
    expect(res[0].slug).toBe("semaglutide");
    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { category: { slug: "weight-loss" } },
        include: expect.any(Object),
      }),
    );
  });

  it("getAllCategories orders by order asc", async () => {
    findMany.mockResolvedValue([{ id: 1, name: "Weight Loss", order: 1 }]);
    const res = await getAllCategories();
    expect(res[0].name).toBe("Weight Loss");
    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { order: "asc" } }),
    );
  });

  it("getStackBySlug queries by slug with nested items→product→variants include", async () => {
    findUnique.mockResolvedValue({ slug: "starter-stack", items: [] });
    const res = await getStackBySlug("starter-stack");
    expect(res?.slug).toBe("starter-stack");
    expect(findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { slug: "starter-stack" },
        include: expect.objectContaining({
          items: expect.objectContaining({
            include: expect.objectContaining({
              product: expect.objectContaining({
                include: expect.objectContaining({ variants: true }),
              }),
            }),
          }),
        }),
      }),
    );
  });

  it("getAllStacks includes items with nested product", async () => {
    findMany.mockResolvedValue([{ id: 1, items: [] }]);
    const res = await getAllStacks();
    expect(res[0].id).toBe(1);
    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        include: expect.objectContaining({
          items: expect.objectContaining({
            include: expect.objectContaining({ product: true }),
          }),
        }),
      }),
    );
  });

  it("getRelatedProducts filters by slug in list", async () => {
    const slugs = ["bpc-157", "tb-500"];
    findMany.mockResolvedValue([{ slug: "bpc-157" }, { slug: "tb-500" }]);
    const res = await getRelatedProducts(slugs);
    expect(res).toHaveLength(2);
    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { slug: { in: slugs } } }),
    );
  });
});
