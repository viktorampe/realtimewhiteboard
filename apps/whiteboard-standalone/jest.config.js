module.exports = {
  name: 'whiteboard-standalone',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/whiteboard-standalone',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
