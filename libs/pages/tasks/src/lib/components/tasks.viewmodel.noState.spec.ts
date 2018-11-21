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
  setListformat(stream: Observable<ListFormat>) {
    this.listFormat$ = stream;
  }

  setCurrentUser(stream: Observable<PersonInterface>) {
    this.currentUser$ = stream;
  }

  setLearningAreas(stream: Observable<LearningAreaInterface[]>) {
    this.learningAreas$ = stream;
  }

  setTeachers(stream: Observable<PersonInterface[]>) {
    this.teachers$ = stream;
  }

  setTasks(stream: Observable<TaskInterface[]>) {
    this.tasks$ = stream;
  }

  setEducontents(stream: Observable<EduContentInterface[]>) {
    this.educontents$ = stream;
  }

  setTaskInstances(stream: Observable<TaskInstanceInterface[]>) {
    this.taskInstances$ = stream;
  }

  setResults(stream: Observable<ResultInterface[]>) {
    this.results$ = stream;
  }

  setTaskEducontents(stream: Observable<TaskEduContentInterface[]>) {
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
        { provide: AUTH_SERVICE_TOKEN, useValue: {} },
        { provide: TasksResolver, useValue: { resolve: jest.fn() } },
        Store
      ]
    });
    tasksViewModel = TestBed.get(TasksViewModel) as TestViewModel;
  });

  it('should use the mockData', () => {
    tasksViewModel.setTasks(of([new TaskFixture()]));

    expect(tasksViewModel['tasks$']).toBeObservable(
      hot('(a|)', { a: [new TaskFixture()] })
    );
  });
});
