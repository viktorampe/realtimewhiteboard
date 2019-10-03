module.exports = {
  name: 'timeline',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/timeline',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
