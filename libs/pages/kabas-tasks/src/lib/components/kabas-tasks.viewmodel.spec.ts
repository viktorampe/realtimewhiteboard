import { TestBed } from '@angular/core/testing';
import { MAT_DATE_LOCALE } from '@angular/material';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  DalState,
  EffectFeedback,
  EffectFeedbackActions,
  FavoriteActions,
  FavoriteTypesEnum,
  PersonFixture,
  TaskActions,
  UserQueries
} from '@campus/dal';
import { MockDate } from '@campus/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';
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
  let uuid: Function;
  let dateLocale;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        KabasTasksViewModel,
        provideMockStore(),
        { provide: AUTH_SERVICE_TOKEN, useValue: { userId: 1 } },
        { provide: 'uuid', useValue: () => 'foo' },
        { provide: MAT_DATE_LOCALE, useValue: 'en-US' }
      ]
    });
  });

  beforeEach(() => {
    kabasTasksViewModel = TestBed.get(KabasTasksViewModel);
    authService = TestBed.get(AUTH_SERVICE_TOKEN);
    uuid = TestBed.get('uuid');
    store = TestBed.get(Store);
    dateLocale = TestBed.get(MAT_DATE_LOCALE);
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

  describe('canBeArchivedOrDeleted', () => {
    let taskAssignee;
    beforeEach(() => {
      taskAssignee = {
        name: 'Task',
        eduContentAmount: 1,
        assignees: [],
        status: TaskStatusEnum.FINISHED,
        isPaperTask: false,
        endDate: new Date(),
        startDate: new Date()
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
    it('should return true if no end or start date set, while active', () => {
      const withoutDate = {
        ...taskAssignee,
        endDate: undefined,
        startDate: undefined
      };

      const result = kabasTasksViewModel.canBeArchivedOrDeleted(withoutDate);

      expect(result).toBeTruthy();
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

  describe('createTask', () => {
    let dispatchSpy: jest.SpyInstance;

    const currentUser = new PersonFixture();
    beforeEach(() => {
      dispatchSpy = store.dispatch = jest.fn();
      store.overrideSelector(UserQueries.getCurrentUser, currentUser);
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

  describe('startArchivingTasks', () => {
    let taskAssignees;
    beforeEach(() => {
      taskAssignees = [
        {
          id: 1,
          name: 'Finished Task',
          eduContentAmount: 1,
          assignees: [],
          status: TaskStatusEnum.FINISHED,
          startDate: new Date(Date.now() - 1000),
          endDate: new Date(Date.now() - 500),
          isPaperTask: false
        },
        {
          id: 2,
          name: 'Pending Task',
          eduContentAmount: 1,
          assignees: [],
          status: TaskStatusEnum.PENDING,
          startDate: new Date(Date.now() - 1000),
          endDate: new Date(Date.now() + 1000),
          isPaperTask: false
        },
        {
          id: 3,
          name: 'Active Task',
          eduContentAmount: 1,
          assignees: [],
          status: TaskStatusEnum.ACTIVE,
          startDate: new Date(Date.now() - 1000),
          endDate: new Date(Date.now() + 1000),
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
    /* -- HELPERS -- */
    const mapToUpdate = task => ({ id: task.id, changes: { archived: true } });
    const canArchive = ta =>
      ta.status === TaskStatusEnum.FINISHED || (!ta.endDate && !ta.startDate);
    const messages = errors =>
      errors
        .map(error => {
          const activeUntil = error.endDate
            ? ` Deze taak is nog actief tot ${error.endDate.toLocaleDateString(
                dateLocale
              )}.`
            : '';
          return `<li>${error.name} kan niet worden gearchiveerd.${activeUntil}</li>`;
        })
        .join('');
    describe('archive', () => {
      it('should dispatch update when no errors detected', () => {
        const spy = jest.spyOn(store, 'dispatch');
        const tasks = taskAssignees.filter(
          ta => ta.status === TaskStatusEnum.FINISHED
        );
        const updateAction = new TaskActions.StartArchiveTasks({
          userId: authService.userId,
          tasks: tasks.map(mapToUpdate)
        });
        kabasTasksViewModel.startArchivingTasks(tasks, true);
        expect(spy).toHaveBeenCalledWith(updateAction);
      });
      it('should dispatch feedback with userActions when mixed errors and updates', () => {
        const spy = jest.spyOn(store, 'dispatch');
        const updates = taskAssignees.filter(ta => !ta.isPaperTask);
        const errors = updates.filter(ta => !canArchive(ta));
        const updateAction = new TaskActions.StartArchiveTasks({
          userId: authService.userId,
          tasks: updates.filter(canArchive).map(mapToUpdate)
        });
        const effectFeedback = new EffectFeedback({
          id: uuid(),
          triggerAction: updateAction,
          message:
            `<p>Niet alle taken kunnen gearchiveerd worden:</p>` +
            `<ul>${messages(errors)}</ul>`,
          userActions: [
            { title: 'Archiveer de andere taken', userAction: updateAction }
          ],
          type: 'error'
        });
        const feedbackAction = new EffectFeedbackActions.AddEffectFeedback({
          effectFeedback
        });
        kabasTasksViewModel.startArchivingTasks(updates, true);
        expect(spy).toHaveBeenCalledWith(feedbackAction);
      });
      it('should dispatch feedback without userActions when only errors occurred', () => {
        const spy = jest.spyOn(store, 'dispatch');
        const errors = taskAssignees.filter(ta => !canArchive(ta));
        const updateAction = new TaskActions.StartArchiveTasks({
          userId: authService.userId,
          tasks: []
        });
        const effectFeedback = new EffectFeedback({
          id: uuid(),
          triggerAction: updateAction,
          message:
            `<p>Niet alle taken kunnen gearchiveerd worden:</p>` +
            `<ul>${messages(errors)}</ul>`,
          userActions: [],
          type: 'error'
        });
        const feedbackAction = new EffectFeedbackActions.AddEffectFeedback({
          effectFeedback
        });
        kabasTasksViewModel.startArchivingTasks(errors, true);
        expect(spy).toHaveBeenCalledWith(feedbackAction);
      });
    });
    describe('dearchive', () => {
      it('should dispatch update, all tasks should pass', () => {
        const spy = jest.spyOn(store, 'dispatch');
        const tasks = taskAssignees;
        const updateAction = new TaskActions.StartArchiveTasks({
          userId: authService.userId,
          tasks: tasks.map(task => ({
            id: task.id,
            changes: { archived: false }
          }))
        });
        kabasTasksViewModel.startArchivingTasks(tasks, false);
        expect(spy).toHaveBeenCalledWith(updateAction);
      });
    });
  });
});
