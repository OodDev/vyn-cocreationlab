import coreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

/**
 * Flat ESLint config for Next.js (core-web-vitals + TypeScript rules),
 * with strict TypeScript hygiene rules from the project brief:
 * - explicit return types on every function
 * - no unused vars (errors, not warnings)
 * - `@next/next/no-img-element` is disabled on purpose: this is a static
 *   export (`output: "export"`), so images must be regular `<img>` tags
 *   rendered by the pre-optimized `<SmartImage>` component.
 */
const eslintConfig = [
  ...coreWebVitals,
  ...nextTypescript,
  {
    rules: {
      "@typescript-eslint/explicit-function-return-type": [
        "error",
        {
          allowExpressions: false,
          allowTypedFunctionExpressions: true,
          allowDirectConstAssertionInArrowFunctions: true,
          allowHigherOrderFunctions: true,
          allowIIFEs: true,
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@next/next/no-img-element": "off",
      "prefer-const": "error",
      eqeqeq: ["error", "always"],
    },
  },
  {
    ignores: ["out/**", ".next/**", "node_modules/**", "public/**", "scripts/**"],
  },
];

export default eslintConfig;
