module.exports = {
  testMatch: ['**/+(*.)+(spec|test).+(ts|js)?(x)'],
  transform: {
    '^.+\\.(ts|js|html)$': 'ts-jest'
  },
  resolver: '@nrwl/builders/plugins/jest/resolver',
  moduleFileExtensions: ['ts', 'js', 'html'],
  collectCoverage: process.env.CI,
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
  restoreMocks: true
};
