import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  rootDir: '../',
  globalSetup: '<rootDir>/test/jest-global-setup.ts',
  collectCoverage: false,
  collectCoverageFrom: [
    'packages/aurelia-slickgrid/src/**/*.ts',
    '!packages/aurelia-slickgrid/src/assets/**',
    '!packages/aurelia-slickgrid/src/**/models/**',
    '!dist/**',
    '!**/node_modules/**',
    '!**/models/**',
    '!**/test/**',
    '!packages/demo/**',
  ],
  coverageDirectory: '<rootDir>/test/jest-coverage',
  coveragePathIgnorePatterns: [
    'example-data.js',
    'constants.ts',
    'index.ts',
    'slickgrid-config.ts',
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
    '<rootDir>/packages/aurelia-slickgrid/src',
    '<rootDir>/node_modules'
  ],
  preset: 'ts-jest',
  setupFiles: ['<rootDir>/test/jest-pretest.ts'],
  setupFilesAfterEnv: ['jest-extended/all', '<rootDir>/test/jest-global-mocks.ts'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        diagnostics: false,
        isolatedModules: true,
        tsconfig: '<rootDir>/test/tsconfig.spec.json'
      }
    ]
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

export default config;
