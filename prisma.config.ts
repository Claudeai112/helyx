import "dotenv/config";
import { defineConfig } from "prisma/config";

// Prisma 7: connection config lives here (not in schema.prisma), and .env is no
// longer auto-loaded, so we load it above. This `datasource.url` is used by the
// CLI (db push / migrate / seed). The runtime PrismaClient connects via a driver
// adapter instead (see lib/db.ts), per Prisma 7's client architecture.
//
// We read process.env directly (with an empty fallback) rather than Prisma's
// `env()` helper, which throws `PrismaConfigEnvError` when the var is absent.
// `prisma generate` (run in the Netlify `postinstall`) does NOT need a database
// connection, so it must not fail merely because DATABASE_URL isn't in the build
// environment. The CLI DB commands (push/migrate/seed) DO need it and will error
// clearly if it's empty.
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL ?? "",
  },
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
