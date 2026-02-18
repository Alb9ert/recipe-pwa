export default {
    preset: "ts-jest/presets/default-esm",
    testEnvironment: "node",
    extensionsToTreatAsEsm: [".ts"],
    testMatch: ["**/tests/**/*.test.ts"],
    setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
    transform: {
      "^.+\\.ts$": ["ts-jest", {
        useESM: true,
        tsconfig: {
          module: "esnext",
          moduleResolution: "node",
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
        },
      }],
    },
    moduleNameMapper: {
      "^(\\.{1,2}/.*)\\.js$": "$1",
    },
    transformIgnorePatterns: [
      "node_modules/(?!(google-auth-library|gaxios|supertest)/)",
    ],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  };