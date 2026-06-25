import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  resolve: {
    alias: {
      // `server-only` is a Next.js compile-time guard with no runtime content.
      // Alias it to an empty stub so tests that import server-side modules don't fail.
      "server-only": path.resolve(__dirname, "test/__mocks__/server-only.ts"),
    },
  },
  test: {
    environment: "node",
    setupFiles: ["./test/setup.ts"],
    globals: true,
    passWithNoTests: true,
    include: [
      "test/**/*.{test,spec}.{ts,tsx}",
      "app/**/*.{test,spec}.{ts,tsx}",
      "lib/**/*.{test,spec}.{ts,tsx}",
      "components/**/*.{test,spec}.{ts,tsx}",
    ],
    exclude: ["node_modules", "n8n-mcp"],
  },
});
