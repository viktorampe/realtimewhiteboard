import {
  EduContentFixture,
  ResultFixture,
  ScormStatus,
  TaskEduContentFixture,
  TaskFixture,
  TaskInstanceFixture
} from '@campus/dal';
import { StudentTaskWithContentInterface } from '../interfaces/StudentTaskWithContent.interface';
import { LearningAreaFixture } from './../../../../../dal/src/lib/+fixtures/LearningArea.fixture';
import { PersonFixture } from './../../../../../dal/src/lib/+fixtures/Person.fixture';
import { studentTaskWithContent } from './student-tasks.viewmodel.selectors';

describe('student-tasks viewmodel selectors', () => {
  describe('studentTaskWithContent', () => {
    const projector = studentTaskWithContent.projector;

    // objects to be used in both mock and expected
    const start = new Date(2020, 1, 1);
    const end = new Date(2020, 2, 1);
    const assigner = new PersonFixture();
    const lastUpdated = new Date(2020, 1, 15);

    const task = getMockTask(lastUpdated);

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
        assigner,
        contents: [
          {
            required: true,
            name: 'neuspeuteren',
            description: 'instructiefilmpje',
            icon: 'mp4',
            status: 'completed',
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
            status: 'incomplete',
            lastUpdated,
            score: 50,
            eduContentId: 2,
            actions: []
          }
        ]
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
      status: ScormStatus.STATUS_COMPLETED,
      lastUpdated //TODO #3573
    } as any),
    new ResultFixture({
      eduContentId: 2,
      score: 50,
      status: ScormStatus.STATUS_INCOMPLETE,
      lastUpdated //TODO #3573
    } as any)
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
