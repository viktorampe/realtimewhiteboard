module.exports = {
  name: 'pages-global-search',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/pages/global-search',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ],
  globals: require('../../../jest.global.config')
};
