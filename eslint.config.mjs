import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import ts from "typescript-eslint";
import { FlatCompat } from "@eslint/eslintrc";
import { fixupConfigRules } from "@eslint/compat";

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

const config = [
  ...patchedConfig,
  ...ts.configs.recommended,
  {
    ignores: [
      ".next/*",
      "components/ui/*",
      "__tests__/*",
      "playwright/*",
      "*.config.*",
    ],
  },
];

export default config;
