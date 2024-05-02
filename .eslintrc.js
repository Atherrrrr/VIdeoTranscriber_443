module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended", // Base TypeScript rules
    "prettier",
    "next",
    "next/core-web-vitals",
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "react"],
  rules: {
    "require-jsdoc": "off",
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/explicit-module-boundary-types": "error", // Ensure functions have explicit return types
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        vars: "all",
        args: "after-used",
        ignoreRestSiblings: true,
      },
    ],
    "@typescript-eslint/no-explicit-any": "error", // Re-enable this to avoid 'any' type
    "no-unused-vars": "off", // Still off, handled by TypeScript rule
    "@typescript-eslint/no-inferrable-types": "error", // Disallow explicit types where inferrable
    "@typescript-eslint/consistent-type-imports": "error", // Enforce using type imports for TypeScript types
  },
};
