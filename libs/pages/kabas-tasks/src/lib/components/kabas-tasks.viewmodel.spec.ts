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
  getRouterState,
  PersonFixture,
  TaskActions,
  UserQueries
} from '@campus/dal';
import { MockDate } from '@campus/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from '@nrwl/angular/testing';
import { configureTestSuite } from 'ng-bullet';
import {
  TaskStatusEnum,
  TaskWithAssigneesInterface
} from '../interfaces/TaskWithAssignees.interface';
import { KabasTasksViewModel } from './kabas-tasks.viewmodel';

describe('KabasTaskViewModel', () => {
  const dateMock = new MockDate();
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

  afterAll(() => {
    dateMock.returnRealDate();
  });

  describe('creation', () => {
    it('should be defined', () => {
      expect(kabasTasksViewModel).toBeDefined();
    });
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

  describe('currentTaskParams', () => {
    it('should contain the id of the current task when in a task', () => {
      store.overrideSelector(getRouterState, {
        navigationId: 1,
        state: {
          url: '',
          params: {
            id: '1'
          }
        }
      });

      expect(kabasTasksViewModel.currentTaskParams$).toBeObservable(
        hot('a', {
          a: { id: 1 }
        })
      );
    });

    it('should contain undefined for the id if not set', () => {
      store.overrideSelector(getRouterState, {
        navigationId: 1,
        state: {
          url: '',
          params: {}
        }
      });

      expect(kabasTasksViewModel.currentTaskParams$).toBeObservable(
        hot('a', {
          a: { id: undefined }
        })
      );
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
