module.exports = {
  testMatch: ['**/+(*.)+(spec|test).+(ts|js)?(x)'],
  transform: {
    '^.+\\.(ts|js|html)$': 'ts-jest'
  },
  resolver: '@nrwl/jest/plugins/resolver',
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageReporters: ['cobertura'],
  reporters: process.env.CI
    ? [
        'default',
        [
          'jest-junit',
          {
            outputDirectory: './junit',
            outputName: new Date().getTime() + '.xml'
          }
        ]
      ]
    : ['default'],
  bail: true,
  logHeapUsage: true,
  restoreMocks: true,
  testPathIgnorePatterns: ['e2e/'],
  setupFilesAfterEnv: ['./jest-test-setup.ts'],
  globals: {
    'ts-jest': {
      tsConfig: './tsconfig.spec.json',
      diagnostics: { warnOnly: true },
      stringifyContentPathRegex: '\\.html$',
      astTransformers: ['jest-preset-angular/InlineHtmlStripStylesTransformer'],
      isolatedModules: true
    }
  }
};
