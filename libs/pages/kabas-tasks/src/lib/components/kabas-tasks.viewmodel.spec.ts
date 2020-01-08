import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  CustomSerializer,
  getStoreModuleForFeatures,
  TaskReducer
} from '@campus/dal';
import { MockDate } from '@campus/testing';
import {
  NavigationActionTiming,
  routerReducer,
  StoreRouterConnectingModule
} from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { configureTestSuite } from 'ng-bullet';
import { TaskStatusEnum } from '../interfaces/TaskWithAssignees.interface';
import { KabasTasksViewModel } from './kabas-tasks.viewmodel';

describe('KabasTaskViewModel', () => {
  let kabasTasksViewModel: KabasTasksViewModel;
  let dateMock: MockDate;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(
          { router: routerReducer },
          {
            runtimeChecks: {
              strictStateImmutability: false,
              strictActionImmutability: false
            }
          }
        ),
        ...getStoreModuleForFeatures([TaskReducer]),
        RouterTestingModule.withRoutes([]),
        StoreRouterConnectingModule.forRoot({
          navigationActionTiming: NavigationActionTiming.PostActivation,
          serializer: CustomSerializer
        })
      ],
      providers: [KabasTasksViewModel]
    });
  });

  beforeAll(() => {
    dateMock = new MockDate();
  });

  afterAll(() => {
    dateMock.returnRealDate();
  });

  beforeEach(() => {
    kabasTasksViewModel = TestBed.get(KabasTasksViewModel);
  });

  describe('creation', () => {
    it('should be defined', () => {
      expect(kabasTasksViewModel).toBeDefined();
    });
  });

  describe('getTaskDates', () => {
    const originalStartDate = new Date();
    const originalEndDate = new Date();

    const startDateBeforeOriginal = new Date(
      originalStartDate.getTime() - 1000
    );
    const startDateAfterOriginal = new Date(originalStartDate.getTime() + 1000);
    const endDateAfterOriginal = new Date(originalEndDate.getTime() + 1000);
    const endDateBeforeOriginal = new Date(originalEndDate.getTime() - 1000);

    const testCases = [
      {
        it: 'should use the correct start and end date',
        assignees: [{ start: originalStartDate, end: originalEndDate }],
        expectedStart: originalStartDate,
        expectedEnd: originalEndDate
      },
      {
        it: 'should use the correct start and end date',
        assignees: [
          { start: originalStartDate, end: originalEndDate },
          {
            start: startDateBeforeOriginal,
            end: endDateAfterOriginal
          }
        ],
        expectedStart: startDateBeforeOriginal,
        expectedEnd: endDateAfterOriginal
      },
      {
        it: 'should use the correct start and end date',
        assignees: [
          { start: originalStartDate, end: originalEndDate },
          {
            start: startDateAfterOriginal,
            end: endDateAfterOriginal
          }
        ],
        expectedStart: originalStartDate,
        expectedEnd: endDateAfterOriginal
      },
      {
        it: 'should use the correct start and end date',
        assignees: [
          { start: originalStartDate, end: originalEndDate },
          {
            start: startDateAfterOriginal,
            end: endDateAfterOriginal
          },
          {
            start: startDateBeforeOriginal,
            end: endDateBeforeOriginal
          }
        ],
        expectedStart: startDateBeforeOriginal,
        expectedEnd: endDateAfterOriginal
      },
      {
        it: 'should use the correct start and end date - no assignees',
        assignees: [],
        expectedStart: undefined,
        expectedEnd: undefined
      },
      {
        it:
          'should use the correct start and end date - assignees without date',
        assignees: [{}, {}, {}],
        expectedStart: undefined,
        expectedEnd: undefined
      }
    ];

    beforeEach(() => {
      kabasTasksViewModel.getTaskStatus = jest
        .fn()
        .mockReturnValue(TaskStatusEnum.ACTIVE);
    });

    testCases.forEach(testCase =>
      it(testCase.it, () => {
        const result = kabasTasksViewModel.getTaskDates(
          {
            assignees: testCase.assignees
          } as any, // rest of TaskWithAssigneesInterface is not used
          new Date()
        );

        expect(result).toEqual({
          startDate: testCase.expectedStart,
          endDate: testCase.expectedEnd,
          status: TaskStatusEnum.ACTIVE
        });
        expect(kabasTasksViewModel.getTaskStatus).toHaveBeenCalledWith(
          testCase.expectedStart,
          testCase.expectedEnd,
          new Date()
        );
      })
    );
  });

  describe('getTaskStatus', () => {
    const testCases = [
      {
        it: 'should return active',
        startDate: new Date(Date.now() - 1000),
        endDate: new Date(Date.now() + 1000),
        now: new Date(),
        expected: TaskStatusEnum.ACTIVE
      },
      {
        it: 'should return active - edge cases',
        startDate: new Date(),
        endDate: new Date(),
        now: new Date(),
        expected: TaskStatusEnum.ACTIVE
      },
      {
        it: 'should return pending',
        startDate: new Date(Date.now() + 1000),
        endDate: new Date(Date.now() + 2000),
        now: new Date(),
        expected: TaskStatusEnum.PENDING
      },
      {
        it: 'should return pending - undefined values',
        startDate: undefined,
        endDate: undefined,
        now: new Date(),
        expected: TaskStatusEnum.PENDING
      },
      {
        it: 'should return finished',
        startDate: new Date(Date.now() - 2000),
        endDate: new Date(Date.now() - 1000),
        now: new Date(),
        expected: TaskStatusEnum.FINISHED
      },
      {
        it: 'should return finished - custom date',
        startDate: new Date(),
        endDate: new Date(Date.now() + 500),
        now: new Date(Date.now() + 1000),
        expected: TaskStatusEnum.FINISHED
      }
    ];

    testCases.forEach(testCase =>
      it(testCase.it, () => {
        const result = kabasTasksViewModel.getTaskStatus(
          testCase.startDate,
          testCase.endDate,
          testCase.now
        );

        expect(result).toBe(testCase.expected);
      })
    );
  });
});
