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
  Priority
} from '@campus/dal';
import { MockDate } from '@campus/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from '@nrwl/angular/testing';
import { configureTestSuite } from 'ng-bullet';
import { BehaviorSubject, Observable } from 'rxjs';
import { KabasTasksResolver } from '../components/kabas-tasks.resolver';
import { getTaskWithAssignmentAndEduContents } from '../components/kabas-tasks.viewmodel.selectors';
import { TaskWithAssigneesFixture } from '../interfaces/TaskWithAssignees.fixture';
import { TaskStatusEnum } from '../interfaces/TaskWithAssignees.interface';
import { PendingTaskGuard } from './pending-task.guard';

describe('PendingTaskGuard', () => {
  const uuid = '123';
  const taskId = 5;
  const activatedRouteSnapshot = <ActivatedRouteSnapshot>{
    params: {
      id: taskId
    } as unknown
  };
  const urlTree: UrlTree = new UrlTree();

  let shouldResolve$: BehaviorSubject<boolean>;

  let pendingTaskGuard: PendingTaskGuard;
  let store: MockStore<DalState>;
  let dateMock: MockDate;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        provideMockStore(),
        PendingTaskGuard,
        {
          provide: KabasTasksResolver,
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
    pendingTaskGuard = TestBed.get(PendingTaskGuard);
    store = TestBed.get(Store);
    dateMock = new MockDate();

    shouldResolve$ = new BehaviorSubject(true);
  });

  afterEach(() => {
    dateMock.returnRealDate();
  });

  function setCurrentTaskStatus(status: TaskStatusEnum) {
    return store.overrideSelector(
      getTaskWithAssignmentAndEduContents,
      new TaskWithAssigneesFixture({
        status
      })
    );
  }

  function canActivate() {
    return pendingTaskGuard.canActivate(
      activatedRouteSnapshot,
      <RouterStateSnapshot>{}
    ) as Observable<boolean>;
  }

  it('should return the UrlTree to redirect to when the task is active', () => {
    setCurrentTaskStatus(TaskStatusEnum.ACTIVE);

    expect(canActivate()).toBeObservable(
      hot('(a|)', {
        a: urlTree
      })
    );
  });

  it('should return the UrlTree to redirect to when the task is finished', () => {
    setCurrentTaskStatus(TaskStatusEnum.FINISHED);

    expect(canActivate()).toBeObservable(
      hot('(a|)', {
        a: urlTree
      })
    );
  });

  it('should return true when the task is pending', () => {
    setCurrentTaskStatus(TaskStatusEnum.PENDING);

    expect(canActivate()).toBeObservable(
      hot('(a|)', {
        a: true
      })
    );
  });

  it('should dispatch EffectFeedback when the guard returns false', done => {
    setCurrentTaskStatus(TaskStatusEnum.ACTIVE);
    jest.spyOn(store, 'dispatch');

    canActivate().subscribe(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        new EffectFeedbackActions.AddEffectFeedback({
          effectFeedback: new EffectFeedback({
            id: uuid,
            triggerAction: null,
            message:
              'Kan geen inhoud meer toevoegen: taak is al actief of voltooid.',
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
