import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginImport from "eslint-plugin-import";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: [
      ".config/**",
      "**/jest.config.js",
      "**/*.config.js",
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/coverage/**",
      "**/.next/**",
      "**/out/**",
    ],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },
  { files: ["**/*.js"], languageOptions: { sourceType: "module" } },
  tseslint.configs.recommended,
  {
    ...pluginReact.configs.flat.recommended,
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "react/react-in-jsx-scope": "off", // Not needed with new JSX transform
    },
  },
  {
    plugins: {
      import: pluginImport,
    },
    rules: {
      semi: ["error", "always"], // Require semicolons
      "no-console": "warn",
      quotes: ["error", "double"], // Use double quotes
      "object-curly-spacing": ["error", "always"], // Space inside object braces
      "array-bracket-spacing": ["error", "never"], // No spaces inside array brackets
      "comma-dangle": ["error", "always-multiline"], // Trailing commas in multiline objects/arrays
      "no-multi-spaces": "error", // Disallow multiple spaces
      "space-before-blocks": ["error", "always"], // Require space before blocks
      "space-in-parens": ["error", "never"], // No space inside parentheses
      "key-spacing": ["error", { beforeColon: false, afterColon: true }], // Space after colon in objects
      "eol-last": ["error", "always"], // Require newline at end of file
      camelcase: [
        "error",
        { properties: "never", ignoreDestructuring: true }, // Enforce camelCase, ignore destructuring and object properties
      ],
      "@typescript-eslint/naming-convention": [
        "error",
        {
          "selector": "variable",
          "format": ["camelCase", "UPPER_CASE", "PascalCase"],
          "leadingUnderscore": "allow",
        },
        {
          "selector": "function",
          "format": ["camelCase", "PascalCase"],
        },
        {
          "selector": "typeLike",
          "format": ["PascalCase"],
        },
        {
          "selector": "enumMember",
          "format": ["UPPER_CASE"],
        },
      ],
      "brace-style": ["error", "1tbs"], // One True Brace Style
      "react/jsx-curly-brace-presence": ["error", "never"], // No unnecessary JSX curly braces
      "react/self-closing-comp": ["error", { component: true, html: false }], // Self-close components without children
      "@typescript-eslint/consistent-type-definitions": ["error", "type"], // Prefer 'type' over 'interface'
      "@typescript-eslint/no-use-before-define": [
        "error",
        { functions: false, classes: true, variables: true }, // Allow functions before definition, disallow classes/variables
      ],
      "@typescript-eslint/no-explicit-any": "error", // Disallow use of 'any' type
      "react/jsx-key": ["error", { checkFragmentShorthand: true }], // Require keys in lists and fragments
      // Unused Variable Detection
      "no-unused-vars": "off", // turn off base rule
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          "argsIgnorePattern": "^_", // ignore args starting with _
          "varsIgnorePattern": "^_", // ignore vars starting with _
          "ignoreRestSiblings": true, // ignore rest siblings in destructuring
        },
      ],

      "arrow-spacing": ["error", { before: true, after: true }], // Space before/after arrow function arrows
      "block-spacing": ["error", "always"], // Space inside single-line blocks
      "computed-property-spacing": ["error", "never"], // No spaces in computed properties
      "func-call-spacing": ["error", "never"], // No space between function name and parentheses
      "space-infix-ops": "error", // Require spaces around infix operators
      "no-trailing-spaces": "error", // No trailing spaces at the end of lines
      "no-whitespace-before-property": "error", // No spaces before property access
      "padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: "*", next: "return" }, // Blank line before return statements
      ],
      "react/jsx-props-no-multi-spaces": "error", // Disallow multiple spaces between JSX props
      "react/jsx-indent": ["error", 2], // Indent JSX with 2 spaces
      "react/jsx-indent-props": ["error", 2], // Indent JSX props with 2 spaces
      "react/jsx-filename-extension": ["error", { extensions: [".jsx", ".tsx"] }], // Only allow JSX in .jsx/.tsx files
      "react/jsx-wrap-multilines": [
        "error",
        {
          declaration: "parens-new-line",
          assignment: "parens-new-line",
          return: "parens-new-line",
          arrow: "parens-new-line",
          condition: "parens-new-line",
          logical: "parens-new-line",
          prop: "parens-new-line",
        }, // Wrap multiline JSX in parentheses
      ],
      "react/jsx-first-prop-new-line": ["error", "multiline-multiprop"], // First prop on new line for multiline JSX

      // --- ES6 / Modern JS rules ---
      "prefer-const": "error", // Prefer const for variables never reassigned
      "no-var": "error", // Disallow var
      "prefer-destructuring": [
        "error",
        {
          VariableDeclarator: { array: true, object: true },
          AssignmentExpression: { array: false, object: false },
        }, // Prefer destructuring for arrays/objects in variable declarations
      ],
      "no-duplicate-imports": "error", // Disallow duplicate imports

      // --- Import/order rules ---
      "import/no-extraneous-dependencies": ["off"], // allow devDependencies
      // --- Other Airbnb rules ---
      "no-underscore-dangle": "error", // Disallow dangling underscores in identifiers
      "no-alert": "error", // Disallow alert/confirm/prompt
    },
  },
]);
