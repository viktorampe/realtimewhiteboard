import { TestBed } from '@angular/core/testing';
import {
  AlertActions,
  AlertService,
  AUTH_SERVICE_TOKEN,
  DalState,
  EduContentActions,
  EduContentFixture,
  EduContentInterface,
  EduContentReducer,
  getStoreModuleForFeatures,
  HistoryActions,
  HistoryInterface,
  HistoryTypesEnum,
  LearningAreaActions,
  LearningAreaFixture,
  LearningAreaInterface,
  LearningAreaReducer,
  LinkedPersonActions,
  LinkedPersonReducer,
  PersonFixture,
  PersonInterface,
  TaskActions,
  TaskEduContentActions,
  TaskEduContentFixture,
  TaskEduContentInterface,
  TaskEduContentReducer,
  TaskFixture,
  TaskInstanceActions,
  TaskInstanceFixture,
  TaskInstanceInterface,
  TaskInstanceReducer,
  TaskInterface,
  TaskReducer,
  UiActions,
  UiReducer
} from '@campus/dal';
import {
  PERMISSION_SERVICE_TOKEN,
  SCORM_EXERCISE_SERVICE_TOKEN
} from '@campus/shared';
import { MockDate } from '@campus/testing';
import { ListFormat } from '@campus/ui';
import { Store, StoreModule } from '@ngrx/store';
import { hot } from '@nrwl/nx/testing';
import { of } from 'rxjs';
import { TasksResolver } from './tasks.resolver';
import { TasksViewModel } from './tasks.viewmodel';

let tasksViewModel: TasksViewModel;
let store: Store<DalState>;

