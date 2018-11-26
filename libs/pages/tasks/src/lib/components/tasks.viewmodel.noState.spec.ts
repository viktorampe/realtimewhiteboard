import { Inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  AlertService,
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  DalState,
  EduContentFixture,
  EduContentInterface,
  LearningAreaInterface,
  StateFeatureBuilder,
  TaskEduContentFixture,
  TaskEduContentInterface,
  TaskFixture,
  TaskInstanceFixture,
  TaskInstanceInterface,
  TaskInterface
} from '@campus/dal';
import { ListFormat } from '@campus/ui';
import { PersonInterface } from '@diekeure/polpo-api-angular-sdk';
import { Store, StoreModule } from '@ngrx/store';
import { hot } from '@nrwl/nx/testing';
import { Observable, of } from 'rxjs';
import { LearningAreaFixture } from './../../../../../dal/src/lib/+fixtures/LearningArea.fixture';
import { TasksResolver } from './tasks.resolver';
import {
  TaskInstanceWithResultsInterface,
  TasksViewModel,
  TaskWithRelationsInterface
} from './tasks.viewmodel';
import {
  EduContentWithSubmittedInterface,
  TaskInstanceWithEduContentInfoInterface
} from './tasks.viewmodel.interfaces';

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

  setTaskEducontents$(stream: Observable<TaskEduContentInterface[]>) {
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

  it('should build TasksPerLearningAreaIdDict$', () => {
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

  it('should build EduContentIdsPerTaskIdDict$', () => {
    const mockTaskEduContentArray: TaskEduContentInterface[] = [
      new TaskEduContentFixture({
        id: 5,
        taskId: 1,
        eduContentId: 11,
        submitted: true
      }),
      new TaskEduContentFixture({
        id: 6,
        taskId: 2,
        eduContentId: 12,
        submitted: true
      }),
      new TaskEduContentFixture({
        id: 7,
        taskId: 2,
        eduContentId: 11,
        submitted: true
      }),
      new TaskEduContentFixture({
        id: 8,
        taskId: 1,
        eduContentId: 14,
        submitted: false
      })
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
    let taskEduContent: TaskEduContentInterface = new TaskEduContentFixture({
      eduContentId: 1,
      submitted: true
    });
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

  it('should build TasksWithRelationInfo$', () => {
    const mockTaskArray = [
      new TaskFixture({ id: 1, personId: 186 }),
      new TaskFixture({ id: 2, personId: 187 })
    ];

    const mockEduContentArray = [
      new EduContentFixture({ id: 3 }),
      new EduContentFixture({ id: 4 })
    ];

    const mockDictionary = new Map<number, Map<number, boolean>[]>([
      [
        1,
        [
          new Map<number, boolean>([[mockEduContentArray[0].id, true]]),
          new Map<number, boolean>([[mockEduContentArray[1].id, false]])
        ]
      ],
      [
        2,
        [
          new Map<number, boolean>([[mockEduContentArray[0].id, true]]),
          new Map<number, boolean>([[mockEduContentArray[1].id, true]])
        ]
      ]
    ]);

    const tasks$ = of(mockTaskArray);
    const eduContents$ = of(mockEduContentArray);
    const dict$ = of(mockDictionary);

    const expectedArray = [
      {
        ...mockTaskArray[0],
        eduContents: [
          {
            ...mockEduContentArray[0],
            submitted: true
          },
          {
            ...mockEduContentArray[1],
            submitted: false
          }
        ]
      },
      {
        ...mockTaskArray[1],
        eduContents: [
          {
            ...mockEduContentArray[0],
            submitted: true
          },
          {
            ...mockEduContentArray[1],
            submitted: true
          }
        ]
      }
    ];

    const constructedArray = tasksViewModel['getTasksWithRelationInfo$'](
      tasks$,
      eduContents$,
      dict$
    );

    expect(constructedArray).toBeObservable(hot('(a|)', { a: expectedArray }));
  });

  it('should build TasksWithInstance$', () => {
    const mockTasksArray: TaskWithRelationsInterface[] = [
      new TaskFixture({ id: 1, eduContents: [] }) as TaskWithRelationsInterface,
      new TaskFixture({ id: 2, eduContents: [] }) as TaskWithRelationsInterface
    ];

    const mockTaskInstanceArray: TaskInstanceWithResultsInterface[] = [
      {
        ...new TaskInstanceFixture({
          id: 1,
          taskId: mockTasksArray[0].id
        }),
        task: mockTasksArray[0]
      },
      {
        ...new TaskInstanceFixture({
          id: 2,
          taskId: mockTasksArray[1].id
        }),

        task: mockTasksArray[1]
      }
    ];

    const taskInstances$ = of(mockTaskInstanceArray);
    const tasks$ = of(mockTasksArray);

    const constructedTasks = tasksViewModel['getTasksWithInstances$'](
      taskInstances$,
      tasks$
    );

    const expectedTasks = [
      { ...mockTasksArray[0], instance: mockTaskInstanceArray[0] },
      { ...mockTasksArray[1], instance: mockTaskInstanceArray[1] }
    ];

    expect(constructedTasks).toBeObservable(hot('(a|)', { a: expectedTasks }));
  });

  it('should build TaskInstancesByLearningAreaIdDict$', () => {
    const mockEduContentArray = [
      new EduContentFixture({ id: 5 }),
      new EduContentFixture({ id: 6 })
    ];

    const mockTaskArray: TaskWithRelationsInterface[] = [
      new TaskFixture({
        id: 1,
        eduContents: [mockEduContentArray[0]],
        learningAreaId: 7
      }) as TaskWithRelationsInterface,
      new TaskFixture({
        id: 2,
        eduContents: mockEduContentArray,
        learningAreaId: 8
      }) as TaskWithRelationsInterface
    ];

    const mockTaskEduContentArray: TaskEduContentInterface[] = [
      new TaskEduContentFixture({ id: 1, eduContentId: 5, submitted: true }),
      new TaskEduContentFixture({ id: 2, eduContentId: 6, submitted: true })
    ];

    const mockTaskInstanceArray: TaskInstanceWithEduContentInfoInterface[] = [
      {
        taskInstance: new TaskInstanceFixture({
          id: 1,
          taskId: mockTaskArray[0].id,
          task: mockTaskArray[0]
        }),
        taskEduContentsCount: 1,
        taskEduContents: [mockTaskEduContentArray[0]],
        finished: true
      },
      {
        taskInstance: new TaskInstanceFixture({
          id: 2,
          taskId: mockTaskArray[1].id,
          task: mockTaskArray[1]
        }),
        taskEduContentsCount: 1,
        taskEduContents: mockTaskEduContentArray,
        finished: true
      }
    ];

    const taskInstances$ = of(mockTaskInstanceArray);

    const constructedDict = tasksViewModel[
      'getTaskInstancesByLearningAreaIdDict$'
    ](taskInstances$);

    const expectedDict: Map<
      number,
      TaskInstanceWithEduContentInfoInterface[]
    > = new Map<number, TaskInstanceWithEduContentInfoInterface[]>([
      [7, [mockTaskInstanceArray[0]]],
      [8, [mockTaskInstanceArray[1]]]
    ]);

    expect(constructedDict).toBeObservable(hot('(a|)', { a: expectedDict }));
  });

  it('should build LearningAreasWithTasks', () => {
    const mockLearningAreaArray = [
      new LearningAreaFixture({ id: 8 }),
      new LearningAreaFixture({ id: 9 })
    ];

    const mockTasksArray: TaskWithRelationsInterface[] = [
      new TaskFixture({
        id: 1,
        learningAreaId: 8
      }) as TaskWithRelationsInterface,
      new TaskFixture({
        id: 2,
        learningAreaId: 9
      }) as TaskWithRelationsInterface,
      new TaskFixture({
        id: 3,
        learningAreaId: 8
      }) as TaskWithRelationsInterface
    ];

    const learningAreas$ = of(mockLearningAreaArray);
    const tasksWithInstance$ = of(mockTasksArray);

    const constructedLearningAreas = tasksViewModel[
      'getLearningAreasWithTasks$'
    ](learningAreas$, tasksWithInstance$);

    const expectedLearningAreas = [
      {
        ...mockLearningAreaArray[0],
        tasks: [mockTasksArray[0], mockTasksArray[2]]
      },
      {
        ...mockLearningAreaArray[1],
        tasks: [mockTasksArray[1]]
      }
    ];

    expect(constructedLearningAreas).toBeObservable(
      hot('(a|)', { a: expectedLearningAreas })
    );
  });

  it('should build TaskInstancesWithEduContents', () => {
    const mockTaskEduContentArray: TaskEduContentInterface[] = [
      new TaskEduContentFixture({
        id: 5,
        taskId: 1,
        eduContentId: 11,
        submitted: true
      }),
      new TaskEduContentFixture({
        id: 6,
        taskId: 2,
        eduContentId: 12,
        submitted: true
      }),
      new TaskEduContentFixture({
        id: 7,
        taskId: 2,
        eduContentId: 11,
        submitted: true
      })
    ];

    const mockTaskInstanceArray = [
      new TaskInstanceFixture({ id: 3 }),
      new TaskInstanceFixture({ id: 4 })
    ];

    const mockTaskArray: TaskWithRelationsInterface[] = [
      {
        ...new TaskFixture({
          id: 1,
          taskEduContents: [mockTaskEduContentArray[0]]
        }),
        instance: mockTaskInstanceArray[0],
        finished: true
      } as TaskWithRelationsInterface,
      {
        ...new TaskFixture({
          id: 2,
          taskEduContents: [
            mockTaskEduContentArray[1],
            mockTaskEduContentArray[2]
          ]
        }),
        instance: mockTaskInstanceArray[1],
        finished: false
      } as TaskWithRelationsInterface
    ];

    const tasksWithInstance$ = of(mockTaskArray);

    const constructedTasks = tasksViewModel['getTaskInstancesWithEduContents$'](
      tasksWithInstance$
    );

    const expectedTasks: TaskInstanceWithEduContentInfoInterface[] = [
      {
        taskInstance: mockTaskInstanceArray[0],
        taskEduContents: mockTaskArray[0].taskEduContents,
        taskEduContentsCount: 1,
        finished: true
      },
      {
        taskInstance: mockTaskInstanceArray[1],
        taskEduContents: mockTaskArray[1].taskEduContents,
        taskEduContentsCount: 2,
        finished: false
      }
    ];

    expect(constructedTasks).toBeObservable(hot('(a|)', { a: expectedTasks }));
  });

  it('isTaskFinished should determine if a TaskWithRelations is finished', () => {
    const mockEduContentsArray: EduContentWithSubmittedInterface[] = [
      { ...new EduContentFixture({ id: 1 }), submitted: true },
      { ...new EduContentFixture({ id: 2 }), submitted: true },
      { ...new EduContentFixture({ id: 3 }), submitted: true },
      { ...new EduContentFixture({ id: 4 }), submitted: false },
      { ...new EduContentFixture({ id: 5 }), submitted: false }
    ];

    const mockTask = {
      ...new TaskFixture(),
      eduContents: mockEduContentsArray
    } as TaskWithRelationsInterface;

    let constructedFinished = tasksViewModel['isTaskFinished'](mockTask);

    expect(constructedFinished).toBe(false);

    mockTask.eduContents = [mockEduContentsArray[0]];

    constructedFinished = tasksViewModel['isTaskFinished'](mockTask);

    expect(constructedFinished).toBe(true);

    mockTask.eduContents = [
      mockEduContentsArray[0],
      mockEduContentsArray[1],
      mockEduContentsArray[2]
    ];

    constructedFinished = tasksViewModel['isTaskFinished'](mockTask);

    expect(constructedFinished).toBe(true);
  });
});
