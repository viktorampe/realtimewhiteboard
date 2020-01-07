/**
 * This is a workaround for  https://github.com/nrwl/nx/issues/1059
 * In short, nrwl:builders overwrites the globals setting in jest.config.js
 * This file can be used to import the correct global settings in the projects
 *
 * example (project libs/pages-bundles):
 *   module.exports = {
 *    name: 'pages-bundles',
 *    preset: '../../../jest.config.js',
 *    coverageDirectory: '../../../coverage/libs/pages/bundles',
 *    globals: require('../../../jest.global.config')
 *  };
 */

module.exports = {
  'ts-jest': {
    diagnostics: { warnOnly: true },
    stringifyContentPathRegex: '\\.html$',
    astTransformers: ['jest-preset-angular/InlineHtmlStripStylesTransformer'],
    isolatedModules: true
  }
};