describe('TasksViewModel met State', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        ...getStoreModuleForFeatures([
          LearningAreaReducer,
          EduContentReducer,
          UiReducer,
          TaskReducer,
          TaskInstanceReducer,
          TaskEduContentReducer,
          LinkedPersonReducer
        ])
      ],
      providers: [
        TasksViewModel,
        { provide: AUTH_SERVICE_TOKEN, useValue: { userId: 1 } },
        { provide: TasksResolver, useValue: { resolve: jest.fn() } },
        { provide: AlertService, useValue: {} },
        {
          provide: SCORM_EXERCISE_SERVICE_TOKEN,
          useValue: { startExerciseFromTask: jest.fn() }
        },
        {
          provide: PERMISSION_SERVICE_TOKEN,
          useValue: { hasPermission$: () => {} }
        },
        Store
      ]
    });
    tasksViewModel = TestBed.get(TasksViewModel);
    store = TestBed.get(Store);
  });

  let learningAreas: LearningAreaInterface[];
  let tasks: TaskInterface[];
  let eduContents: EduContentInterface[];
  let taskInstances: TaskInstanceInterface[];
  let taskEduContents: TaskEduContentInterface[];
  let teachers: PersonInterface[];
  let listFormat: ListFormat;
  const now = new Date();

  function setInitialState() {
    setLearningAreaState();
    setTaskState();
    setEduContentsState();
    setTaskInstances();
    setTaskEduContents();
    setTeacherState();
    listFormat = ListFormat.GRID;
  }

  describe('creation', () => {
    it('should be defined', () => {
      expect(tasksViewModel).toBeDefined();
    });
  });

  describe('learningAreasWithTaskInfo stream', () => {
    let defaultExpected;

    beforeEach(() => {
      setInitialState();
      defaultExpected = {
        learningAreasWithInfo: [
          {
            learningArea: learningAreas[0],
            openTasks: 1,
            closedTasks: 1
          },
          {
            learningArea: learningAreas[1],
            openTasks: 0,
            closedTasks: 1
          }
        ],
        totalTasks: 3
      };
    });

    it('should get the learningAreas with info from the provided state', () => {
      expect(tasksViewModel.learningAreasWithTaskInfo$).toBeObservable(
        hot('a', { a: defaultExpected })
      );
    });

    it('should show all tasks submitted', () => {
      store.dispatch(
        new TaskEduContentActions.UpdateTaskEduContent({
          taskEduContent: {
            id: 2,
            changes: {
              submitted: true
            }
          }
        })
      );
      const expected = { ...defaultExpected };
      expected.learningAreasWithInfo[0].openTasks = 0;
      expected.learningAreasWithInfo[0].closedTasks = 2;
      expect(tasksViewModel.learningAreasWithTaskInfo$).toBeObservable(
        hot('a', { a: expected })
      );
    });

    it('should ignore taskInstances that are expired', () => {
      store.dispatch(
        new TaskInstanceActions.UpdateTaskInstance({
          taskInstance: {
            id: 1,
            changes: {
              end: new Date(new Date().getTime() - 500)
            }
          }
        })
      );
      const expected = { ...defaultExpected, totalTasks: 2 };
      expected.learningAreasWithInfo[0].openTasks = 1;
      expected.learningAreasWithInfo[0].closedTasks = 0;
      expect(tasksViewModel.learningAreasWithTaskInfo$).toBeObservable(
        hot('a', { a: expected })
      );
    });

    it('should have 1 area', () => {
      store.dispatch(
        new TaskActions.UpdateTask({
          task: {
            id: 3,
            changes: {
              learningAreaId: 1
            }
          }
        })
      );
      const expected = { ...defaultExpected };
      expected.learningAreasWithInfo[0].closedTasks = 2;
      expected.learningAreasWithInfo = [expected.learningAreasWithInfo[0]];
      expect(tasksViewModel.learningAreasWithTaskInfo$).toBeObservable(
        hot('a', { a: expected })
      );
    });

    it('should only show shared tasks', () => {
      store.dispatch(
        new TaskActions.UpdateTask({
          task: {
            id: 3,
            changes: {
              personId: 1
            }
          }
        })
      );
      const expected = { ...defaultExpected, totalTasks: 2 };
      expected.learningAreasWithInfo = [expected.learningAreasWithInfo[0]];
      expect(tasksViewModel.learningAreasWithTaskInfo$).toBeObservable(
        hot('a', { a: expected })
      );
    });
  });

  describe('getTasksByLearningAreaId', () => {
    let defaultExpected;

    beforeEach(() => {
      setInitialState();
      defaultExpected = {
        taskInfos: [
          {
            task: tasks.filter(t => t.id === 1)[0],
            taskInstance: taskInstances.filter(t => t.taskId === 1)[0],
            taskEduContents: taskEduContents.filter(t => t.taskId === 1),
            finished: true,
            taskEduContentsCount: 2
          },
          {
            task: tasks.filter(t => t.id === 2)[0],
            taskInstance: taskInstances.filter(t => t.taskId === 2)[0],
            taskEduContents: taskEduContents.filter(t => t.taskId === 2),
            finished: false,
            taskEduContentsCount: 1
          }
        ]
      };
    });

    it('should get the learningArea with tasksinfo from the state', () => {
      expect(tasksViewModel.getTasksByLearningAreaId(1)).toBeObservable(
        hot('a', { a: defaultExpected })
      );
    });

    it('should only show shared tasks', () => {
      store.dispatch(
        new TaskActions.UpdateTask({
          task: {
            id: 2,
            changes: {
              personId: 1
            }
          }
        })
      );
      const expected = { ...defaultExpected };
      expected.taskInfos = [expected.taskInfos[0]];
      expect(tasksViewModel.getTasksByLearningAreaId(1)).toBeObservable(
        hot('a', { a: expected })
      );
    });

    it('should ignore tasks that are expired', () => {
      store.dispatch(
        new TaskInstanceActions.UpdateTaskInstance({
          taskInstance: {
            id: 1,
            changes: {
              end: new Date(new Date().getTime() - 500)
            }
          }
        })
      );
      const expected = {
        ...defaultExpected,
        taskInfos: [defaultExpected.taskInfos[1]]
      };
      expect(tasksViewModel.getTasksByLearningAreaId(1)).toBeObservable(
        hot('a', { a: expected })
      );
    });

    it('should show all tasks submitted', () => {
      store.dispatch(
        new TaskEduContentActions.UpdateTaskEduContent({
          taskEduContent: {
            id: 2,
            changes: {
              submitted: true
            }
          }
        })
      );
      const expected = { ...defaultExpected };
      expected.taskInfos[1].taskEduContents.filter(
        t => t.id === 2
      )[0].submitted = true;
      expected.taskInfos[1].finished = true;
      expect(tasksViewModel.getTasksByLearningAreaId(1)).toBeObservable(
        hot('a', { a: expected })
      );
    });
  });

  describe('getTaskWithInfo', () => {
    let defaultExpected;

    beforeEach(() => {
      setInitialState();
      let task = tasks.find(t => t.id === 1);
      task = {
        ...task,
        teacher: teachers.find(teacher => teacher.id === task.personId)
      };

      defaultExpected = {
        task: task,
        taskInstance: taskInstances.filter(t => t.taskId === 1)[0],
        taskEduContents: taskEduContents.filter(t => t.taskId === 1),
        finished: true,
        taskEduContentsCount: 2
      };
    });

    it('should get the taskInfo from the state', () => {
      const expected = defaultExpected;
      expected.taskEduContents.forEach(te => {
        te.eduContent = new EduContentFixture({ id: te.eduContentId });
      });
      expect(tasksViewModel.getTaskWithInfo(1)).toBeObservable(
        hot('a', { a: expected })
      );
    });

    it('should show submitted as true', () => {
      store.dispatch(
        new TaskEduContentActions.UpdateTaskEduContent({
          taskEduContent: {
            id: 3,
            changes: {
              submitted: true
            }
          }
        })
      );
      const expected = { ...defaultExpected };
      expected.taskEduContents.filter(t => t.id === 3)[0].submitted = true;
      expected.finished = true;
      expected.taskEduContents
        .filter(t => t.id === 1 || t.id === 3)
        .forEach(te => {
          te.eduContent = new EduContentFixture({ id: te.eduContentId });
        });
      expect(tasksViewModel.getTaskWithInfo(1)).toBeObservable(
        hot('a', { a: expected })
      );
    });
  });

  describe('getLearningAreaById', () => {
    beforeEach(() => {
      setInitialState();
    });

    it('should return the correct area', () => {
      expect(tasksViewModel.getLearningAreaById(1)).toBeObservable(
        hot('a', { a: learningAreas.filter(a => a.id === 1)[0] })
      );
    });

    it('should return null', () => {
      expect(tasksViewModel.getLearningAreaById(10)).toBeObservable(
        hot('a', { a: undefined })
      );
    });
  });

  describe('dispatch actions', () => {
    it('changeListFormat', () => {
      spyOn(store, 'dispatch');
      const expectedAction = new UiActions.SetListFormat({
        listFormat: ListFormat.LINE
      });
      tasksViewModel.changeListFormat(ListFormat.LINE);
      expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
    });

    it('set alerts read by a filter', () => {
      spyOn(store, 'dispatch');
      const expectedAction = new AlertActions.SetAlertReadByFilter({
        filter: { taskId: 1 },
        intended: false,
        personId: 1,
        read: true,
        customFeedbackHandlers: {
          useCustomErrorHandler: 'useNoHandler',
          useCustomSuccessHandler: 'useNoHandler'
        }
      });
      tasksViewModel.setTaskAlertRead(1);
      expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
    });

    describe('add task to history', () => {
      let dateMock: MockDate;
      beforeEach(() => {
        setInitialState();
      });

      beforeAll(() => {
        dateMock = new MockDate();
      });

      afterAll(() => {
        dateMock.returnRealDate();
      });

      it('should add the task to history, if the user has permission', () => {
        jest
          .spyOn(TestBed.get(PERMISSION_SERVICE_TOKEN), 'hasPermission$')
          .mockReturnValue(of(true));

        jest.spyOn(store, 'dispatch');

        tasksViewModel.setTaskHistory(1);

        const expected = new HistoryActions.StartUpsertHistory({
          history: {
            name: tasks[0].name,
            type: HistoryTypesEnum.TASK,
            created: dateMock.mockDate,
            learningAreaId: tasks[0].learningAreaId,
            taskId: 1
          }
        });

        expect(store.dispatch).toHaveBeenCalledWith(expected);
      });

      it('should not add the task to history, if the user does not have permission', () => {
        jest
          .spyOn(TestBed.get(PERMISSION_SERVICE_TOKEN), 'hasPermission$')
          .mockReturnValue(of(false));

        jest.spyOn(store, 'dispatch');

        tasksViewModel.setTaskHistory(1);

        expect(store.dispatch).not.toHaveBeenCalled();
      });
    });
  });

  describe('startExercise', () => {
    it('should call the scormExerciseService and dispatch a startUpsertHistory action', () => {
      const mockDate = new MockDate();

      const spy = jest.spyOn(store, 'dispatch');
      const expectedHistory: HistoryInterface = {
        name: 'foo',
        type: 'educontent',
        learningAreaId: 1,
        eduContentId: 123,
        created: mockDate.mockDate
      };

      const scormExerciseService = TestBed.get(SCORM_EXERCISE_SERVICE_TOKEN);
      const mockTaskEduContent: TaskEduContentInterface = new TaskEduContentFixture(
        {
          eduContentId: 123,
          taskId: 456,
          eduContent: new EduContentFixture({ id: 123 })
        }
      );
      tasksViewModel.startExercise(mockTaskEduContent);

      expect(scormExerciseService.startExerciseFromTask).toHaveBeenCalled();
      expect(scormExerciseService.startExerciseFromTask).toHaveBeenCalledWith(
        1, //userId
        mockTaskEduContent.eduContentId,
        mockTaskEduContent.taskId
      );

      expect(spy).toHaveBeenCalledWith(
        new HistoryActions.StartUpsertHistory({ history: expectedHistory })
      );
    });
  });

  function setLearningAreaState() {
    learningAreas = [
      new LearningAreaFixture({ id: 1 }),
      new LearningAreaFixture({ id: 2 })
    ];
    store.dispatch(
      new LearningAreaActions.LearningAreasLoaded({ learningAreas })
    );
  }

  function setTaskState() {
    tasks = [
      new TaskFixture({ id: 1, personId: 186, learningAreaId: 1 }),
      new TaskFixture({ id: 2, personId: 187, learningAreaId: 1 }),
      new TaskFixture({ id: 3, personId: 187, learningAreaId: 2 })
    ];
    store.dispatch(new TaskActions.TasksLoaded({ tasks }));
  }

  function setEduContentsState() {
    eduContents = [
      new EduContentFixture({ id: 1 }),
      new EduContentFixture({ id: 2 }),
      new EduContentFixture({ id: 3 })
    ];
    store.dispatch(
      new EduContentActions.EduContentsLoaded({ eduContents: eduContents })
    );
  }

  function setTaskInstances() {
    taskInstances = [
      new TaskInstanceFixture({ id: 1, taskId: 1, personId: 1 }),
      new TaskInstanceFixture({ id: 2, taskId: 2, personId: 1 }),
      new TaskInstanceFixture({ id: 3, taskId: 3, personId: 1 })
    ];
    store.dispatch(
      new TaskInstanceActions.TaskInstancesLoaded({ taskInstances })
    );
  }

  function setTaskEduContents() {
    taskEduContents = [
      {
        ...new TaskEduContentFixture({
          id: 1,
          teacherId: 186,
          taskId: 1,
          eduContentId: 1
        }),
        submitted: true
      },
      {
        ...new TaskEduContentFixture({
          id: 2,
          teacherId: 187,
          taskId: 2,
          eduContentId: 2
        }),
        submitted: false
      },
      {
        ...new TaskEduContentFixture({
          id: 3,
          teacherId: 187,
          taskId: 1,
          eduContentId: 2
        }),
        submitted: true
      }
    ];

    store.dispatch(
      new TaskEduContentActions.TaskEduContentsLoaded({ taskEduContents })
    );
  }

  function setTeacherState() {
    teachers = [
      new PersonFixture({ id: 186, email: 'foo@bar.bar' }),
      new PersonFixture({ id: 187, email: 'foo@bar.bar' })
    ];
    store.dispatch(
      new LinkedPersonActions.LinkedPersonsLoaded({ persons: teachers })
    );
  }
});
