import { taskCollection } from './edu-content-collection-manager-selectors';

describe('taskCollection', () => {
  describe('taskCollection', () => {
    it('should return digital and paper seperated', () => {
      const tasks = [
        {
          id: 1,
          name: 'testje',
          isPaperTask: true
        },
        {
          id: 2,
          name: 'testje2',
          isPaperTask: false
        }
      ];
      const result = [
        {
          id: 1,
          label: 'testje',
          icon: 'task'
        },
        {
          id: 2,
          label: 'testje2',
          icon: 'task'
        }
      ];
      expect(taskCollection.projector(tasks, {})).toEqual({
        digital: [result[1]],
        paper: [result[0]]
      });
    });
  });
});
