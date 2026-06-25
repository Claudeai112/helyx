import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
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
