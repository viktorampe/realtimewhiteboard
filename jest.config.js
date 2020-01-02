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
  restoreMocks: true
  // globals: {
  //   'ts-jest': {
  //     isolatedModules: true,
  //     diagnostics: {
  //       warnOnly: true
  //     }
  //   }
  // }
};
