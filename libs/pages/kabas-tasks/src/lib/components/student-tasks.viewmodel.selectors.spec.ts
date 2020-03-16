// file.only

import {
  EduContentFixture,
  LearningAreaFixture,
  PersonFixture,
  ResultFixture,
  ResultStatus,
  TaskEduContentFixture,
  TaskFixture,
  TaskInstanceFixture
} from '@campus/dal';
import { MockDate } from '@campus/testing';
import { StudentTaskWithContentInterface } from '../interfaces/StudentTaskWithContent.interface';
import { studentTaskWithContent } from './student-tasks.viewmodel.selectors';

describe('student-tasks viewmodel selectors', () => {
  describe('studentTaskWithContent', () => {
    const projector = studentTaskWithContent.projector;

    // objects to be used in both mock and expected
    const today = new Date(2020, 2, 16);
    const start = new Date(2020, 1, 1);
    const end = new Date(2020, 2, 1);
    const endPastToday = new Date(2020, 2, 20);
    const assigner = new PersonFixture();
    const lastUpdated = new Date(2020, 1, 15);
    const dateMock = new MockDate(today);

    const task = getMockTask(lastUpdated);
    const emptyTask = new TaskFixture({
      name: 'Huiswerk',
      description: 'Super belangrijke herhalingsoefeningen',
      learningArea: new LearningAreaFixture({ name: 'Frans' }),
      results: [],
      taskEduContents: []
    });

    afterAll(() => {
      dateMock.returnRealDate();
    });

    it('should return the correct value - no result', () => {
      const storeTaskInstance = new TaskInstanceFixture({
        assigner,
        start,
        end,
        task
      });

      const result = projector(storeTaskInstance);

      const expected: StudentTaskWithContentInterface = {
        name: 'Huiswerk',
        description: 'Super belangrijke herhalingsoefeningen',
        learningAreaName: 'Frans',
        start,
        end,
        isFinished: true,
        assigner,
        contents: [
          {
            required: true,
            name: 'neuspeuteren',
            description: 'instructiefilmpje',
            icon: 'mp4',
            status: ResultStatus.STATUS_COMPLETED,
            lastUpdated,
            score: 100,
            eduContentId: 1,
            actions: []
          },
          {
            required: false,
            name: 'nagelbijten',
            description: 'herhalingsoefening',
            icon: 'oefening',
            status: ResultStatus.STATUS_INCOMPLETE,
            lastUpdated,
            score: 50,
            eduContentId: 2,
            actions: []
          }
        ]
      };

      expect(result).toEqual(expected);
    });

    it('should return the correct value - not finished', () => {
      const storeTaskInstance = new TaskInstanceFixture({
        assigner,
        start,
        end: endPastToday,
        task: emptyTask
      });

      const result = projector(storeTaskInstance);

      const expected: StudentTaskWithContentInterface = {
        name: 'Huiswerk',
        description: 'Super belangrijke herhalingsoefeningen',
        learningAreaName: 'Frans',
        start,
        end: endPastToday,
        isFinished: false,
        assigner,
        contents: []
      };

      expect(result).toEqual(expected);
    });

    // This should not happen, at least not when #2956 is completed
    it('should return the correct value - no result', () => {
      const storeTaskInstance = new TaskInstanceFixture({
        assigner,
        start,
        end,
        task: { ...task, results: [] }
      });

      const result = projector(storeTaskInstance);

      const expected: StudentTaskWithContentInterface = {
        name: 'Huiswerk',
        description: 'Super belangrijke herhalingsoefeningen',
        learningAreaName: 'Frans',
        start,
        end,
        isFinished: true,
        assigner,
        contents: [
          {
            required: true,
            name: 'neuspeuteren',
            description: 'instructiefilmpje',
            icon: 'mp4',
            status: undefined,
            lastUpdated: undefined,
            score: undefined,
            eduContentId: 1,
            actions: []
          },
          {
            required: false,
            name: 'nagelbijten',
            description: 'herhalingsoefening',
            icon: 'oefening',
            status: undefined,
            lastUpdated: undefined,
            score: undefined,
            eduContentId: 2,
            actions: []
          }
        ]
      };
      expect(result).toEqual(expected);
    });
  });
});

function getMockTask(lastUpdated) {
  const results = [
    new ResultFixture({
      eduContentId: 1,
      score: 100,
      status: ResultStatus.STATUS_COMPLETED,
      lastUpdated
    }),
    new ResultFixture({
      eduContentId: 2,
      score: 50,
      status: ResultStatus.STATUS_INCOMPLETE,
      lastUpdated
    })
  ];

  const taskEduContents = [
    new TaskEduContentFixture({
      eduContentId: 1,
      eduContent: new EduContentFixture(
        { id: 1 },
        {
          title: 'neuspeuteren',
          description: 'instructiefilmpje',
          fileExt: 'mp4'
        }
      ),
      required: true
    }),
    new TaskEduContentFixture({
      eduContentId: 2,
      eduContent: new EduContentFixture(
        { id: 2 },
        {
          title: 'nagelbijten',
          description: 'herhalingsoefening'
        }
      ),
      required: false
    })
  ];

  return new TaskFixture({
    name: 'Huiswerk',
    description: 'Super belangrijke herhalingsoefeningen',
    learningArea: new LearningAreaFixture({ name: 'Frans' }),
    results,
    taskEduContents
  });
}
