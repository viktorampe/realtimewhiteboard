module.exports = {
  testMatch: ['**/+(*.)+(spec|test).+(ts|js)?(x)'],
  transform: {
    '^.+\\.(ts|js|html)$': 'jest-preset-angular/preprocessor.js'
  },
  resolver: '@nrwl/builders/plugins/jest/resolver',
  moduleFileExtensions: ['ts', 'js', 'html'],
  collectCoverage: false,
  coverageReporters: ['html'],
  reporters: process.env.JUNIT
    ? ['default', ['jest-junit', { outputDirectory: './junit', outputName: new Date().getTime() + '.xml' }]]
    : ['default'],
  bail: true
};
