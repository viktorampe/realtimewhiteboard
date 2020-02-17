import { TestBed } from '@angular/core/testing';
import { MAT_DATE_LOCALE } from '@angular/material';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  DalState,
  EduContentBookFixture,
  EduContentFixture,
  EduContentMetadataFixture,
  EduContentServiceInterface,
  EduFileFixture,
  EduFileTypeEnum,
  EDU_CONTENT_SERVICE_TOKEN,
  EffectFeedback,
  EffectFeedbackActions,
  FavoriteActions,
  FavoriteTypesEnum,
  getRouterState,
  PersonFixture,
  TaskActions,
  TaskEduContentActions,
  TaskEduContentFixture,
  TaskFixture,
  TaskServiceInterface,
  TASK_SERVICE_TOKEN,
  UserQueries,
  YearFixture
} from '@campus/dal';
import {
  SearchModeFixture,
  SearchStateFixture,
  SearchStateInterface
} from '@campus/search';
import {
  EduContentTypeEnum,
  ENVIRONMENT_API_TOKEN,
  ENVIRONMENT_SEARCHMODES_TOKEN,
  OpenStaticContentServiceInterface,
  OPEN_STATIC_CONTENT_SERVICE_TOKEN,
  ScormExerciseServiceInterface,
  SCORM_EXERCISE_SERVICE_TOKEN
} from '@campus/shared';
import { MockDate } from '@campus/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jasmine-marbles';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { AssigneeFixture } from '../interfaces/Assignee.fixture';
import { AssigneeTypesEnum } from '../interfaces/Assignee.interface';
import { TaskWithAssigneesFixture } from '../interfaces/TaskWithAssignees.fixture';
import {
  TaskStatusEnum,
  TaskWithAssigneesInterface
} from '../interfaces/TaskWithAssignees.interface';
import { KabasTasksViewModel } from './kabas-tasks.viewmodel';
import { getTaskWithAssignmentAndEduContents } from './kabas-tasks.viewmodel.selectors';

