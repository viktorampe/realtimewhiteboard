import { TaskInfoByLearningAreaPipe } from './task-info-by-learning-area.pipe';

describe('taskInfoByLearningArea', () => {
  const testCases = [
    {
      description: 'taskCount = 1 and urgentCount exists',
      input: {
        learningAreaId: 1,
        learningAreaName: 'foo',
        taskCount: 1,
        urgentCount: 1
      },
      expected: 'foo (1 taak, 1 dringend)'
    },
    {
      description: 'taskCount > 1 and urgentCount exists',
      input: {
        learningAreaId: 1,
        learningAreaName: 'foo',
        taskCount: 5,
        urgentCount: 2
      },
      expected: 'foo (5 taken, 2 dringend)'
    },
    {
      description: 'taskCount > 1 and no urgentCount',
      input: {
        learningAreaId: 1,
        learningAreaName: 'foo',
        taskCount: 5,
        urgentCount: 0
      },
      expected: 'foo (5 taken)'
    }
  ];
  it('create an instance', () => {
    const pipe = new TaskInfoByLearningAreaPipe();
    expect(pipe).toBeTruthy();
  });

  testCases.forEach(testCase => {
    it(`should return the correct info - ${testCase.description}`, () => {
      const pipe = new TaskInfoByLearningAreaPipe();
      const result = pipe.transform(testCase.input);
      expect(result).toBe(testCase.expected);
    });
  });
});
