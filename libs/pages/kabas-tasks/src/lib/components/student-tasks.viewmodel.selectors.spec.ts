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
import { HumanDateTimePipe } from '@campus/ui';
import { StudentTaskInterface } from '../interfaces/StudentTask.interface';
import { StudentTaskWithContentInterface } from '../interfaces/StudentTaskWithContent.interface';
import {
  dateLabelRules,
  isUrgent,
  studentTasks,
  studentTaskWithContent
} from './student-tasks.viewmodel.selectors';

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

  describe('studentTasks', () => {
    const start = new Date(2020, 1, 1);
    const end = new Date(2020, 2, 1);
    const lastUpdated = new Date(2020, 1, 15);
    const dateMock = new MockDate();

    afterAll(() => {
      dateMock.returnRealDate();
    });

    const task = getMockTask(lastUpdated);
    const projector = studentTasks.projector;

    it('should return expected values', () => {
      const expected: StudentTaskInterface[] = [
        {
          name: 'Huiswerk',
          description: 'Super belangrijke herhalingsoefeningen',
          learningAreaName: 'Frans',
          learningAreaId: 1,
          count: {
            completedRequired: 2,
            totalRequired: 2
          },
          isFinished: true,
          isUrgent: false,
          dateGroupLabel: 'vroeger',
          dateLabel: '2020-3-1',
          endDate: end,
          actions: []
        }
      ];
      const taskInstances = [
        new TaskInstanceFixture({
          start,
          end,
          task: {
            ...task,
            results: [
              new ResultFixture({
                eduContent: new EduContentFixture({ id: 1, type: 'exercise' })
              }),
              new ResultFixture({
                eduContent: new EduContentFixture({ id: 2, type: 'exercise' })
              })
            ],
            taskEduContents: [
              new TaskEduContentFixture({
                required: true,
                eduContent: new EduContentFixture({ id: 1, type: 'exercise' })
              }),
              new TaskEduContentFixture({
                required: true,
                eduContent: new EduContentFixture({ id: 2, type: 'exercise' })
              })
            ],
            learningAreaId: 1
          }
        })
      ];
      const res = projector(taskInstances);
      expect(res).toEqual(expected);
    });

    it('should show isFinished=true if endDate is before today', () => {
      const expected: StudentTaskInterface[] = [
        {
          name: 'Huiswerk',
          description: 'Super belangrijke herhalingsoefeningen',
          learningAreaName: 'Frans',
          learningAreaId: 1,
          count: {
            completedRequired: 0,
            totalRequired: 2
          },
          isFinished: true,
          isUrgent: false,
          dateGroupLabel: 'vroeger',
          dateLabel: '2019-4-1',
          endDate: new Date(2019, 3, 1),
          actions: []
        }
      ];
      const taskInstances = [
        new TaskInstanceFixture({
          start,
          end: new Date(2019, 3, 1),
          task: {
            ...task,
            results: [],
            taskEduContents: [
              new TaskEduContentFixture({
                required: true,
                eduContent: new EduContentFixture({ id: 1, type: 'exercise' })
              }),
              new TaskEduContentFixture({
                required: true,
                eduContent: new EduContentFixture({ id: 2, type: 'exercise' })
              })
            ],
            learningAreaId: 1
          }
        })
      ];
      const res = projector(taskInstances);
      expect(res).toEqual(expected);
    });
    it('should return the right day given the preset', () => {
      const pipe = new HumanDateTimePipe();

      expect(
        pipe.transform(dateMock.mockDate, {
          rules: dateLabelRules
        })
      ).toEqual('vandaag');
    });
    it('should return true if its today or tomorrow', () => {
      expect(isUrgent(new Date())).toBeTruthy(); //today
      expect(
        isUrgent(new Date(new Date().setDate(new Date().getDate() + 1)))
      ).toBeTruthy(); //tomorrow
      expect(
        isUrgent(new Date(new Date().setDate(new Date().getDate() + 7)))
      ).toBeFalsy(); // next week
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
        { type: 'exercise', id: 1 },
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
        { type: 'exercise', id: 2 },

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
