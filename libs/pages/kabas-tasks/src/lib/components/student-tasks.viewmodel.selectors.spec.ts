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
import { EduContentTypeEnum } from '@campus/shared';
import { MockDate } from '@campus/testing';
import { HumanDateTimePipe } from '@campus/ui';
import { StudentTaskInterface } from '../interfaces/StudentTask.interface';
import { StudentTaskWithContentInterface } from '../interfaces/StudentTaskWithContent.interface';
import {
  dateGroupLabelRules,
  dateLabelRules,
  isUrgent,
  studentTasks,
  studentTaskWithContent
} from './student-tasks.viewmodel.selectors';

describe('student-tasks viewmodel selectors', () => {
  const today = new Date(2020, 2, 16);
  const dateMock = new MockDate(today);
  afterAll(() => {
    dateMock.returnRealDate();
  });

  describe('studentTaskWithContent', () => {
    const projector = studentTaskWithContent.projector;

    // objects to be used in both mock and expected
    const start = new Date(2020, 1, 1);
    const end = new Date(2020, 2, 1);
    const endPastToday = new Date(2020, 2, 20);
    const assigner = new PersonFixture();
    const lastUpdated = new Date(2020, 1, 15);

    const task = getMockTask(lastUpdated);
    const emptyTask = new TaskFixture({
      name: 'Huiswerk',
      description: 'Super belangrijke herhalingsoefeningen',
      learningArea: new LearningAreaFixture({ name: 'Frans' }),
      results: [],
      taskEduContents: []
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
            eduContent: new EduContentFixture(
              { type: EduContentTypeEnum.EXERCISE },
              {
                description: 'instructiefilmpje',
                fileExt: 'mp4',
                title: 'neuspeuteren'
              }
            ),
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
            eduContent: new EduContentFixture(
              { id: 2, type: EduContentTypeEnum.EXERCISE },
              {
                description: 'herhalingsoefening',
                fileExt: 'oefening',
                title: 'nagelbijten'
              }
            ),
            actions: []
          }
        ],
        count: {
          totalRequired: 1,
          completedRequired: 1
        }
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
        contents: [],
        count: {
          totalRequired: 0,
          completedRequired: 0
        }
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
            eduContent: new EduContentFixture(
              { type: EduContentTypeEnum.EXERCISE },
              {
                description: 'instructiefilmpje',
                fileExt: 'mp4',
                title: 'neuspeuteren'
              }
            ),
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
            eduContent: new EduContentFixture(
              { id: 2, type: EduContentTypeEnum.EXERCISE },
              {
                description: 'herhalingsoefening',
                fileExt: 'oefening',
                title: 'nagelbijten'
              }
            ),
            actions: []
          }
        ],
        count: {
          totalRequired: 1,
          completedRequired: 0
        }
      };
      expect(result).toEqual(expected);
    });
  });

  describe('studentTasks', () => {
    const start = new Date(2020, 1, 1);
    const end = new Date(2020, 2, 1);
    const lastUpdated = new Date(2020, 1, 15);

    const date = new Date();
    const pipe = new HumanDateTimePipe();

    const task = getMockTask(lastUpdated);
    const projector = studentTasks.projector;

    it('should return expected values', () => {
      const expected: StudentTaskInterface[] = [
        {
          task: task,
          name: 'Huiswerk',
          description: 'Super belangrijke herhalingsoefeningen',
          learningAreaName: 'Frans',
          learningAreaId: 1,
          count: {
            completedRequired: 1,
            totalRequired: 1
          },
          isFinished: true,
          isUrgent: false,
          dateGroupLabel: 'vroeger',
          dateLabel: `ingediend op ${end.toLocaleDateString('nl-BE')}`,
          endDate: end,
          actions: []
        }
      ];
      const taskInstances = [
        new TaskInstanceFixture({
          start,
          end,
          task
        })
      ];
      const res = projector(taskInstances);
      expect(res).toEqual(expected);
    });

    it('should show isFinished=true if endDate is before today', () => {
      const endDate = new Date(2019, 3, 1);
      const expected: StudentTaskInterface[] = [
        {
          task,
          name: 'Huiswerk',
          description: 'Super belangrijke herhalingsoefeningen',
          learningAreaName: 'Frans',
          learningAreaId: 1,
          count: {
            completedRequired: 1,
            totalRequired: 1
          },
          isFinished: true,
          isUrgent: false,
          dateGroupLabel: 'vroeger',
          dateLabel: `ingediend op ${endDate.toLocaleDateString('nl-BE')}`,
          endDate: endDate,
          actions: []
        }
      ];
      const taskInstances = [
        new TaskInstanceFixture({
          start,
          end: new Date(2019, 3, 1),
          task
        })
      ];
      const res = projector(taskInstances);
      expect(res).toEqual(expected);
    });

    describe('dateLabelRules', () => {
      const testCases = [
        {
          it: 'should return vandaag',
          date: new Date(date),
          expected: 'vandaag'
        },
        {
          it: 'should return morgen',
          date: new Date(date).setDate(date.getDate() + 1),
          expected: 'morgen'
        },
        {
          it: 'should return overmorgen',
          date: new Date(date).setDate(date.getDate() + 2),
          expected: 'overmorgen'
        },
        {
          it: 'should return vrijdag',
          date: new Date(date).setDate(date.getDate() + 4),
          expected: 'Vrijdag'
        },
        {
          it: 'should return vorige week',
          date: new Date(date).setDate(date.getDate() + 7),
          expected: 'volgende week'
        }
      ];

      testCases.forEach(testCase => {
        it(testCase.it, () => {
          const mockDate = new Date(testCase.date);

          expect(
            pipe.transform(mockDate, {
              rules: dateLabelRules
            })
          ).toEqual(testCase.expected);
        });
      });
    });
    describe('groupLabelRules', () => {
      const testCases = [
        {
          it: 'should return vandaag',
          date: new Date(date),
          expected: 'vandaag'
        },
        {
          it: 'should return morgen',
          date: new Date(date).setDate(date.getDate() + 1),
          expected: 'morgen'
        },
        {
          it: 'should return overmorgen',
          date: new Date(date).setDate(date.getDate() + 2),
          expected: 'overmorgen'
        },
        {
          it: 'should return deze week',
          date: new Date(date).setDate(date.getDate() + 4),
          expected: 'deze week'
        },
        {
          it: 'should return vorige week',
          date: new Date(date).setDate(date.getDate() - 7),
          expected: 'vorige week'
        },
        {
          it: 'should return volgende week',
          date: new Date(date).setDate(date.getDate() + 7),
          expected: 'volgende week'
        },
        {
          it: 'should return vroeger ',
          date: new Date(date).setDate(date.getDate() - 14),
          expected: 'vroeger'
        },
        {
          it: 'should return later',
          date: new Date(date).setDate(date.getDate() + 15),
          expected: 'later'
        }
      ];

      testCases.forEach(testCase => {
        it(testCase.it, () => {
          const mockDate = new Date(testCase.date);

          expect(
            pipe.transform(mockDate, {
              rules: dateGroupLabelRules
            })
          ).toEqual(testCase.expected);
        });
      });
    });

    describe('isUrgent', () => {
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
});
