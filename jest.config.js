module.exports = {
  testMatch: [
    '**/confirmable-select.component.spec.ts',
    '**/content-preview.component.spec.ts',
    '**/file-extension.component.spec.ts',
    '**/notification-dropdown-item.component.spec.ts',
    '**/list-view.component.spec.ts',
    '**/shell.component.spec.ts',
    '**/page-header.component.spec.ts'
  ],
  transform: {
    '^.+\\.(ts|js|html)$': 'jest-preset-angular/preprocessor.js'
  },
  resolver: '@nrwl/builders/plugins/jest/resolver',
  moduleFileExtensions: ['ts', 'js', 'html'],
  collectCoverage: true,
  coverageReporters: ['html']
};
