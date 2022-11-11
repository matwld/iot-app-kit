// eslint-disable-next-line no-undef
module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['jest-extended/all'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  testPathIgnorePatterns: ['/dist'],
  coverageReporters: ['text-summary', 'cobertura', 'html', 'json', 'json-summary'],
  moduleNameMapper: {
    '\\.(css|scss|svg)$': 'identity-obj-proxy',
  },
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
};
