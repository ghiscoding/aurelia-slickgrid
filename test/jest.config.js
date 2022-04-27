module.exports = {
  rootDir: '../',
  globals: {
    'ts-jest': {
      diagnostics: false,
      isolatedModules: true,
      tsconfig: '<rootDir>/test/tsconfig.spec.json'
    },
  },
  globalSetup: '<rootDir>/test/jest-global-setup.js',
  collectCoverage: false,
  collectCoverageFrom: [
    'src/aurelia-slickgrid/**/*.ts',
    '!dist/**',
    '!src/assets/**',
    '!**/node_modules/**',
    '!**/test/**',
    '!src/examples/**',
  ],
  coverageDirectory: '<rootDir>/test/jest-coverage',
  coveragePathIgnorePatterns: [
    'example-data.js',
    'global-grid-options.ts',
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
  setupFilesAfterEnv: ['jest-extended/all', '<rootDir>/test/jest-global-mocks.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest/legacy'
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
    '<rootDir>/test/cypress/',
    '<rootDir>/node_modules/',
  ],
};
