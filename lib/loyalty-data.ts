import "server-only";
import { prisma } from "@/lib/db";
import { loyaltyProgress, type LoyaltyProgress } from "@/lib/loyalty";

// Lifetime peptide vials from a user's paid orders (research supplies excluded).
export async function qualifyingVialCount(userId: string): Promise<number> {
  const agg = await prisma.orderItem.aggregate({
    _sum: { quantity: true },
    where: {
      order: { userId, status: { in: ["PAID", "FULFILLED"] } },
      variant: { product: { category: { slug: { not: "supplies" } } } },
    },
  });
  return agg._sum.quantity ?? 0;
}

export async function getLoyaltyProgress(userId: string): Promise<LoyaltyProgress> {
  try {
    const [vials, user] = await Promise.all([
      qualifyingVialCount(userId),
      prisma.user.findUnique({ where: { id: userId }, select: { loyaltyRedeemed: true } }),
    ]);
    return loyaltyProgress(vials, user?.loyaltyRedeemed ?? 0);
  } catch {
    return loyaltyProgress(0, 0);
  }
}
