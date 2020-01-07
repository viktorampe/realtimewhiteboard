module.exports = {
  name: 'elements-ink',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/elements-ink',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ],
  globals: require('../../jest.global.config')
};
