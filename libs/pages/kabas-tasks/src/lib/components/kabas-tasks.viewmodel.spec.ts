import { TestBed } from '@angular/core/testing';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  DalState,
  FavoriteActions,
  FavoriteTypesEnum,
  PersonFixture,
  TaskActions,
  TaskFixture
} from '@campus/dal';
import { MockDate } from '@campus/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';
import { AssigneeFixture } from '../interfaces/Assignee.fixture';
import { AssigneeTypesEnum } from '../interfaces/Assignee.interface';
import {
  TaskStatusEnum,
  TaskWithAssigneesInterface
} from '../interfaces/TaskWithAssignees.interface';
import { KabasTasksViewModel } from './kabas-tasks.viewmodel';

describe('KabasTaskViewModel', () => {
  const dateMock = new MockDate();

  afterAll(() => {
    dateMock.returnRealDate();
  });

  let kabasTasksViewModel: KabasTasksViewModel;
  let store: MockStore<DalState>;
  let authService: AuthServiceInterface;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        KabasTasksViewModel,
        provideMockStore(),
        {
          provide: AUTH_SERVICE_TOKEN,
          useValue: { userId: 1 }
        }
      ]
    });
  });

  beforeEach(() => {
    kabasTasksViewModel = TestBed.get(KabasTasksViewModel);
    store = TestBed.get(Store);
    authService = TestBed.get(AUTH_SERVICE_TOKEN);
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
        startDate: new Date(Date.now() - 2000),
        endDate: new Date(Date.now() - 1000),
        isPaperTask: false
      } as TaskWithAssigneesInterface;
    });

    it('should return false if pending', () => {
      taskAssignee.status = TaskStatusEnum.PENDING;
      const result = kabasTasksViewModel.canBeArchivedOrDeleted(taskAssignee);

      expect(result).toBeFalsy();
    });
    it('should return false if active', () => {
      taskAssignee.status = TaskStatusEnum.ACTIVE;
      const result = kabasTasksViewModel.canBeArchivedOrDeleted(taskAssignee);

      expect(result).toBeFalsy();
    });
    it('should return true if paper task', () => {
      taskAssignee = {
        ...taskAssignee,
        status: TaskStatusEnum.PENDING,
        isPaperTask: true
      } as TaskWithAssigneesInterface;
      const result = kabasTasksViewModel.canBeArchivedOrDeleted(taskAssignee);

      expect(result).toBeTruthy();
    });
    it('should return true if finished', () => {
      const result = kabasTasksViewModel.canBeArchivedOrDeleted(taskAssignee);
      expect(result).toBeTruthy();
    });
  });

  describe('setTaskAsArchived', () => {
    let taskAssignees;
    let dispatchSpy: jest.SpyInstance;

    const currentUser = new PersonFixture();
    beforeEach(() => {
      dispatchSpy = store.dispatch = jest.fn();

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
      const expected = new TaskActions.UpdateTasks({
        userId: currentUser.id,
        tasks: taskAssignees.map(task => ({
          id: task.id,
          changes: { archived: false }
        }))
      });

      kabasTasksViewModel.setTaskAsArchived(taskAssignees, false);

      expect(dispatchSpy).toHaveBeenCalledWith(expected);
    });

    it('should call dispatch with all tasks that can be archived', () => {
      const expected = new TaskActions.UpdateTasks({
        userId: currentUser.id,
        tasks: taskAssignees
          .filter(
            task =>
              task.isPaperTask ||
              task.status === TaskStatusEnum.FINISHED ||
              (!task.endDate && !task.startDate)
          )
          .map(task => ({
            id: task.id,
            changes: { archived: true }
          }))
      });

      kabasTasksViewModel.setTaskAsArchived(taskAssignees, true);

      expect(dispatchSpy).toHaveBeenCalledWith(expected);
    });
  });

  describe('updateTask', () => {
    let dispatchSpy: jest.SpyInstance;

    const currentUser = new PersonFixture();
    beforeEach(() => {
      dispatchSpy = store.dispatch = jest.fn();
    });

    it('should dispatch updateTask and updateAccess', () => {
      const task = new TaskFixture();
      const assignees = [
        new AssigneeFixture({ type: AssigneeTypesEnum.GROUP }),
        new AssigneeFixture({
          type: AssigneeTypesEnum.STUDENT
        }),
        new AssigneeFixture({
          type: AssigneeTypesEnum.CLASSGROUP
        })
      ];
      const [taskGroup, taskStudent, taskClassGroup] = assignees;

      kabasTasksViewModel.updateTask(task, assignees);

      expect(dispatchSpy.mock.calls).toEqual([
        [
          new TaskActions.UpdateTask({
            userId: currentUser.id,
            task: { id: task.id, changes: task }
          })
        ],
        [
          new TaskActions.UpdateAccess({
            userId: currentUser.id,
            taskId: task.id,
            taskGroups: [taskGroup],
            taskClassGroups: [taskClassGroup],
            taskStudents: [taskStudent]
          })
        ]
      ]);
    });
  });

  describe('createTask', () => {
    let dispatchSpy: jest.SpyInstance;

    const currentUser = new PersonFixture();
    beforeEach(() => {
      dispatchSpy = store.dispatch = jest.fn();
    });

    it('should dispatch an action', () => {
      kabasTasksViewModel.createTask('foo', 123, 'digital');

      expect(dispatchSpy).toHaveBeenCalledWith(
        new TaskActions.StartAddTask({
          task: { name: 'foo', learningAreaId: 123, isPaperTask: false },
          navigateAfterCreate: true,
          userId: currentUser.id
        })
      );
    });

    it('should dispatch an action', () => {
      kabasTasksViewModel.createTask('foo', 123, 'paper');

      expect(dispatchSpy).toHaveBeenCalledWith(
        new TaskActions.StartAddTask({
          task: { name: 'foo', learningAreaId: 123, isPaperTask: true },
          navigateAfterCreate: true,
          userId: currentUser.id
        })
      );
    });
  });

  describe('toggleFavorite', () => {
    it('should dispatch a toggleFavorite action', () => {
      const taskAssignee = {
        id: 1,
        name: 'favorite task',
        eduContentAmount: 1,
        assignees: [],
        status: TaskStatusEnum.FINISHED,
        isPaperTask: false
      } as TaskWithAssigneesInterface;

      const spy = jest.spyOn(store, 'dispatch');

      const expected = new FavoriteActions.ToggleFavorite({
        favorite: {
          created: new Date(),
          taskId: taskAssignee.id,
          name: taskAssignee.name,
          type: FavoriteTypesEnum.TASK
        }
      });

      kabasTasksViewModel.toggleFavorite(taskAssignee);

      expect(spy).toHaveBeenCalledWith(expected);
    });
  });

  describe('canDelete', () => {
    let taskAssignees;
    beforeEach(() => {
      taskAssignees = [
        {
          name: 'Task',
          eduContentAmount: 1,
          assignees: [],
          status: TaskStatusEnum.FINISHED,
          isPaperTask: false,
          startDate: new Date(Date.now() - 2000),
          endDate: new Date(Date.now() - 1000)
        },
        {
          name: 'Task2',
          eduContentAmount: 1,
          assignees: [],
          status: TaskStatusEnum.FINISHED,
          isPaperTask: false
        },

        {
          name: 'Task3',
          eduContentAmount: 1,
          assignees: [],
          status: TaskStatusEnum.ACTIVE,
          isPaperTask: false,
          startDate: new Date(Date.now() - 2000)
        },
        {
          name: 'Task4',
          eduContentAmount: 1,
          assignees: [],
          status: TaskStatusEnum.PENDING,
          isPaperTask: false,
          startDate: new Date(Date.now() - 2000)
        }
      ] as TaskWithAssigneesInterface[];
    });

    it('should return false if pending', () => {
      const result = kabasTasksViewModel.canBeArchivedOrDeleted(
        taskAssignees[3]
      );
      expect(result).toBeFalsy();
    });
    it('should return false if active', () => {
      const result = kabasTasksViewModel.canBeArchivedOrDeleted(
        taskAssignees[2]
      );

      expect(result).toBeFalsy();
    });

    it('should return true if finished', () => {
      const result = kabasTasksViewModel.canBeArchivedOrDeleted(
        taskAssignees[0]
      );
      expect(result).toBeTruthy();
    });

    it('should return true if no date is set', () => {
      const result = kabasTasksViewModel.canBeArchivedOrDeleted(
        taskAssignees[1]
      );
      expect(result).toBeTruthy();
    });
  });

  describe('deleteTasks', () => {
    let taskAssignees;
    beforeEach(() => {
      taskAssignees = [
        {
          id: 1,
          name: 'Finished Task',
          eduContentAmount: 1,
          assignees: [],
          status: TaskStatusEnum.FINISHED,
          isPaperTask: false,
          startDate: new Date(Date.now() - 2000),
          endDate: new Date(Date.now() - 1000)
        },
        {
          id: 2,
          name: 'Pending Task',
          eduContentAmount: 1,
          assignees: [],
          status: TaskStatusEnum.PENDING,
          isPaperTask: false,
          startDate: new Date(Date.now() - 2000)
        },
        {
          id: 3,
          name: 'Active Task',
          eduContentAmount: 1,
          assignees: [],
          isPaperTask: false
        }
      ] as TaskWithAssigneesInterface[];
    });

    it('should call dispatch with all tasks that can be deleted', () => {
      const spy = jest.spyOn(store, 'dispatch');
      const expected = new TaskActions.DeleteTasks({ ids: [1, 3] });

      kabasTasksViewModel.removeTasks(taskAssignees);

      expect(spy).toHaveBeenCalledWith(expected);
    });
  });
});
