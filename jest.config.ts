export default {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/?(*.)+(spec|test).ts"],
  moduleNameMapper: {
    "^@common/(.*)$": "<rootDir>/src/common/$1",
    "^@membership/(.*)$": "<rootDir>/src/modules/membership/$1"
  }
};
