import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import ts from "typescript-eslint";
import { FlatCompat } from "@eslint/eslintrc";
import { fixupConfigRules } from "@eslint/compat";
import eslintPlugin from "./packages/eslint-plugin/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const patchedConfig = fixupConfigRules([
  ...compat.extends("next/core-web-vitals"),
]);

export default ts.config(
  {
    ignores: [
      ".next/*",
      "components/ui/*",
      "__tests__/*",
      "playwright/*",
      "*.config.*",
      "playwright-report/*",
    ],
  },
  {
    extends: [...patchedConfig, ...ts.configs.recommended],
    plugins: {
      eslintPlugin: eslintPlugin,
    },
    rules: {
      "eslintPlugin/explicit-generics": ["error", { functionNames: ["post"] }],
      "eslintPlugin/no-ternary-true-false": "error",
      "eslintPlugin/no-and-operator-for-errors": "error",
      "no-console": "error",
    },
  }
);
