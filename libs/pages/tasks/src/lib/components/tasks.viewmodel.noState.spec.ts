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
import { EduContentWithSubmittedInterface } from './tasks.viewmodel.interfaces';

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
    const tasks$ = of([
      new TaskFixture({ id: 1, learningAreaId: 1 }),
      new TaskFixture({ id: 2, learningAreaId: 1 }),
      new TaskFixture({ id: 3, learningAreaId: 2 }),
      new TaskFixture({ id: 4, learningAreaId: 3 })
    ]);

    const expectedMap = new Map<Number, TaskInterface[]>([
      [
        1,
        [
          new TaskFixture({ id: 1, learningAreaId: 1 }),
          new TaskFixture({ id: 2, learningAreaId: 1 })
        ]
      ],
      [2, [new TaskFixture({ id: 3, learningAreaId: 2 })]],
      [3, [new TaskFixture({ id: 4, learningAreaId: 3 })]]
    ]);

    const constructedMap = tasksViewModel['getTasksPerLearningAreaId$'](tasks$);

    expect(constructedMap).toBeObservable(hot('(a|)', { a: expectedMap }));
  });

  it('should build EduContentIdsPerTaskId$', () => {
    const tasksEduContents$ = of([
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
    ]);

    const expectedMap = new Map<Number, Map<number, boolean>[]>([
      [
        1,
        [
          new Map<number, boolean>([[11, true]]),
          new Map<number, boolean>([[14, false]])
        ]
      ],
      [
        2,
        [
          new Map<number, boolean>([[12, true]]),
          new Map<number, boolean>([[11, true]])
        ]
      ]
    ]);

    const constructedMap = tasksViewModel['getEduContentIdsPerTaskId$'](
      tasksEduContents$
    );

    expect(constructedMap).toBeObservable(hot('(a|)', { a: expectedMap }));
  });

  it('getSubmittedPerEduContentId should cast taskEduContent to a Map<number,boolean>', () => {
    let taskEduContent = {
      ...new TaskEduContentFixture({ eduContentId: 1 }),
      submitted: true
    } as TaskEduContentWithSubmittedInterface;
    let expectedMap = new Map<number, boolean>([[1, true]]);

    expect(
      tasksViewModel['getSubmittedPerEduContentId'](taskEduContent)
    ).toEqual(expectedMap);

    taskEduContent = {
      ...new TaskEduContentFixture({ eduContentId: 2 }),
      submitted: false
    } as TaskEduContentWithSubmittedInterface;
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
    const tasks$ = of([
      new TaskFixture({ id: 5, personId: 1 }),
      new TaskFixture({ id: 6, personId: 2 }),
      new TaskFixture({ id: 7, personId: 2 }),
      new TaskFixture({ id: 8, personId: 3 })
    ]);

    const expectedMap = new Map<Number, TaskInterface[]>([
      [1, [new TaskFixture({ id: 5, personId: 1 })]],
      [
        2,
        [
          new TaskFixture({ id: 6, personId: 2 }),
          new TaskFixture({ id: 7, personId: 2 })
        ]
      ],
      [3, [new TaskFixture({ id: 8, personId: 3 })]]
    ]);

    const constructedMap = tasksViewModel['getTasksPerTeacherId$'](tasks$);

    expect(constructedMap).toBeObservable(hot('(a|)', { a: expectedMap }));
  });

  it('should build ResultsPerTaskId$', () => {
    const results$ = of([
      new ResultFixture({ id: 5, taskId: 1 }),
      new ResultFixture({ id: 6, taskId: 2 }),
      new ResultFixture({ id: 7, taskId: 2 }),
      new ResultFixture({ id: 8, taskId: 3 })
    ]);

    const expectedMap = new Map<Number, ResultInterface[]>([
      [1, [new ResultFixture({ id: 5, taskId: 1 })]],
      [
        2,
        [
          new ResultFixture({ id: 6, taskId: 2 }),
          new ResultFixture({ id: 7, taskId: 2 })
        ]
      ],
      [3, [new ResultFixture({ id: 8, taskId: 3 })]]
    ]);

    const constructedMap = tasksViewModel['getResultsPerTaskId$'](results$);

    expect(constructedMap).toBeObservable(hot('(a|)', { a: expectedMap }));
  });

  it('should build TasksWithRelationInfo$', () => {
    const tasks$ = of([new TaskFixture({ id: 1 }), new TaskFixture({ id: 2 })]);

    const eduContents$ = of([
      {
        ...new EduContentFixture(),
        submitted: true
      } as EduContentWithSubmittedInterface,
      {
        ...new EduContentFixture({ id: 2 }),
        submitted: false
      } as EduContentWithSubmittedInterface
    ]);

    const dict$ = of(
      new Map<number, Map<number, boolean>[]>([
        [
          1,
          [
            new Map<number, boolean>([[11, true]]),
            new Map<number, boolean>([[14, false]])
          ]
        ],
        [
          2,
          [
            new Map<number, boolean>([[12, true]]),
            new Map<number, boolean>([[11, true]])
          ]
        ]
      ])
    );

    const teachers$ = of([
      new PersonFixture({ id: 186 }),
      new PersonFixture({ id: 187 })
    ]);

    const expectedArray = [];

    const constructedArray = tasksViewModel['getTasksWithRelationInfo$'](
      tasks$,
      eduContents$,
      dict$,
      teachers$
    );

    expect(constructedArray).toBeObservable(hot('(a|)', { a: expectedArray }));
  });

  it('should build TaskInstanceWithResults$', () => {
    const results$ = of([
      new ResultFixture({ id: 5, taskId: 1, personId: 9 }),
      new ResultFixture({ id: 6, taskId: 1, personId: 9 }),
      new ResultFixture({ id: 7, taskId: 2, personId: 9 }),
      new ResultFixture({ id: 8, taskId: 1, personId: 10 })
    ]);

    const taskInstances$ = of([
      new TaskInstanceFixture({
        id: 1,
        taskId: 1,
        personId: 9
      })
    ]);

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
