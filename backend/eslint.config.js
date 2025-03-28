import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { 
    files: ["**/*.{js,mjs,cjs,ts}"], 
    languageOptions: { globals: { ...globals.browser, ...globals.node } } 
  },
  { 
    files: ["**/*.{js,mjs,cjs,ts}"], 
    plugins: { js }, 
    extends: ["js/recommended"], 
	ignores: ["eslint.config.js","dist/**"],
    rules: {
		// 🚨 Possible Errors - Prevent syntax issues & runtime errors
		"no-console": "warn", // Disallow console.log()
		"no-debugger": "warn", // Disallow debugger statements
		"no-unsafe-finally": "error", // Prevent issues in finally blocks
		"no-extra-semi": "error", // Disallow unnecessary semicolons
		// "no-template-curly-in-string": "error", // Detect mistaken template literals without expressions
	
		// ✅ Best Practices - Enforce quality coding standards
		// "curly": "error", // Require curly braces for if/else
		"eqeqeq": ["error", "always"], // Require strict equality (===)
		"no-eval": "error", // Disallow eval() usage
		"no-implied-eval": "error", // Disallow indirect eval() via setTimeout, setInterval
		"no-var": "error", // Enforce let/const instead of var
		"prefer-const": "error", // Require const for unchanging variables
		"no-return-await": "error", // Disallow redundant return await
		// "no-void": "error", // Disallow void operator
	
		// 🔍 Variables & Scoping - Ensure proper variable usage
		"no-unused-vars": ["error", { "argsIgnorePattern": "^_" }], // Ignore unused function args prefixed with "_"
		"no-shadow": "error", // Prevent variable shadowing
		"no-undef": "error", // Disallow usage of undefined variables
		"no-use-before-define": ["error", { "functions": false, "classes": true }], // Disallow use before declaration
	
		// 🎨 Stylistic Rules - Enforce consistent formatting
		// "indent": ["error", 2], // Enforce 2-space indentation
		"quotes": ["error", "double", { "avoidEscape": true }], // Enforce double quotes
		"semi": ["error", "always"], // Require semicolons
		"comma-dangle": ["error", "always-multiline"], // Require trailing commas in multiline objects
		"object-curly-spacing": ["error", "always"], // Require spaces inside object curly braces
		"space-before-blocks": "error", // Require space before blocks
		"keyword-spacing": "error", // Require spacing around keywords (if, else, return, etc.)
		"arrow-spacing": "error", // Require spacing before/after arrow functions
	
		// 🔗 Node.js & CommonJS - Best practices for Node.js
		"callback-return": "error", // Enforce return after callback()
		"handle-callback-err": "error", // Handle errors in callbacks
		"no-new-require": "error", // Disallow new with require()
		"no-path-concat": "error", // Prevent __dirname & __filename string concatenation
		"global-require": "error", // Require require() to be at the top level
		"no-process-exit": "error", // Disallow process.exit()
	
		// 🔐 Security - Prevent vulnerabilities
		"no-buffer-constructor": "error", // Disallow use of new Buffer()
		"no-new-wrappers": "error", // Disallow new String(), new Boolean(), etc.
		"require-await": "error", // Prevent async functions without await
		"no-mixed-requires": "error", // Disallow mixing import and require()
	
		// 🚀 ECMAScript 6+ (ES6+) - Enforce modern syntax
		"prefer-template": "error", // Enforce template literals over string concatenation
		"object-shorthand": "error", // Enforce shorthand in object literals
		// "arrow-body-style": ["error", "as-needed"], // Prefer concise arrow function bodies
		"no-duplicate-imports": "error", // Disallow duplicate imports
		"prefer-rest-params": "error", // Use rest parameters (...) instead of arguments
		"prefer-spread": "error", // Use spread operator instead of Function.prototype.apply()
	
		// ⚡ Performance - Improve code efficiency
		"no-loop-func": "error", // Disallow function creation inside loops
		"no-self-compare": "error", // Prevent self-comparison (e.g., x === x)
		"no-useless-concat": "error", // Disallow unnecessary string concatenation
		"no-useless-return": "error", // Disallow redundant return statements
	
		// 📦 Imports & Modules - Enforce modular best practices
		// "import/no-unresolved": "error", // Ensure imports exist
		// "import/named": "error", // Ensure named imports match exports
		// "import/default": "error", // Ensure default import exists
		// "import/first": "error", // Ensure imports are at the top
		// "import/no-duplicates": "error", // Prevent duplicate imports
	
		// 🔍 Strict Mode - Enforce strict JavaScript execution
		// "strict": ["error", "global"] // Require "use strict" at global level
	  }
  },
  tseslint.configs.recommended
]);
