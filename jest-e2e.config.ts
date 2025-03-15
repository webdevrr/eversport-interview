export default {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: ".",
  testEnvironment: "node",
  testRegex: ".e2e-spec.ts$",
  collectCoverageFrom: [
    "src/apps/**/*.ts",
    "src/core/**/*.ts",
    "src/frameworks/**/*.ts",
    "src/common/**/*.ts",
    "src/utils/**/*.ts",
    "!src/apps/example/**/*.ts"
  ],
  transform: {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  moduleNameMapper: {
    "^@common/(.*)$": "<rootDir>/src/common/$1",
    "^@membership/(.*)$": "<rootDir>/src/modules/membership/$1"
  }
};
