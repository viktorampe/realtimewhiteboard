import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  DalState,
  EffectFeedback,
  EffectFeedbackActions,
  Priority,
  TaskInstanceFixture,
  TaskInstanceInterface,
  TaskInstanceQueries
} from '@campus/dal';
import { MockDate } from '@campus/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from '@nrwl/angular/testing';
import { configureTestSuite } from 'ng-bullet';
import { BehaviorSubject, Observable } from 'rxjs';
import { StudentTaskOverviewResolver } from '../components/student-task-overview/student-task-overview.resolver';
import { ValidTaskInstanceGuard } from './valid-task-instance.guard';
describe('ValidTaskInstanceGuard', () => {
  const uuid = '123';
  const taskInstanceId = 5;
  const activatedRouteSnapshot = <ActivatedRouteSnapshot>{
    params: {
      id: taskInstanceId
    } as unknown
  };
  const urlTree: UrlTree = new UrlTree();
  const dateMock = new MockDate();

  let shouldResolve$: BehaviorSubject<boolean>;

  let validInstanceGuard: ValidTaskInstanceGuard;
  let store: MockStore<DalState>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        provideMockStore(),
        ValidTaskInstanceGuard,
        {
          provide: StudentTaskOverviewResolver,
          useValue: {
            resolve: () => shouldResolve$
          }
        },
        {
          provide: 'uuid',
          useValue: () => uuid
        },
        {
          provide: Router,
          useValue: {
            createUrlTree: () => urlTree
          }
        }
      ]
    });
  });

  beforeEach(() => {
    validInstanceGuard = TestBed.get(ValidTaskInstanceGuard);
    store = TestBed.get(Store);

    shouldResolve$ = new BehaviorSubject(true);
  });

  afterAll(() => {
    dateMock.returnRealDate();
  });

  function setTaskInstance(taskInstance: TaskInstanceInterface) {
    return store.overrideSelector(TaskInstanceQueries.getById, taskInstance);
  }

  function canActivate() {
    return validInstanceGuard.canActivate(
      activatedRouteSnapshot,
      <RouterStateSnapshot>{}
    ) as Observable<boolean>;
  }

  it('should return the UrlTree to redirect to when the taskInstance does not exist', () => {
    setTaskInstance(null);

    expect(canActivate()).toBeObservable(
      hot('(a|)', {
        a: urlTree
      })
    );
  });

  it('should return true when the taskInstance exists', () => {
    setTaskInstance(new TaskInstanceFixture());

    expect(canActivate()).toBeObservable(
      hot('(a|)', {
        a: true
      })
    );
  });

  it('should dispatch EffectFeedback when the guard returns false', done => {
    setTaskInstance(null);
    jest.spyOn(store, 'dispatch');

    canActivate().subscribe(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        new EffectFeedbackActions.AddEffectFeedback({
          effectFeedback: new EffectFeedback({
            id: uuid,
            triggerAction: null,
            message: 'De taak bestaat niet of is niet aan jou toegekend.',
            type: 'error',
            userActions: [],
            priority: Priority.HIGH
          })
        })
      );

      done();
    });
  });
});
