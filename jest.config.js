module.exports = {
  testMatch: [
    '**/confirmable-select.component.spec.ts',
    '**/content-preview.component.spec.ts',
    '**/dropdown-menu.component.spec.ts',
    '**/filter.component.spec.ts',
    '**/input-label.component.spec.ts',
    '**/period-label.component.spec.ts'
  ],
  transform: {
    '^.+\\.(ts|js|html)$': 'jest-preset-angular/preprocessor.js'
  },
  resolver: '@nrwl/builders/plugins/jest/resolver',
  moduleFileExtensions: ['ts', 'js', 'html'],
  collectCoverage: true,
  coverageReporters: ['html']
};
