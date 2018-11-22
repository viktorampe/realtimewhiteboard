import { TestBed } from '@angular/core/testing';
import {
  AUTH_SERVICE_TOKEN,
  EduContentActions,
  EduContentFixture,
  EduContentInterface,
  EduContentReducer,
  LearningAreaActions,
  LearningAreaFixture,
  LearningAreaInterface,
  LearningAreaReducer,
  PersonFixture,
  PersonInterface,
  ResultFixture,
  ResultInterface,
  StateFeatureBuilder,
  TaskActions,
  TaskEduContentFixture,
  TaskFixture,
  TaskInstanceFixture,
  TaskInstanceInterface,
  TaskInterface,
  TaskReducer,
  UiReducer,
  UserReducer
} from '@campus/dal';
import { ListFormat } from '@campus/ui';
import { Store, StoreModule } from '@ngrx/store';
import { hot } from '@nrwl/nx/testing';
import { ScormStatus } from '../../../../../dal/src/lib/results/enums/scorm-status.enum';
import { TasksResolver } from './tasks.resolver';
import {
  TaskEduContentWithSubmittedInterface,
  TasksViewModel
} from './tasks.viewmodel';

let usedUserState;
let usedLearningAreaState;
let usedTeacherState;
let usedTaskState;
let usedEducontentState;
let usedTaskInstanceState;
let usedResultState;
let usedTaskEducontentState;
let usedUiState;
let taskResolver: TasksResolver;
let tasksViewModel: TasksViewModel;

