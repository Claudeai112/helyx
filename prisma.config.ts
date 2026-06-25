import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// Prisma 7: connection config lives here (not in schema.prisma), and .env is no
// longer auto-loaded, so we load it above. This `datasource.url` is used by the
// CLI (db push / migrate / seed). The runtime PrismaClient connects via a driver
// adapter instead (see lib/db.ts), per Prisma 7's client architecture.
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
