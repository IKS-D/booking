import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { loadEnv } from "vite";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  test: {
    environment: "jsdom",
    alias: {
      "@/": new URL("./", import.meta.url).pathname,
    },
    env: loadEnv(mode, process.cwd(), ""),
  },
}));
