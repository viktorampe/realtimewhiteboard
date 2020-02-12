import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
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
    store.overrideSelector(
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

  it('should not run when the resolver is not ready', fakeAsync(() => {
    shouldResolve$.next(false);

    jest.spyOn(store, 'select');

    canActivate().subscribe(() => {});

    tick(100);

    expect(store.select).not.toHaveBeenCalled();
  }));

  it('should select the right taskWithAssignees from the store', done => {
    setCurrentTaskStatus(TaskStatusEnum.ACTIVE);

    jest.spyOn(store, 'select');

    canActivate().subscribe(() => {
      expect(
        store.select
      ).toHaveBeenCalledWith(getTaskWithAssignmentAndEduContents, { taskId });

      done();
    });
  });

  it('should return false when the task is active', () => {
    setCurrentTaskStatus(TaskStatusEnum.ACTIVE);

    expect(canActivate()).toBeObservable(
      hot('(a|)', {
        a: false
      })
    );
  });

  it('should return false when the task is finished', () => {
    setCurrentTaskStatus(TaskStatusEnum.FINISHED);

    expect(canActivate()).toBeObservable(
      hot('(a|)', {
        a: false
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