describe('KabasTaskViewModel', () => {
  const dateMock = new MockDate();
  const userId = 1;
  let kabasTasksViewModel: KabasTasksViewModel;
  let store: MockStore<DalState>;
  let authService: AuthServiceInterface;
  let uuid: Function;
  let dateLocale;
  let taskService: TaskServiceInterface;
  let scormExerciseService: ScormExerciseServiceInterface;
  let openStaticContentService: OpenStaticContentServiceInterface;
  let eduContentService: EduContentServiceInterface;

  const apiBase = 'api.foo.be';
  const mockAutoCompleteReturnValue = ['strings', 'for', 'autocomplete'];

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        KabasTasksViewModel,
        provideMockStore(),
        { provide: AUTH_SERVICE_TOKEN, useValue: { userId } },
        { provide: 'uuid', useValue: () => 'foo' },
        { provide: MAT_DATE_LOCALE, useValue: 'en-US' },
        {
          provide: TASK_SERVICE_TOKEN,
          useValue: {
            printTask: jest.fn(),
            printSolution: jest.fn()
          }
        },
        {
          provide: SCORM_EXERCISE_SERVICE_TOKEN,
          useValue: {
            previewExerciseFromTask: jest.fn()
          }
        },
        {
          provide: OPEN_STATIC_CONTENT_SERVICE_TOKEN,
          useValue: {
            open: jest.fn()
          }
        },
        {
          provide: EDU_CONTENT_SERVICE_TOKEN,
          useValue: {
            search: () => {},
            autoComplete: () => {}
          }
        },
        {
          provide: ENVIRONMENT_SEARCHMODES_TOKEN,
          useValue: {
            demo: new SearchModeFixture()
          }
        },
        {
          provide: ENVIRONMENT_API_TOKEN,
          useValue: {
            APIBase: apiBase
          }
        }
      ]
    });
  });

  beforeEach(() => {
    kabasTasksViewModel = TestBed.get(KabasTasksViewModel);
    authService = TestBed.get(AUTH_SERVICE_TOKEN);
    uuid = TestBed.get('uuid');
    store = TestBed.get(Store);
    dateLocale = TestBed.get(MAT_DATE_LOCALE);
    taskService = TestBed.get(TASK_SERVICE_TOKEN);
    scormExerciseService = TestBed.get(SCORM_EXERCISE_SERVICE_TOKEN);
    openStaticContentService = TestBed.get(OPEN_STATIC_CONTENT_SERVICE_TOKEN);
    eduContentService = TestBed.get(EDU_CONTENT_SERVICE_TOKEN);
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

  describe('getDeleteInfo()', () => {
    function messages(errors: TaskWithAssigneesInterface[]): string {
      return errors
        .map(error => {
          const activeUntil = error.endDate
            ? ` Deze taak is nog actief tot ${error.endDate.toLocaleDateString(
                dateLocale
              )}.`
            : '';
          return `<li>${error.name} kan niet worden verwijderd.${activeUntil}</li>`;
        })
        .join('');
    }

    const tasksThatCanBeDeleted: TaskWithAssigneesInterface[] = [
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
        id: 4,
        name: 'Paper Task',
        eduContentAmount: 1,
        assignees: [],
        isPaperTask: true
      }
    ];

    const tasksThatCanNotBeDeleted: TaskWithAssigneesInterface[] = [
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
      }
    ];

    let tasksReadyForDeletion: TaskWithAssigneesInterface[];

    it('should return info for mixed tasks', () => {
      tasksReadyForDeletion = [
        ...tasksThatCanBeDeleted,
        ...tasksThatCanNotBeDeleted
      ];

      const expected = {
        deletableTasks: [tasksReadyForDeletion[0], tasksReadyForDeletion[1]],
        message: `<p>Niet alle taken kunnen verwijderd worden:</p><ul>${messages(
          [tasksReadyForDeletion[2], tasksReadyForDeletion[3]]
        )}</ul><p>Ben je zeker dat je de andere taken wil verwijderen?</p>`,
        disableConfirmButton: false
      };
      const result = kabasTasksViewModel.getDeleteInfo(tasksReadyForDeletion);

      expect(result).toEqual(expected);
    });

    it('should return info for tasks that can be deleted', () => {
      tasksReadyForDeletion = tasksThatCanBeDeleted;

      const expected = {
        deletableTasks: [tasksReadyForDeletion[0], tasksReadyForDeletion[1]],
        message: `<p>Ben je zeker dat je de geselecteerde taken wil verwijderen?</p>`,
        disableConfirmButton: false
      };
      const result = kabasTasksViewModel.getDeleteInfo(tasksReadyForDeletion);

      expect(result).toEqual(expected);
    });

    it('should return info for tasks that can not be deleted', () => {
      tasksReadyForDeletion = tasksThatCanNotBeDeleted;

      const expected = {
        deletableTasks: [],
        message: `<p>Niet alle taken kunnen verwijderd worden:</p><ul>${messages(
          tasksReadyForDeletion
        )}</ul><p>Ben je zeker dat je de geselecteerde taken wil verwijderen?</p>`,
        disableConfirmButton: true
      };
      const result = kabasTasksViewModel.getDeleteInfo(tasksReadyForDeletion);

      expect(result).toEqual(expected);
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

  describe('updateTask', () => {
    it('should dispatch an UpdateAction', () => {
      const spy = jest.spyOn(store, 'dispatch');
      const task = new TaskFixture();
      kabasTasksViewModel.updateTask(task);

      expect(spy).toHaveBeenCalledWith(
        new TaskActions.UpdateTask({
          userId: authService.userId,
          task: { id: task.id, changes: { ...task } }
        })
      );
    });
  });

  describe('updateTaskEduContentsOrder', () => {
    it('should dispatch an UpdateTaskEduContents action', () => {
      const spy = jest.spyOn(store, 'dispatch');
      const taskEduContents = [
        new TaskEduContentFixture({ id: 1, index: 1, taskId: 1 }),
        new TaskEduContentFixture({ id: 3, index: 2, taskId: 3 }),
        new TaskEduContentFixture({ id: 2, index: 3, taskId: 2 })
      ];
      kabasTasksViewModel.updateTaskEduContentsOrder(taskEduContents);
      expect(spy).toHaveBeenCalledWith(
        new TaskEduContentActions.UpdateTaskEduContents({
          userId: authService.userId,
          taskEduContents: [
            { id: 1, changes: { id: 1, index: 0, taskId: 1 } },
            { id: 3, changes: { id: 3, index: 1, taskId: 3 } },
            { id: 2, changes: { id: 2, index: 2, taskId: 2 } }
          ]
        })
      );
    });
  });

  describe('updateTaskAccess', () => {
    it('should dispatch an UpdateAction', () => {
      const spy = jest.spyOn(store, 'dispatch');
      const task = new TaskFixture();
      const taskGroup = new AssigneeFixture({ type: AssigneeTypesEnum.GROUP });
      const taskStudent = new AssigneeFixture({
        type: AssigneeTypesEnum.STUDENT
      });
      const taskClassGroup = new AssigneeFixture({
        type: AssigneeTypesEnum.CLASSGROUP
      });

      kabasTasksViewModel.updateTaskAccess(task, [
        taskGroup,
        taskStudent,
        taskClassGroup
      ]);

      const expectedTaskClassGroup = {
        id: taskClassGroup.id,
        start: taskClassGroup.start,
        end: taskClassGroup.end,
        taskId: task.id,
        classGroupId: taskClassGroup.relationId
      };
      const expectedTaskGroup = {
        id: taskGroup.id,
        start: taskGroup.start,
        end: taskGroup.end,
        taskId: task.id,
        groupId: taskGroup.relationId
      };
      const expectedTaskStudent = {
        id: taskStudent.id,
        start: taskStudent.start,
        end: taskStudent.end,
        taskId: task.id,
        personId: taskStudent.relationId
      };

      expect(spy).toHaveBeenCalledWith(
        new TaskActions.UpdateAccess({
          userId: authService.userId,
          taskId: task.id,
          taskGroups: [expectedTaskGroup],
          taskStudents: [expectedTaskStudent],
          taskClassGroups: [expectedTaskClassGroup]
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
          },
          queryParams: {}
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
          params: {},
          queryParams: {}
        }
      });

      expect(kabasTasksViewModel.currentTaskParams$).toBeObservable(
        hot('a', {
          a: { id: undefined }
        })
      );
    });

    it('should contain the queryparam ids', () => {
      store.overrideSelector(getRouterState, {
        navigationId: 1,
        state: {
          url: '',
          params: {
            id: '1'
          },
          queryParams: {
            book: 2,
            lesson: 3,
            chapter: 4
          }
        }
      });

      expect(kabasTasksViewModel.currentTaskParams$).toBeObservable(
        hot('a', {
          a: { id: 1, book: 2, lesson: 3, chapter: 4 }
        })
      );
    });
  });

  describe('currentTask$', () => {
    const currentTaskParams = { id: 1 };
    const expectedTask = {
      ...new TaskFixture({ id: 1, isPaperTask: true }), // this is the current task!!
      eduContentAmount: 1,
      assignees: [],
      taskEduContents: [
        new TaskEduContentFixture({ id: 1, eduContentId: 1 }) // this eduContent should be included
      ]
    };

    beforeEach(() => {
      store.overrideSelector(getRouterState, {
        navigationId: 1,
        state: {
          url: '',
          params: currentTaskParams,
          queryParams: {}
        }
      });
      store.overrideSelector(getTaskWithAssignmentAndEduContents, expectedTask);
    });

    it('should return the current task with related eduContents', () => {
      expect(kabasTasksViewModel.currentTask$).toBeObservable(
        hot('a', {
          a: expectedTask
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

  describe('removeTasks', () => {
    let taskAssignees: TaskWithAssigneesInterface[];
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
          id: 4,
          name: 'Paper Task',
          eduContentAmount: 1,
          assignees: [],
          isPaperTask: true
        }
      ] as TaskWithAssigneesInterface[];
    });
    /* -- HELPERS -- */
    const mapToTaskIds = task => task.id as number;

    it('should dispatch delete when no errors detected', () => {
      const spy = jest.spyOn(store, 'dispatch');
      const tasks = taskAssignees.filter(
        ta => ta.status === TaskStatusEnum.FINISHED
      );
      const destroyAction = new TaskActions.StartDeleteTasks({
        userId: authService.userId,
        ids: tasks.map(mapToTaskIds)
      });
      kabasTasksViewModel.removeTasks(tasks);
      expect(spy).toHaveBeenCalledWith(destroyAction);
    });
  });

  describe('delete TaskEduContents', () => {
    const taskEduContents = [
      new TaskEduContentFixture({ id: 1 }),
      new TaskEduContentFixture({ id: 2 }),
      new TaskEduContentFixture({ id: 3 })
    ];

    it('should dispatch deleteTaskEduContent', () => {
      const spy = jest.spyOn(store, 'dispatch');
      const taskEduContentIds = taskEduContents.map(tec => tec.id);
      const destroyAction = new TaskEduContentActions.StartDeleteTaskEduContents(
        {
          userId: authService.userId,
          taskEduContentIds
        }
      );
      kabasTasksViewModel.deleteTaskEduContents(taskEduContentIds);
      expect(spy).toHaveBeenCalledWith(destroyAction);
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

  describe('printTask', () => {
    it('should call the service with the right arguments', () => {
      kabasTasksViewModel.printTask(1, true);

      expect(taskService.printTask).toHaveBeenCalledWith(1, true);
    });
  });

  describe('printSolution', () => {
    it('should dispatch an print-paper-task-solution action', () => {
      const spy = jest.spyOn(store, 'dispatch');

      const task = new TaskFixture({
        id: 666,
        taskEduContents: [
          new TaskEduContentFixture({
            eduContent: new EduContentFixture(
              {},
              new EduContentMetadataFixture({
                eduFiles: [
                  new EduFileFixture({ type: EduFileTypeEnum.SOLUTION })
                ]
              })
            )
          })
        ]
      }) as TaskWithAssigneesInterface;
      kabasTasksViewModel.printSolution(task);

      const expectedAction = new TaskActions.PrintPaperTaskSolution({
        task
      });
      expect(spy).toHaveBeenCalledWith(expectedAction);
    });
  });

  describe('updateTaskEduContentRequired', () => {
    it('should dispatch an UpdateTaskEduContents action', () => {
      const spy = jest.spyOn(store, 'dispatch');
      const taskEduContents = [
        new TaskEduContentFixture({ id: 1, required: false, taskId: 1 }),
        new TaskEduContentFixture({ id: 2, required: false, taskId: 2 }),
        new TaskEduContentFixture({ id: 3, required: false, taskId: 3 })
      ];
      kabasTasksViewModel.updateTaskEduContentsRequired(taskEduContents, true);
      expect(spy).toHaveBeenCalledWith(
        new TaskEduContentActions.UpdateTaskEduContents({
          userId: authService.userId,
          taskEduContents: [
            { id: 1, changes: { id: 1, required: true, taskId: 1 } },
            { id: 2, changes: { id: 2, required: true, taskId: 2 } },
            { id: 3, changes: { id: 3, required: true, taskId: 3 } }
          ]
        })
      );
    });
  });

  describe('edu-content action handlers', () => {
    const mockEduContent = new EduContentFixture();
    const taskId = 5;

    beforeEach(() => {
      store.overrideSelector(getRouterState, {
        navigationId: 1,
        state: {
          url: '',
          params: { id: taskId },
          queryParams: {}
        }
      });
      store.overrideSelector(getTaskWithAssignmentAndEduContents, {
        id: taskId
      } as any);
    });

    describe('openEduContentAsExercise', () => {
      it('should call scormExerciseService.previewExerciseFromTask()', () => {
        kabasTasksViewModel.openEduContentAsExercise(mockEduContent);
        expect(
          scormExerciseService.previewExerciseFromTask
        ).toHaveBeenCalledWith(userId, mockEduContent.id, taskId, false);
      });
    });

    describe('openEduContentAsSolution', () => {
      it('should call scormExerciseService.previewExerciseFromTask()', () => {
        kabasTasksViewModel.openEduContentAsSolution(mockEduContent);
        expect(
          scormExerciseService.previewExerciseFromTask
        ).toHaveBeenCalledWith(userId, mockEduContent.id, taskId, true);
      });
    });

    describe('openEduContentAsStream', () => {
      it('should call openStaticContentService.open()', () => {
        kabasTasksViewModel.openEduContentAsStream(mockEduContent);
        expect(openStaticContentService.open).toHaveBeenCalledWith(
          mockEduContent,
          true
        );
      });
    });

    describe('openEduContentAsDownload', () => {
      it('should call openStaticContentService.open()', () => {
        kabasTasksViewModel.openEduContentAsDownload(mockEduContent);
        expect(openStaticContentService.open).toHaveBeenCalledWith(
          mockEduContent,
          false
        );
      });
    });

    describe('openBoeke', () => {
      it('should call openStaticContentService.open()', () => {
        kabasTasksViewModel.openBoeke(mockEduContent);
        expect(openStaticContentService.open).toHaveBeenCalledWith(
          mockEduContent
        );
      });
    });

    describe('previewEduContentAsImage', () => {
      it('should call openStaticContentService.open()', () => {
        kabasTasksViewModel.previewEduContentAsImage(mockEduContent);
        expect(openStaticContentService.open).toHaveBeenCalledWith(
          mockEduContent,
          false,
          true
        );
      });
    });
  });

  describe('search', () => {
    describe('getInitialSearchState', () => {
      const taskId = 1;

      const digitalEduContentTypes = [
        EduContentTypeEnum.BOEKE,
        EduContentTypeEnum.LINK,
        EduContentTypeEnum.EXERCISE,
        EduContentTypeEnum.FILE,
        EduContentTypeEnum.WEB_APP,
        EduContentTypeEnum.TIMELINE
      ];

      const testcases = [
        {
          description: 'should return the correct searchState',
          setup: {
            task: new TaskWithAssigneesFixture(),
            searchBook: null
          },
          expected: {
            selections: [
              ['learningArea', [4]],
              ['eduContent.type', digitalEduContentTypes]
            ] as any[],
            options: [['taskAllowed', true]] as any[]
          }
        },
        {
          description: 'should return the correct searchState - paper task',
          setup: {
            task: new TaskWithAssigneesFixture({
              isPaperTask: true
            }),
            searchBook: null
          },
          expected: {
            selections: [
              ['learningArea', [4]],
              ['eduContent.type', [EduContentTypeEnum.PAPER_EXERCISE]]
            ] as any[],
            options: [['taskAllowed', true]] as any[]
          }
        },
        {
          description:
            'should return the correct searchState - when book is set',
          setup: {
            task: new TaskWithAssigneesFixture(),
            searchBook: new EduContentBookFixture({
              years: [new YearFixture({ id: 2 }), new YearFixture({ id: 3 })],
              methodId: 7
            })
          },
          expected: {
            selections: [
              ['learningArea', [4]],
              ['eduContent.type', digitalEduContentTypes],
              ['years', [2, 3]],
              ['methods', [7]]
            ] as any[],
            options: [['taskAllowed', true]] as any[]
          }
        }
      ];

      testcases.forEach(testcase =>
        it(testcase.description, () => {
          store.overrideSelector(getRouterState, {
            navigationId: 1,
            state: {
              url: '',
              params: { id: taskId },
              queryParams: {}
            }
          });
          store.overrideSelector(
            getTaskWithAssignmentAndEduContents,
            testcase.setup.task
          );
          kabasTasksViewModel.searchBook$.next(testcase.setup.searchBook);

          const initialSearchState$ = kabasTasksViewModel.getInitialSearchState();
          const expected: SearchStateInterface = {
            searchTerm: '',
            filterCriteriaSelections: new Map<string, number[]>(
              testcase.expected.selections
            ),
            filterCriteriaOptions: new Map<string, string | number | boolean>(
              testcase.expected.options
            )
          };

          expect(initialSearchState$).toBeObservable(hot('a', { a: expected }));
        })
      );
    });

    describe('updateSearchState', () => {
      it('should emit the value in the searchState$', () => {
        const mockSearchState = {} as SearchStateInterface;

        kabasTasksViewModel.updateSearchState(mockSearchState);
        expect(kabasTasksViewModel.searchState$).toBeObservable(
          hot('a', { a: mockSearchState })
        );
      });
    });

    describe('requestAutoComplete', () => {
      it('should call getInitialSearchState', () => {
        const getInitialSearchStateSpy = jest.spyOn(
          kabasTasksViewModel,
          'getInitialSearchState'
        );
        kabasTasksViewModel.requestAutoComplete('some string');
        expect(getInitialSearchStateSpy).toHaveBeenCalledTimes(1);
      });

      it('should call the eduContentService.autoComplete with the correct parameters and return a string[] observable', () => {
        const getInitialSearchStateSpy = jest
          .spyOn(kabasTasksViewModel, 'getInitialSearchState')
          .mockReturnValue(of(new SearchStateFixture()));

        const getAutoCompleteSpy = jest
          .spyOn(eduContentService, 'autoComplete')
          .mockReturnValue(of(mockAutoCompleteReturnValue));

        expect(
          kabasTasksViewModel.requestAutoComplete('some string')
        ).toBeObservable(hot('(a|)', { a: mockAutoCompleteReturnValue }));

        expect(getAutoCompleteSpy).toHaveBeenCalledTimes(1);
        expect(getAutoCompleteSpy).toHaveBeenCalledWith({
          searchTerm: 'some string',
          filterCriteriaSelections: new Map<string, (number | string)[]>([]),
          filterCriteriaOptions: new Map<string, number | string | boolean>()
        });
      });
    });
  });

  describe('addTaskEduContents', () => {
    const taskEduContents = [
      new TaskEduContentFixture(),
      new TaskEduContentFixture()
    ];

    it('should dispatch an action', () => {
      store.dispatch = jest.fn();

      kabasTasksViewModel.addTaskEduContents(taskEduContents);

      expect(store.dispatch).toHaveBeenCalledWith(
        new TaskEduContentActions.StartAddTaskEduContents({
          userId,
          taskEduContents
        })
      );
    });
  });
});
