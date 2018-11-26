import { Inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  AlertService,
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  DalState,
  EduContentInterface,
  LearningAreaInterface,
  PersonFixture,
  ResultFixture,
  ResultInterface,
  StateFeatureBuilder,
  TaskEduContentFixture,
  TaskFixture,
  TaskInstanceInterface,
  TaskInterface
} from '@campus/dal';
import { ListFormat } from '@campus/ui';
import { PersonInterface } from '@diekeure/polpo-api-angular-sdk';
import { Store, StoreModule } from '@ngrx/store';
import { hot } from '@nrwl/nx/testing';
import { Observable, of } from 'rxjs';
import { EduContentFixture } from './../../../../../dal/src/lib/+fixtures/EduContent.fixture';
import { TaskInstanceFixture } from './../../../../../dal/src/lib/+fixtures/TaskInstance.fixture';
import { TasksResolver } from './tasks.resolver';
import {
  TaskEduContentWithSubmittedInterface,
  TaskInstanceWithResultsInterface,
  TasksViewModel,
  TaskWithRelationsInterface
} from './tasks.viewmodel';

let tasksViewModel: TestViewModel;

export class TestViewModel extends TasksViewModel {
  setListformat$(stream: Observable<ListFormat>) {
    this.listFormat$ = stream;
  }

  setLearningAreas$(stream: Observable<LearningAreaInterface[]>) {
    this.learningAreas$ = stream;
  }

  setTeachers$(stream: Observable<PersonInterface[]>) {
    this.teachers$ = stream;
  }

  setSharedTasks$(stream: Observable<TaskInterface[]>) {
    this.sharedTasks$ = stream;
  }

  setEducontents$(stream: Observable<EduContentInterface[]>) {
    this.eduContents$ = stream;
  }

  setTaskInstance$(stream: Observable<TaskInstanceInterface[]>) {
    this.taskInstances$ = stream;
  }

  setResults$(stream: Observable<ResultInterface[]>) {
    this.results$ = stream;
  }

  setTaskEducontents$(
    stream: Observable<TaskEduContentWithSubmittedInterface[]>
  ) {
    this.taskEducontents$ = stream;
  }

  LoadMockData() {
    return;
  }

  setSourceStreams() {
    return;
  }

  constructor(
    store: Store<DalState>,
    @Inject(AUTH_SERVICE_TOKEN) authService: AuthServiceInterface,
    tasksResolver: TasksResolver,
    alertService: AlertService
  ) {
    super(store, authService, tasksResolver, alertService);
  }
}

