module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `eslint-config-custom`
  extends: ["@webstudio-is/eslint-config-custom"],
  ignorePatterns: [
    "**/__generated__/**/*",
    "/packages/prisma-client/prisma/migrations",
    "/codemod",
    "apps/cli/templates/",
  ],
};
