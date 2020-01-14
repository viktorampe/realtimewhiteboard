import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  CustomSerializer,
  DalState,
  getStoreModuleForFeatures,
  TaskActions,
  TaskReducer,
  UserQueries
} from '@campus/dal';
import { MockDate } from '@campus/testing';
import {
  NavigationActionTiming,
  routerReducer,
  StoreRouterConnectingModule
} from '@ngrx/router-store';
import { Store, StoreModule } from '@ngrx/store';
import { configureTestSuite } from 'ng-bullet';
import {
  TaskStatusEnum,
  TaskWithAssigneesInterface
} from '../interfaces/TaskWithAssignees.interface';
import { PersonFixture } from './../../../../../dal/src/lib/+fixtures/Person.fixture';
import { KabasTasksViewModel } from './kabas-tasks.viewmodel';

describe('KabasTaskViewModel', () => {
  const dateMock = new MockDate();

  afterAll(() => {
    dateMock.returnRealDate();
  });

  let kabasTasksViewModel: KabasTasksViewModel;
  let store: Store<DalState>;

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
      providers: [KabasTasksViewModel, Store]
    });
  });

  beforeEach(() => {
    kabasTasksViewModel = TestBed.get(KabasTasksViewModel);
    store = TestBed.get(Store);
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

  describe('canArchive', () => {
    let taskAssignee;
    beforeEach(() => {
      taskAssignee = {
        name: 'Task',
        eduContentAmount: 1,
        assignees: [],
        status: TaskStatusEnum.FINISHED,
        isPaperTask: false
      } as TaskWithAssigneesInterface;
    });

    it('should return false if pending', () => {
      taskAssignee.status = TaskStatusEnum.PENDING;
      const result = kabasTasksViewModel.canArchive(taskAssignee);

      expect(result).toBeFalsy();
    });
    it('should return false if active', () => {
      taskAssignee.status = TaskStatusEnum.ACTIVE;
      const result = kabasTasksViewModel.canArchive(taskAssignee);

      expect(result).toBeFalsy();
    });
    it('should return true if paper task', () => {
      taskAssignee = {
        ...taskAssignee,
        status: TaskStatusEnum.PENDING,
        isPaperTask: true
      } as TaskWithAssigneesInterface;
      const result = kabasTasksViewModel.canArchive(taskAssignee);

      expect(result).toBeTruthy();
    });
    it('should return true if finished', () => {
      const result = kabasTasksViewModel.canArchive(taskAssignee);
      expect(result).toBeTruthy();
    });
  });

  describe('setTaskAsArchived', () => {
    let taskAssignees;
    beforeEach(() => {
      taskAssignees = [
        {
          id: 1,
          name: 'Finished Task',
          eduContentAmount: 1,
          assignees: [],
          status: TaskStatusEnum.FINISHED,
          isPaperTask: false
        },
        {
          id: 2,
          name: 'Pending Task',
          eduContentAmount: 1,
          assignees: [],
          status: TaskStatusEnum.PENDING,
          isPaperTask: false
        },
        {
          id: 3,
          name: 'Active Task',
          eduContentAmount: 1,
          assignees: [],
          status: TaskStatusEnum.ACTIVE,
          isPaperTask: false
        },
        {
          id: 3,
          name: 'Paper Task',
          eduContentAmount: 1,
          assignees: [],
          isPaperTask: true
        }
      ] as TaskWithAssigneesInterface[];
    });

    it('should call dispatch with all tasks when tasks will be unarchived', () => {
      const spy = jest.spyOn(store, 'dispatch');
      const expected = new TaskActions.UpdateTasks({
        tasks: taskAssignees.map(task => ({
          id: task.id,
          changes: { archived: false }
        }))
      });

      kabasTasksViewModel.setTaskAsArchived(taskAssignees, false);

      expect(spy).toHaveBeenCalledWith(expected);
    });

    it('should call dispatch with all tasks that can be archived', () => {
      const spy = jest.spyOn(store, 'dispatch');
      const expected = new TaskActions.UpdateTasks({
        tasks: taskAssignees
          .filter(
            task => task.isPaperTask || task.status === TaskStatusEnum.FINISHED
          )
          .map(task => ({
            id: task.id,
            changes: { archived: true }
          }))
      });

      kabasTasksViewModel.setTaskAsArchived(taskAssignees, true);

      expect(spy).toHaveBeenCalledWith(expected);
    });
  });

  describe('createTask', () => {
    let dispatchSpy: jest.SpyInstance;

    const currentUser = new PersonFixture();
    beforeEach(() => {
      dispatchSpy = store.dispatch = jest.fn();
      UserQueries.getCurrentUser.projector = jest
        .fn()
        .mockReturnValue(currentUser);
    });

    it('should dispatch an action', () => {
      kabasTasksViewModel.createTask('foo', 123, 'digital');

      expect(dispatchSpy).toHaveBeenCalledWith(
        // TODO typescript
        new TaskActions['StartAddTask']({
          task: { name: 'foo', learningAreaId: 123, isPaperTask: false },
          navigateAfterCreate: true,
          userId: currentUser.id
        })
      );
    });

    it('should dispatch an action', () => {
      kabasTasksViewModel.createTask('foo', 123, 'paper');

      expect(dispatchSpy).toHaveBeenCalledWith(
        // TODO typescript
        new TaskActions['StartAddTask']({
          task: { name: 'foo', learningAreaId: 123, isPaperTask: true },
          navigateAfterCreate: true,
          userId: currentUser.id
        })
      );
    });
  });
});
