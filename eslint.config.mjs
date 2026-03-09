import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const eslintConfig = [...nextCoreWebVitals, ...nextTypescript, {
  ignores: [
    "node_modules/**",
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ],
  rules: {
    "@typescript-eslint/no-explicit-any": "off", // Disable the rule
    "react-hooks/exhaustive-deps": "off", // Disable the exhaustive-deps rule
    "@next/next/no-img-element": "off", // Disable the no-img-element rule
  },
}];

export default eslintConfig;