describe('TasksViewModel met State', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        ...StateFeatureBuilder.getModuleWithForFeatureProviders([
          {
            NAME: UserReducer.NAME,
            reducer: UserReducer.reducer,
            initialState: {
              initialState: usedUserState
            }
          },
          {
            NAME: LearningAreaReducer.NAME,
            reducer: LearningAreaReducer.reducer,
            initialState: {
              initialState: usedLearningAreaState
            }
          },
          // {
          //   NAME: TeacherReducer.NAME,
          //   reducer: TeacherReducer.reducer,
          //   initialState: {
          //     initialState: usedTeacherState
          //   }
          // },
          {
            NAME: TaskReducer.NAME,
            reducer: TaskReducer.reducer,
            initialState: {
              initialState: usedTaskState
            }
          },
          {
            NAME: EduContentReducer.NAME,
            reducer: EduContentReducer.reducer,
            initialState: {
              initialState: usedEducontentState
            }
          },
          // {
          //   NAME: TaskInstanceReducer.NAME,
          //   reducer: TaskInstanceReducer.reducer,
          //   initialState: {
          //     initialState: usedTaskInstanceState
          //   }
          // },
          // {
          //   NAME: ResultReducer.NAME,
          //   reducer: ResultReducer.reducer,
          //   initialState: {
          //     initialState: usedResultState
          //   }
          // },
          // {
          //   NAME: TaskEducontentReducer.NAME,
          //   reducer: TaskEducontentReducer.reducer,
          //   initialState: {
          //     initialState: usedTaskEducontentState
          //   }
          // },
          {
            NAME: UiReducer.NAME,
            reducer: UiReducer.reducer,
            initialState: {
              initialState: usedUiState
            }
          }
        ])
      ],
      providers: [
        TasksViewModel,
        { provide: AUTH_SERVICE_TOKEN, useValue: { userId: 1 } },
        { provide: TasksResolver, useValue: { resolve: jest.fn() } },
        Store
      ]
    });
    tasksViewModel = TestBed.get(TasksViewModel);
    taskResolver = TestBed.get(TasksResolver);
  });

  let learningAreas: LearningAreaInterface[];
  let teachers: PersonInterface[];
  let tasks: TaskInterface[];
  let eduContents: EduContentInterface[];
  let taskInstance: TaskInstanceInterface;
  let results: ResultInterface[];
  let taskEduContents: TaskEduContentWithSubmittedInterface[];
  let listFormat: ListFormat;

  function setInitialState() {
    // Learning Area State
    learningAreas = [
      new LearningAreaFixture({ id: 1 }),
      new LearningAreaFixture({ id: 2 })
    ];
    usedLearningAreaState = LearningAreaReducer.reducer(
      LearningAreaReducer.initialState,
      new LearningAreaActions.LearningAreasLoaded({ learningAreas })
    );

    // Teacher State
    teachers = [new PersonFixture({ id: 186 }), new PersonFixture({ id: 187 })];
    // usedTeacherState = TeacherReducer.reducer(
    //   TeacherReducer.initialState,
    //   new TeacherActions.TeacherLoaded(teachers)
    // );

    // Task State
    tasks = [
      new TaskFixture({ id: 1, personId: 186, learningAreaId: 1 }),
      new TaskFixture({ id: 2, personId: 187, learningAreaId: 1 }),
      new TaskFixture({ id: 3, personId: 187, learningAreaId: 2 })
    ];
    usedTaskState = TaskReducer.reducer(
      TaskReducer.initialState,
      new TaskActions.TasksLoaded({ tasks })
    );

    // Educontent State
    eduContents = [
      new EduContentFixture({ id: 1 }),
      new EduContentFixture({ id: 2 })
    ];
    usedEducontentState = EduContentReducer.reducer(
      EduContentReducer.initialState,
      new EduContentActions.EduContentsLoaded({ eduContents })
    );

    // Taskinstance State
    taskInstance = new TaskInstanceFixture({ id: 1, taskId: 1, personId: 1 });
    // usedTaskInstanceState = TaskInstanceReducer.reducer(
    //   TaskInstanceReducer.initialState,
    //   new TaskInstanceActions.TaskInstancesLoaded({ taskInstance })
    // );

    // Result State
    results = [
      new ResultFixture({ id: 1, eduContentId: 1, taskId: 1, personId: 1 }),
      new ResultFixture({ id: 2, eduContentId: 2, taskId: 1, personId: 1 }),
      new ResultFixture({
        id: 3,
        eduContentId: 2,
        taskId: 1,
        personId: 1,
        status: ScormStatus.STATUS_INCOMPLETE
      })
    ];
    // usedResultState = ResultReducer.reducer(
    //   ResultReducer.initialState,
    //   new ResultActions.ResultssLoaded({ results })
    // );

    // TaskEducontent State
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
        submitted: true
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
    // usedTaskEducontentState = TaskEduContentReducer.reducer(
    //   TaskEduContentReducer.initialState,
    //   new TaskEduContentActions.TaskEduContentsLoaded({ taskEducontents })
    // );

    // UI State
    listFormat = ListFormat.GRID;
    usedUiState = UiReducer.initialState;
  }

  describe('creation', () => {
    it('should be defined', () => {
      expect(tasksViewModel).toBeDefined();
    });
    it('should call the TasksResolver.resolve', () => {
      expect(taskResolver.resolve).toHaveBeenCalledTimes(1);
    });
  });

  describe('source streams', () => {
    beforeAll(() => {
      setInitialState();
    });

    it('should get the learningAreas from the provided state', () => {
      expect(tasksViewModel['learningAreas$']).toBeObservable(
        hot('a', { a: learningAreas })
      );
    });

    it('should get the teachers from the provided state', () => {
      expect(tasksViewModel['teachers$']).toBeObservable(
        hot('(a|)', { a: teachers })
      );
    });

    it('should get the tasks from the provided state', () => {
      expect(tasksViewModel['sharedTasks$']).toBeObservable(
        hot('a', { a: tasks })
      );
    });

    it('should get the educontents from the provided state', () => {
      expect(tasksViewModel['educontents$']).toBeObservable(
        hot('a', { a: eduContents })
      );
    });

    it('should get the taskInstances from the provided state', () => {
      expect(tasksViewModel['taskInstance$']).toBeObservable(
        hot('(a|)', { a: taskInstance })
      );
    });

    it('should get the results from the provided state', () => {
      expect(tasksViewModel['results$']).toBeObservable(
        hot('(a|)', { a: results })
      );
    });

    it('should get the taskEduContents from the provided state', () => {
      expect(tasksViewModel['taskEducontents$']).toBeObservable(
        hot('(a|)', { a: taskEduContents })
      );
    });

    it('should get the ListFormat from the provided state', () => {
      expect(tasksViewModel.listFormat$).toBeObservable(
        hot('a', { a: listFormat })
      );
    });
  });
});
