module.exports = {
  globals: {
    'ts-jest': {
      tsConfig: './tsconfig.spec.json'
    }
  },
  collectCoverage: false,
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    'test-examples/**/*.{js,ts}',
    '!**/*.spec.{js,ts}',
    '!**/node_modules/**',
    '!**/test/**'
  ],
  coverageDirectory: '<rootDir>/test/coverage-jest',
  coveragePathIgnorePatterns: [
    '!*.d.ts',
    'constants.ts',
    'environment.ts',
    'example-data.js',
    'index.ts',
    'main.ts',
  ],
  coverageReporters: [
    'json',
    'lcov',
    'text',
    'html'
  ],
  modulePaths: [
    '<rootDir>/src',
    '<rootDir>/node_modules'
  ],
  moduleFileExtensions: [
    'json',
    'js',
    'ts'
  ],
  setupFiles: [
    '<rootDir>/test/jest-pretest.ts'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': '<rootDir>/node_modules/ts-jest'
  },
  transformIgnorePatterns: ['node_modules/(?!@ngrx)', '!*.d.ts'],
  testMatch: ['**/__tests__/**/*.+(ts|js)', '**/+(*.)+(spec|test).+(ts|js)'],
  testEnvironment: 'node',
  testPathIgnorePatterns: ['cypress/'],
};
