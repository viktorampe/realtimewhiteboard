module.exports = {
  name: 'whiteboard',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/whiteboard',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
