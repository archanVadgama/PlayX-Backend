import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    ignores: [
      "eslint.config.js",
      "dist/**",
      "prisma/**",
      "generated/**",
      "generated/prisma/wasm.js",
      "generated/prisma/**",
    ],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    plugins: { js },
    extends: ["js/recommended", ...tseslint.configs.recommended],
    rules: {
      // 🚨 Possible Errors - Prevent syntax issues & runtime errors
      "no-console": "error",
      "no-debugger": "warn",
      "no-unsafe-finally": "error",
      "no-extra-semi": "error",
      // "no-template-curly-in-string": "error",

      // ✅ Best Practices - Enforce quality coding standards
      // "curly": "error",
      "eqeqeq": ["error", "always"],
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-var": "error",
      "prefer-const": "error",
      "no-return-await": "error",
      // "no-void": "error",

      // 🔍 Variables & Scoping - Ensure proper variable usage
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "@typescript-eslint/no-shadow": "error",
      "@typescript-eslint/no-undef": "off", // TypeScript handles this
      "@typescript-eslint/no-use-before-define": ["error", { "functions": false, "classes": true }],

      // 🎨 Stylistic Rules - Enforce consistent formatting
      // "indent": ["error", 2],
      "quotes": ["warn", "double", { "avoidEscape": true }],
      // "semi": ["warn", "always"],
      // "comma-dangle": ["error", "always-multiline"],
      "object-curly-spacing": ["warn", "always"],
      "space-before-blocks": "error",
      "keyword-spacing": "error",
      "arrow-spacing": "error",

      // 🔗 Node.js & CommonJS - Best practices for Node.js
      "callback-return": "error",
      "handle-callback-err": "error",
      "no-new-require": "error",
      "no-path-concat": "error",
      "global-require": "error",
      "no-process-exit": "error",

      // 🔐 Security - Prevent vulnerabilities
      "no-buffer-constructor": "error",
      "no-new-wrappers": "error",
      "require-await": "error",
      // "no-mixed-requires": "error",

      // 🚀 ECMAScript 6+ (ES6+) - Enforce modern syntax
      "prefer-template": "error",
      "object-shorthand": "error",
      // "arrow-body-style": ["error", "as-needed"],
      "no-duplicate-imports": "error",
      "prefer-rest-params": "error",
      "prefer-spread": "error",

      // ⚡ Performance - Improve code efficiency
      "no-loop-func": "error",
      "no-self-compare": "error",
      "no-useless-concat": "error",
      "no-useless-return": "error",

      // 📦 Imports & Modules - Enforce modular best practices
      // "import/no-unresolved": "error",
      // "import/named": "error",
      // "import/default": "error",
      // "import/first": "error",
      // "import/no-duplicates": "error",

      // 🔍 Strict Mode - Enforce strict JavaScript execution
      // "strict": ["error", "global"]
    },
  },
]);