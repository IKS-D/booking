import {
  configDefaults,
  defineConfig,
  coverageConfigDefaults,
} from "vitest/config";
import react from "@vitejs/plugin-react";
import { loadEnv } from "vite";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  test: {
    exclude: [...configDefaults.exclude, "**/playwright/**"],
    environment: "jsdom",
    alias: {
      "@/": new URL("./", import.meta.url).pathname,
    },
    env: loadEnv(mode, process.cwd(), ""),
    coverage: {
      extension: [".js", ".cjs", ".mjs", ".ts"],
      exclude: [
        ...coverageConfigDefaults.exclude,
        "**/{playwright,playwright-report,supabase,hooks,config,components,callback}/**",
        "**/{next,playwright,postcss,tailwind}.config.*",
        "middleware.ts",
        "**/lib/utils.ts",
        "**/actions/messaging/**",
      ],
    },
  },
}));
