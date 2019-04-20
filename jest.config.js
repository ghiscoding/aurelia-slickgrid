module.exports = {
  globals: {
    'ts-jest': {
      diagnostics: false,
      tsConfig: './tsconfig.spec.json'
    },
  },
  collectCoverage: false,
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!src/assets/**',
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
  preset: 'ts-jest',
  setupFiles: ['<rootDir>/test/jest-pretest.ts'],
  transform: {
    '^.+\.ts$': 'ts-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!@ngrx)',
    '<rootDir>/node_modules/slickgrid/'
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
