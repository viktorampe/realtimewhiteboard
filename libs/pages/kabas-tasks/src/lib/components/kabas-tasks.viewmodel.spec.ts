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
  const dateMock = new MockDate();

  afterAll(() => {
    dateMock.returnRealDate();
  });

  let kabasTasksViewModel: KabasTasksViewModel;

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

  beforeEach(() => {
    kabasTasksViewModel = TestBed.get(KabasTasksViewModel);
  });

  describe('creation', () => {
    it('should be defined', () => {
      expect(kabasTasksViewModel).toBeDefined();
    });
  });

  describe('getTaskDates', () => {
    const testCases = [
      {
        it: 'should use the correct start and end date',
        assignees: [{ start: new Date(), end: new Date() }],
        expectedStart: new Date(),
        expectedEnd: new Date()
      },
      {
        it: 'should use the correct start and end date',
        assignees: [
          { start: new Date(), end: new Date() },
          {
            start: new Date(Date.now() - 1000),
            end: new Date(Date.now() + 1000)
          }
        ],
        expectedStart: new Date(Date.now() - 1000),
        expectedEnd: new Date(Date.now() + 1000)
      },
      {
        it: 'should use the correct start and end date',
        assignees: [
          { start: new Date(), end: new Date() },
          {
            start: new Date(Date.now() + 1000),
            end: new Date(Date.now() + 1000)
          }
        ],
        expectedStart: new Date(),
        expectedEnd: new Date(Date.now() + 1000)
      },
      {
        it: 'should use the correct start and end date',
        assignees: [
          { start: new Date(), end: new Date() },
          {
            start: new Date(Date.now() + 1000),
            end: new Date(Date.now() + 1000)
          },
          {
            start: new Date(Date.now() - 1000),
            end: new Date(Date.now() - 1000)
          }
        ],
        expectedStart: new Date(Date.now() - 1000),
        expectedEnd: new Date(Date.now() + 1000)
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
