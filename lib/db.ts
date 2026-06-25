// `server-only` ensures the Prisma client (direct DB access) can never be
// bundled into client-side code.
import "server-only";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    // Prisma 7 connects through a driver adapter (here: node-postgres / pg).
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
    globalForPrisma.prisma = new PrismaClient({ adapter });
  }
  return globalForPrisma.prisma;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient();
    const value = (client as unknown as Record<string | symbol, unknown>)[prop];
    // Bind methods (e.g. $transaction, $queryRaw, $connect) to the real client so
    // `this` resolves to the PrismaClient, not the Proxy, when they are invoked.
    return typeof value === "function" ? (value as (...args: unknown[]) => unknown).bind(client) : value;
  },
});
