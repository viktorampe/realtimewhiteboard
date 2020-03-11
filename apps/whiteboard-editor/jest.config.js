module.exports = {
  name: 'whiteboard-editor',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/whiteboard-editor',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
