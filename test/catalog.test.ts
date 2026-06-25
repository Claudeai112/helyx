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

import { getAllProducts, getProductBySlug } from "@/lib/catalog";

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
});