describe('TasksViewModel zonder State', () => {
  beforeAll(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        ...StateFeatureBuilder.getModuleWithForFeatureProviders([])
      ],
      providers: [
        { provide: TasksViewModel, useClass: TestViewModel },
        { provide: AUTH_SERVICE_TOKEN, useValue: { userId: 1 } },
        { provide: TasksResolver, useValue: { resolve: jest.fn() } },
        Store,
        { provide: AlertService, useValue: {} }
      ]
    });
    tasksViewModel = TestBed.get(TasksViewModel) as TestViewModel;
  });

  it('should build TasksPerLearningAreaId$', () => {
    const mockTaskArray = [
      new TaskFixture({ id: 1, learningAreaId: 1 }),
      new TaskFixture({ id: 2, learningAreaId: 1 }),
      new TaskFixture({ id: 3, learningAreaId: 2 }),
      new TaskFixture({ id: 4, learningAreaId: 3 })
    ];

    const tasks$ = of(mockTaskArray);

    const expectedMap = new Map<Number, TaskInterface[]>([
      [1, [mockTaskArray[0], mockTaskArray[1]]],
      [2, [mockTaskArray[2]]],
      [3, [mockTaskArray[3]]]
    ]);

    const constructedMap = tasksViewModel['getTasksPerLearningAreaIdDict$'](
      tasks$
    );

    expect(constructedMap).toBeObservable(hot('(a|)', { a: expectedMap }));
  });

  it('should build EduContentIdsPerTaskId$', () => {
    const mockTaskEduContentArray: TaskEduContentWithSubmittedInterface[] = [
      {
        ...new TaskEduContentFixture({ id: 5, taskId: 1, eduContentId: 11 }),
        submitted: true
      },
      {
        ...new TaskEduContentFixture({ id: 6, taskId: 2, eduContentId: 12 }),
        submitted: true
      },
      {
        ...new TaskEduContentFixture({ id: 7, taskId: 2, eduContentId: 11 }),
        submitted: true
      },
      {
        ...new TaskEduContentFixture({ id: 8, taskId: 1, eduContentId: 14 }),
        submitted: false
      }
    ];

    const tasksEduContents$ = of(mockTaskEduContentArray);

    const expectedMap = new Map<Number, Map<number, boolean>[]>([
      [
        1,
        [
          new Map<number, boolean>([
            [
              mockTaskEduContentArray[0].eduContentId,
              mockTaskEduContentArray[0].submitted
            ]
          ]),
          new Map<number, boolean>([
            [
              mockTaskEduContentArray[3].eduContentId,
              mockTaskEduContentArray[3].submitted
            ]
          ])
        ]
      ],
      [
        2,
        [
          new Map<number, boolean>([
            [
              mockTaskEduContentArray[1].eduContentId,
              mockTaskEduContentArray[1].submitted
            ]
          ]),
          new Map<number, boolean>([
            [
              mockTaskEduContentArray[0].eduContentId,
              mockTaskEduContentArray[0].submitted
            ]
          ])
        ]
      ]
    ]);

    const constructedMap = tasksViewModel['getEduContentIdsPerTaskIdDict$'](
      tasksEduContents$
    );

    expect(constructedMap).toBeObservable(hot('(a|)', { a: expectedMap }));
  });

  it('getSubmittedPerEduContentId should cast taskEduContent to a Map<number,boolean>', () => {
    let taskEduContent: TaskEduContentWithSubmittedInterface = {
      ...new TaskEduContentFixture({ eduContentId: 1 }),
      submitted: true
    };
    let expectedMap = new Map<number, boolean>([[1, true]]);

    expect(
      tasksViewModel['getSubmittedPerEduContentId'](taskEduContent)
    ).toEqual(expectedMap);

    taskEduContent = {
      ...new TaskEduContentFixture({ eduContentId: 2 }),
      submitted: false
    };
    expectedMap = new Map<number, boolean>([[2, false]]);

    expect(
      tasksViewModel['getSubmittedPerEduContentId'](taskEduContent)
    ).toEqual(expectedMap);
  });

  it(' flattenArrayToUniqueValues should reduce a nested array to an array of unique values', () => {
    const dictionary = new Map<Number, Number[]>([[1, [1, 4]], [2, [2, 1]]]);
    const expectedArray = [1, 2, 4];
    const reducedArray = tasksViewModel['flattenArrayToUniqueValues'](
      Array.from(dictionary.values())
    );

    expect(reducedArray).toEqual(expectedArray);
  });

  it('should build TasksPerTeacherId$', () => {
    const mockTaskArray = [
      new TaskFixture({ id: 5, personId: 1 }),
      new TaskFixture({ id: 6, personId: 2 }),
      new TaskFixture({ id: 7, personId: 2 }),
      new TaskFixture({ id: 8, personId: 3 })
    ];

    const tasks$ = of(mockTaskArray);

    const expectedMap = new Map<Number, TaskInterface[]>([
      [1, [mockTaskArray[0]]],
      [2, [mockTaskArray[1], mockTaskArray[2]]],
      [3, [mockTaskArray[3]]]
    ]);

    const constructedMap = tasksViewModel['getTasksPerTeacherIdDict$'](tasks$);

    expect(constructedMap).toBeObservable(hot('(a|)', { a: expectedMap }));
  });

  it('should build ResultsPerTaskId$', () => {
    const mockResultArray = [
      new ResultFixture({ id: 5, taskId: 1 }),
      new ResultFixture({ id: 6, taskId: 2 }),
      new ResultFixture({ id: 7, taskId: 2 }),
      new ResultFixture({ id: 8, taskId: 3 })
    ];

    const results$ = of(mockResultArray);

    const expectedMap = new Map<Number, ResultInterface[]>([
      [1, [mockResultArray[0]]],
      [2, [mockResultArray[1], mockResultArray[2]]],
      [3, [mockResultArray[3]]]
    ]);

    const constructedMap = tasksViewModel['getResultsPerTaskIdDict$'](results$);

    expect(constructedMap).toBeObservable(hot('(a|)', { a: expectedMap }));
  });

  it('should build TasksWithRelationInfo$', () => {
    const mockTaskArray = [
      new TaskFixture({ id: 1, personId: 186 }),
      new TaskFixture({ id: 2, personId: 187 })
    ];

    const mockEduContentArray = [
      {
        ...new EduContentFixture()
      },
      {
        ...new EduContentFixture({ id: 2 })
      }
    ];

    const mockDictionary = of(
      new Map<number, Map<number, boolean>[]>([
        [
          1,
          [
            new Map<number, boolean>([[1, true]]),
            new Map<number, boolean>([[2, false]])
          ]
        ],
        [
          2,
          [
            new Map<number, boolean>([[1, true]]),
            new Map<number, boolean>([[2, true]])
          ]
        ]
      ])
    );

    const mockTeacherArray = [
      new PersonFixture({ id: 186 }),
      new PersonFixture({ id: 187 })
    ];

    const tasks$ = of(mockTaskArray);
    const eduContents$ = of(mockEduContentArray);
    const teachers$ = of(mockTeacherArray);
    const dict$ = of(mockDictionary);

    const expectedArray = [
      {
        ...mockTaskArray[0],
        personId: mockTeacherArray[0].id,
        eduContents: [
          {
            ...mockEduContentArray[0],
            submitted: true
          },
          {
            ...mockEduContentArray[1],
            submitted: false
          }
        ],
        teacher: mockTeacherArray[0]
      },
      {
        ...mockTaskArray[1],
        personId: mockTeacherArray[1].id,
        eduContents: [
          {
            ...mockEduContentArray[0],
            submitted: true
          },
          {
            ...mockEduContentArray[1],
            submitted: true
          }
        ],
        teacher: mockTeacherArray[1]
      }
    ];

    const constructedArray = tasksViewModel['getTasksWithRelationInfo$'](
      tasks$,
      eduContents$,
      dict$,
      teachers$
    );

    expect(constructedArray).toBeObservable(hot('(a|)', { a: expectedArray }));
  });

  it('should build TaskInstanceWithResults$', () => {
    const mockResultArray = [
      new ResultFixture({ id: 5, taskId: 1, personId: 9 }),
      new ResultFixture({ id: 6, taskId: 1, personId: 9 }),
      new ResultFixture({ id: 7, taskId: 2, personId: 9 }),
      new ResultFixture({ id: 8, taskId: 1, personId: 10 })
    ];

    const results$ = of(mockResultArray);

    const mockTaskInstanceArray = [
      new TaskInstanceFixture({
        id: 1,
        taskId: 1,
        personId: 9
      })
    ];

    const taskInstances$ = of(mockTaskInstanceArray);

    const tasks$ = of([
      new TaskFixture({ id: 1, eduContents: [] }) as TaskWithRelationsInterface,
      new TaskFixture({ id: 2, eduContents: [] }) as TaskWithRelationsInterface
    ]);

    const expectedInstances: TaskInstanceWithResultsInterface[] = [
      {
        ...new TaskInstanceFixture({
          id: 1,
          taskId: 1,
          personId: 9
        }),
        task: new TaskFixture({
          id: 1,
          eduContents: []
        }) as TaskWithRelationsInterface,
        results: [
          new ResultFixture({ id: 5, taskId: 1, personId: 9 }),
          new ResultFixture({ id: 6, taskId: 1, personId: 9 })
        ]
      }
    ];

    const constructedMap = tasksViewModel['getTaskInstancesWithRelations$'](
      results$,
      taskInstances$,
      tasks$
    );

    expect(constructedMap).toBeObservable(
      hot('(a|)', { a: expectedInstances })
    );
  });
});
