module.exports = {
  globals: {
    'ts-jest': {
      diagnostics: false,
      tsConfig: './tsconfig.spec.json'
    },
  },
  collectCoverage: false,
  collectCoverageFrom: [
    'src/aurelia-slickgrid/**/*.ts',
    '!dist/**',
    '!src/assets/**',
    '!**/node_modules/**',
    '!**/test/**',
    '!src/examples/**',
  ],
  coverageDirectory: '<rootDir>/test/coverage-jest',
  coveragePathIgnorePatterns: [
    'example-data.js',
    '\\.d\\.ts$',
    '<rootDir>/node_modules/'
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
  setupFilesAfterEnv: ['jest-extended', '<rootDir>/test/jest-global-mocks.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
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
