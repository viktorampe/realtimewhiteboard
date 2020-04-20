module.exports = {
  name: 'realtime-whiteboard',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/realtime-whiteboard',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
