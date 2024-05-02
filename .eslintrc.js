module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true, // Node.js global variables and Node.js scoping.
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended", // Base TypeScript rules
    "prettier",
    "next",
    "next/core-web-vitals", // Ensures Google's Core Web Vitals are taken into account
  ],
  overrides: [
    {
      files: ["*.ts", "*.tsx"], // Targeting only TypeScript files for specific overrides
      rules: {
        "@typescript-eslint/explicit-module-boundary-types": "off", // Turn off if too verbose in project, or keep as 'error' if strict typing is needed
      },
    },
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}", "**/*.config.js", "**/*.config.cjs"], // Include all config files
      parserOptions: {
        sourceType: "script", // CommonJS modules
      },
    },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest", // Latest ECMAScript standards
    sourceType: "module", // Supports ES Modules
    ecmaFeatures: {
      jsx: true, // Allows for parsing of JSX
    },
  },
  plugins: ["@typescript-eslint", "react", "react-hooks"], // Include react-hooks plugin
  rules: {
    "require-jsdoc": "off",
    "react/react-in-jsx-scope": "off", // React 17+ doesn't require React to be in scope
    "@typescript-eslint/explicit-module-boundary-types": "error",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        vars: "all",
        args: "after-used",
        ignoreRestSiblings: true,
      },
    ],
    "@typescript-eslint/no-explicit-any": "error", // Avoid 'any' type
    "no-unused-vars": "off", // Disable JavaScript rule as TypeScript rule is used
    "@typescript-eslint/no-inferrable-types": "error",
    "@typescript-eslint/consistent-type-imports": "error",
    "react-hooks/rules-of-hooks": "error", // Checks rules of Hooks
    "react-hooks/exhaustive-deps": "warn", // Checks effect dependencies
  },
};
