import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { loadEnv } from "vite";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  test: {
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/cypress/**",
      "**/.{idea,git,cache,output,temp}/**",
      "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*",
      "**/playwright/**",
    ],
    environment: "jsdom",
    alias: {
      "@/": new URL("./", import.meta.url).pathname,
    },
    env: loadEnv(mode, process.cwd(), ""),
  },
}));
