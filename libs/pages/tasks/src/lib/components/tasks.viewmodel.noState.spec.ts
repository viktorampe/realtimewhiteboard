//file.only
import { Inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  DalState,
  EduContentInterface,
  LearningAreaInterface,
  ResultInterface,
  StateFeatureBuilder,
  TaskEduContentFixture,
  TaskEduContentInterface,
  TaskFixture,
  TaskInstanceInterface,
  TaskInterface
} from '@campus/dal';
import { ListFormat } from '@campus/ui';
import { PersonInterface } from '@diekeure/polpo-api-angular-sdk';
import { Store, StoreModule } from '@ngrx/store';
import { hot } from '@nrwl/nx/testing';
import { Observable, of } from 'rxjs';
import { TasksResolver } from './tasks.resolver';
import { TasksViewModel } from './tasks.viewmodel';

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
    this.educontents$ = stream;
  }

  setTaskInstances$(stream: Observable<TaskInstanceInterface[]>) {
    this.taskInstances$ = stream;
  }

  setResults$(stream: Observable<ResultInterface[]>) {
    this.results$ = stream;
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
    tasksResolver: TasksResolver
  ) {
    super(store, authService, tasksResolver);
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
        Store
      ]
    });
    tasksViewModel = TestBed.get(TasksViewModel) as TestViewModel;
  });

  it('should build TaskIdsPerLearningAreaId$', () => {
    const tasks$ = of([
      new TaskFixture({ id: 1, learningAreaId: 1 }),
      new TaskFixture({ id: 2, learningAreaId: 1 }),
      new TaskFixture({ id: 3, learningAreaId: 2 }),
      new TaskFixture({ id: 4, learningAreaId: 3 })
    ]);

    const expectedMap = new Map<Number, Number[]>([
      [1, [1, 2]],
      [2, [3]],
      [3, [4]]
    ]);

    const constructedMap = tasksViewModel['getTaskIdsPerLearningAreaId$'](
      tasks$
    );

    expect(constructedMap).toBeObservable(hot('(a|)', { a: expectedMap }));
  });

  it('should build EduContentIdsPerTaskId$', () => {
    const tasksEduContents$ = of([
      new TaskEduContentFixture({ id: 5, taskId: 1, eduContentId: 1 }),
      new TaskEduContentFixture({ id: 6, taskId: 2, eduContentId: 2 }),
      new TaskEduContentFixture({ id: 7, taskId: 2, eduContentId: 1 }),
      new TaskEduContentFixture({ id: 8, taskId: 1, eduContentId: 4 })
    ]);

    const expectedMap = new Map<Number, Number[]>([[1, [1, 4]], [2, [2, 1]]]);

    const constructedMap = tasksViewModel['getEduContentIdsPerTaskId$'](
      tasksEduContents$
    );

    expect(constructedMap).toBeObservable(hot('(a|)', { a: expectedMap }));
  });

  it(' flattenArrayToUniqueValues should reduce a nested array to an array of unique values', () => {
    const dictionary = new Map<Number, Number[]>([[1, [1, 4]], [2, [2, 1]]]);

    const expectedArray = [1, 2, 4];

    const reducedArray = tasksViewModel['flattenArrayToUniqueValues'](
      Array.from(dictionary.values())
    );

    expect(reducedArray).toEqual(expectedArray);
  });
});
