import { Injectable } from '@angular/core';
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
  TaskEduContentInterface,
  TaskFixture,
  TaskInstanceFixture,
  TaskInstanceInterface,
  TaskInterface,
  TaskReducer,
  UiReducer,
  UserActions,
  UserReducer
} from '@campus/dal';
import { ListFormat } from '@campus/ui';
import { Store, StoreModule } from '@ngrx/store';
import { hot } from '@nrwl/nx/testing';
import { map } from 'rxjs/operators';
import { ScormStatus } from './../../../../../dal/src/lib/results/enums/scorm-status.enum';
import { TasksResolver } from './tasks.resolver';
import { TasksViewModel } from './tasks.viewmodel';

let usedUserState;
let usedLearningAreaState;
let usedTeacherState;
let usedTaskState;
let usedEducontentState;
let usedTaskInstanceState;
let usedResultState;
let usedTaskEducontentState;
let usedUiState;
let spy;
let tasksViewModel: TasksViewModel;

@Injectable({
  providedIn: 'root'
})
class MockResolver {
  resolve = spy;
}

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
        { provide: AUTH_SERVICE_TOKEN, useValue: {} },
        { provide: TasksResolver, useClass: MockResolver },
        Store
      ]
    });
    tasksViewModel = TestBed.get(TasksViewModel);
  });

  let user: PersonInterface;
  let learningAreas: LearningAreaInterface[];
  let teachers: PersonInterface[];
  let tasks: TaskInterface[];
  let eduContents: EduContentInterface[];
  let taskInstances: TaskInstanceInterface[];
  let results: ResultInterface[];
  let taskEduContents: TaskEduContentInterface[];
  let listFormat: ListFormat;

  function setInitialState() {
    // Current User State
    user = new PersonFixture();
    usedUserState = UserReducer.reducer(
      UserReducer.initialState,
      new UserActions.UserLoaded(user)
    );

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
    taskInstances = [
      new TaskInstanceFixture({ id: 1, taskId: 1, personId: 1 }),
      new TaskInstanceFixture({ id: 2, taskId: 2, personId: 1 }),
      new TaskInstanceFixture({ id: 3, taskId: 3, personId: 1 })
    ];
    // usedTaskInstanceState = TaskInstanceReducer.reducer(
    //   TaskInstanceReducer.initialState,
    //   new TaskInstanceActions.TaskInstancesLoaded({ taskInstances })
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
      new TaskEduContentFixture({
        id: 1,
        teacherId: 186,
        taskId: 1,
        eduContentId: 1
      }),
      new TaskEduContentFixture({
        id: 2,
        teacherId: 187,
        taskId: 2,
        eduContentId: 2
      }),
      new TaskEduContentFixture({
        id: 3,
        teacherId: 187,
        taskId: 1,
        eduContentId: 2
      })
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
    beforeAll(() => {
      spy = jest.fn();
    });
    it('should be defined', () => {
      expect(tasksViewModel).toBeDefined();
    });
    it('should call the TasksResolver.resolve', () => {
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('source streams', () => {
    beforeAll(() => {
      setInitialState();
    });

    it('should get the user from the provided state', () => {
      expect(tasksViewModel.currentUser$).toBeObservable(hot('a', { a: user }));
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
      expect(tasksViewModel['tasks$']).toBeObservable(hot('a', { a: tasks }));
    });

    it('should get the educontents from the provided state', () => {
      expect(tasksViewModel['educontents$']).toBeObservable(
        hot('a', { a: eduContents })
      );
    });

    it('should get the taskInstances from the provided state', () => {
      expect(tasksViewModel['taskInstances$']).toBeObservable(
        hot('(a|)', { a: taskInstances })
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

  describe('intermediate streams', () => {
    describe('tasksWithRelationInfo$', () => {
      beforeEach(() => {
        setInitialState();
      });

      it('should return', () => {
        expect(tasksViewModel['tasksWithRelationInfo$']).toBeTruthy();
      });

      it('should return a stream with the correct amount of tasks', () => {
        const outputAmount$ = tasksViewModel['tasksWithRelationInfo$'].pipe(
          map(tasksArray => tasksArray.length)
        );

        expect(outputAmount$).toBeObservable(hot('a', { a: 3 }));

        // usedTaskState = TaskReducer.reducer(
        //   usedTaskState,
        //   new TaskActions.AddTask({ task: new TaskFixture({ id: 4 }) })
        // );

        // console.log(usedTaskState.ids.length);

        // expect(outputAmount$).toBeObservable(hot('b', { b: 4 }));
      });

      it('should return a stream with the correct amount of educontents per task', () => {
        const outputAmount$ = tasksViewModel['tasksWithRelationInfo$'].pipe(
          map(tasksArray => tasksArray[0].eduContents.length)
        );

        expect(outputAmount$).toBeObservable(hot('a', { a: 2 }));
      });

      it('should return the correct stream', () => {
        const expectedResult = [
          new TaskFixture({
            id: 1,
            personId: 186,
            learningAreaId: 1,
            eduContents: [
              new EduContentFixture({ id: 1 }),
              new EduContentFixture({ id: 2 })
            ],
            learningArea: new LearningAreaFixture(),
            teacher: new PersonFixture({ id: 186 })
          }),
          new TaskFixture({
            id: 2,
            personId: 187,
            learningAreaId: 1,
            eduContents: [new EduContentFixture({ id: 2 })],
            learningArea: new LearningAreaFixture(),
            teacher: new PersonFixture({ id: 187 })
          }),
          new TaskFixture({
            id: 3,
            personId: 187,
            learningAreaId: 2,
            eduContents: [],
            learningArea: new LearningAreaFixture({ id: 2 }),
            teacher: new PersonFixture({ id: 187 })
          })
        ];

        expect(tasksViewModel['tasksWithRelationInfo$']).toBeObservable(
          hot('a', { a: expectedResult })
        );
      });
    });
  });

  describe('taskInstancesWithRelationInfo$', () => {
    beforeEach(() => {
      setInitialState();
    });

    it('should return', () => {
      expect(tasksViewModel['taskInstancesWithRelationInfo$']).toBeTruthy();
    });

    it('should return the correct stream', () => {
      const expectedResult = [
        {
          ...new TaskInstanceFixture({
            id: 1,
            taskId: 1,
            personId: 1,
            task: new TaskFixture({
              id: 1,
              personId: 186,
              learningAreaId: 1,
              eduContents: [
                new EduContentFixture({ id: 1 }),
                new EduContentFixture({ id: 2 })
              ],
              learningArea: new LearningAreaFixture(),
              teacher: new PersonFixture({ id: 186 })
            })
          }),
          results: [
            new ResultFixture({
              id: 1,
              eduContentId: 1,
              taskId: 1,
              personId: 1
            }),
            new ResultFixture({
              id: 2,
              eduContentId: 2,
              taskId: 1,
              personId: 1
            }),
            new ResultFixture({
              id: 3,
              eduContentId: 2,
              taskId: 1,
              personId: 1,
              status: ScormStatus.STATUS_INCOMPLETE
            })
          ]
        },
        {
          ...new TaskInstanceFixture({
            id: 2,
            taskId: 2,
            personId: 1,
            task: new TaskFixture({
              id: 2,
              personId: 187,
              learningAreaId: 1,
              eduContents: [new EduContentFixture({ id: 2 })],
              learningArea: new LearningAreaFixture(),
              teacher: new PersonFixture({ id: 187 })
            })
          }),
          results: []
        },
        {
          ...new TaskInstanceFixture({
            id: 3,
            taskId: 3,
            personId: 1,
            task: new TaskFixture({
              id: 3,
              personId: 187,
              learningAreaId: 2,
              eduContents: [],
              learningArea: new LearningAreaFixture({ id: 2 }),
              teacher: new PersonFixture({ id: 187 })
            })
          }),
          results: []
        }
      ];

      expect(tasksViewModel['taskInstancesWithRelationInfo$']).toBeObservable(
        hot('a', { a: expectedResult })
      );
    });
  });

  describe('tasksWithInstances$', () => {
    beforeEach(() => {
      setInitialState();
    });

    it('should return', () => {
      expect(tasksViewModel['tasksWithInstances$']).toBeTruthy();
    });

    it('should return the correct stream', () => {
      const expectedResult = [
        {
          ...new TaskFixture({
            id: 1,
            personId: 186,
            learningAreaId: 1
          }),
          instances: [
            {
              ...new TaskInstanceFixture({
                id: 1,
                taskId: 1,
                personId: 1,
                task: new TaskFixture({
                  id: 1,
                  personId: 186,
                  learningAreaId: 1,
                  eduContents: [
                    new EduContentFixture({ id: 1 }),
                    new EduContentFixture({ id: 2 })
                  ],
                  learningArea: new LearningAreaFixture(),
                  teacher: new PersonFixture({ id: 186 })
                })
              }),
              results: [
                new ResultFixture({
                  id: 1,
                  eduContentId: 1,
                  taskId: 1,
                  personId: 1
                }),
                new ResultFixture({
                  id: 2,
                  eduContentId: 2,
                  taskId: 1,
                  personId: 1
                }),
                new ResultFixture({
                  id: 3,
                  eduContentId: 2,
                  taskId: 1,
                  personId: 1,
                  status: ScormStatus.STATUS_INCOMPLETE
                })
              ]
            }
          ]
        },

        {
          ...new TaskFixture({
            id: 2,
            personId: 187,
            learningAreaId: 1
          }),
          instances: [
            {
              ...new TaskInstanceFixture({
                id: 2,
                taskId: 2,
                personId: 1,
                task: new TaskFixture({
                  id: 2,
                  personId: 187,
                  learningAreaId: 1,
                  eduContents: [new EduContentFixture({ id: 2 })],
                  learningArea: new LearningAreaFixture(),
                  teacher: new PersonFixture({ id: 187 })
                })
              }),
              results: []
            }
          ]
        },
        {
          ...new TaskFixture({
            id: 3,
            personId: 187,
            learningAreaId: 2
          }),
          instances: [
            {
              ...new TaskInstanceFixture({
                id: 3,
                taskId: 3,
                personId: 1,
                task: new TaskFixture({
                  id: 3,
                  personId: 187,
                  learningAreaId: 2,
                  eduContents: [],
                  learningArea: new LearningAreaFixture({ id: 2 }),
                  teacher: new PersonFixture({ id: 187 })
                })
              }),
              results: []
            }
          ]
        }
      ];

      expect(tasksViewModel['tasksWithInstances$']).toBeObservable(
        hot('a', { a: expectedResult })
      );
    });
  });

  describe('learningAreasWithTasks$', () => {
    beforeEach(() => {
      setInitialState();
    });

    it('should return', () => {
      expect(tasksViewModel['learningAreasWithTasks$']).toBeTruthy();
    });

    it('should return the correct stream', () => {
      const expectedResult = [
        {
          ...new LearningAreaFixture({}),
          tasks: [
            {
              ...new TaskFixture({
                id: 1,
                personId: 186,
                learningAreaId: 1
              }),
              instances: [
                {
                  ...new TaskInstanceFixture({
                    id: 1,
                    taskId: 1,
                    personId: 1,
                    task: new TaskFixture({
                      id: 1,
                      personId: 186,
                      learningAreaId: 1,
                      eduContents: [
                        new EduContentFixture({ id: 1 }),
                        new EduContentFixture({ id: 2 })
                      ],
                      learningArea: new LearningAreaFixture(),
                      teacher: new PersonFixture({ id: 186 })
                    })
                  }),
                  results: [
                    new ResultFixture({
                      id: 1,
                      eduContentId: 1,
                      taskId: 1,
                      personId: 1
                    }),
                    new ResultFixture({
                      id: 2,
                      eduContentId: 2,
                      taskId: 1,
                      personId: 1
                    }),
                    new ResultFixture({
                      id: 3,
                      eduContentId: 2,
                      taskId: 1,
                      personId: 1,
                      status: ScormStatus.STATUS_INCOMPLETE
                    })
                  ]
                }
              ]
            },
            {
              ...new TaskFixture({
                id: 2,
                personId: 187,
                learningAreaId: 1
              }),
              instances: [
                {
                  ...new TaskInstanceFixture({
                    id: 2,
                    taskId: 2,
                    personId: 1,
                    task: new TaskFixture({
                      id: 2,
                      personId: 187,
                      learningAreaId: 1,
                      eduContents: [new EduContentFixture({ id: 2 })],
                      learningArea: new LearningAreaFixture(),
                      teacher: new PersonFixture({ id: 187 })
                    })
                  }),
                  results: []
                }
              ]
            }
          ]
        },
        {
          ...new LearningAreaFixture({ id: 2 }),
          tasks: [
            {
              ...new TaskFixture({
                id: 3,
                personId: 187,
                learningAreaId: 2
              }),
              instances: [
                {
                  ...new TaskInstanceFixture({
                    id: 3,
                    taskId: 3,
                    personId: 1,
                    task: new TaskFixture({
                      id: 3,
                      personId: 187,
                      learningAreaId: 2,
                      eduContents: [],
                      learningArea: new LearningAreaFixture({ id: 2 }),
                      teacher: new PersonFixture({ id: 187 })
                    })
                  }),
                  results: []
                }
              ]
            }
          ]
        }
      ];

      expect(tasksViewModel['learningAreasWithTasks$']).toBeObservable(
        hot('a', { a: expectedResult })
      );
    });
  });
});
