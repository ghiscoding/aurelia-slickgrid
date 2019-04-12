module.exports = {
  globals: {
    'ts-jest': {
      tsConfig: './tsconfig.spec.json'
    }
  },
  collectCoverage: false,
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!src/assets/**',
    '!**/*.spec.{js,ts}',
    '!**/node_modules/**',
    '!**/test/**'
  ],
  coverageDirectory: '<rootDir>/test/coverage-jest',
  coveragePathIgnorePatterns: [
    '!*.d.ts',
    '!*.enum.ts',
    '!*.interface.ts',
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
  moduleFileExtensions: [
    'json',
    'js',
    'ts'
  ],
  modulePaths: [
    '<rootDir>/src',
    '<rootDir>/node_modules'
  ],
  setupFiles: ['<rootDir>/test/jest-pretest.ts'],
  setupFilesAfterEnv: ['<rootDir>/test/jest-setup.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': '<rootDir>/node_modules/ts-jest'
  },
  transformIgnorePatterns: [
    '!*.d.ts',
    'node_modules/(?!@ngrx)',
  ],
  testMatch: [
    '**/__tests__/**/*.+(ts|js)',
    '**/+(*.)+(spec|test).+(ts|js)'
  ],
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    'cypress/',
    '/node_modules/',
  ],
};
