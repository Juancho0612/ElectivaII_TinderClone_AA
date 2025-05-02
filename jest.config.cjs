module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    "api/controllers/**/*.js",
    "api/middleware/**/*.js",
    "!**/node_modules/**",
    "!**/test/**",
  ],
  coverageDirectory: "coverage",
  testEnvironment: "node",
  testMatch: ["**/test/**/*.test.js"],
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
};
