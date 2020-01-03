import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AUTH_SERVICE_TOKEN,
  DalState,
  EduContentBookActions,
  EduContentBookInterface,
  EduContentBookReducer,
  MethodActions,
  MethodReducer,
  StateFeatureBuilder
} from '@campus/dal';
import { Store, StoreModule } from '@ngrx/store';
import { hot } from 'jasmine-marbles';
import { AllowedMethodGuard } from './allowed-method.guard';

describe('AllowedMethodGuard', () => {
  let allowedMethodGuard: AllowedMethodGuard;
  let store: Store<DalState>;
  class MockRouter {
    navigate = () => {};
  }
  function expectAllowedMethod(
    routeBookParam: number,
    book: EduContentBookInterface,
    allowedMethods: number[],
    expectedResult: boolean
  ) {
    store.dispatch(
      new EduContentBookActions.EduContentBooksLoaded({
        eduContentBooks: [<EduContentBookInterface>book]
      })
    );
    store.dispatch(
      new MethodActions.AllowedMethodsLoaded({ methodIds: allowedMethods })
    );

    expect(
      allowedMethodGuard.canActivate(
        { params: { book: routeBookParam } as any } as ActivatedRouteSnapshot,
        <RouterStateSnapshot>{}
      )
    ).toBeObservable(hot('a', { a: expectedResult }));
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(
          {},
          {
            runtimeChecks: {
              strictStateImmutability: false,
              strictActionImmutability: false
            }
          }
        ),
        ...StateFeatureBuilder.getStoreModuleForFeatures([
          EduContentBookReducer,
          MethodReducer
        ]),
        RouterTestingModule
      ],
      providers: [
        AllowedMethodGuard,
        Store,
        { provide: Router, useClass: MockRouter },
        {
          provide: AUTH_SERVICE_TOKEN,
          useValue: {
            userId: 1
          }
        }
      ]
    });
    allowedMethodGuard = TestBed.get(AllowedMethodGuard);
    store = TestBed.get(Store);
  });

  it('should return true if book method is allowed', () => {
    expectAllowedMethod(
      1,
      <EduContentBookInterface>{ id: 1, methodId: 2 },
      [2],
      true
    );
  });
  it('should return false if book method is not allowed', () => {
    expectAllowedMethod(
      1,
      <EduContentBookInterface>{ id: 1, methodId: 2 },
      [3],
      false
    );
  });
  it('should return false if book book is not present', () => {
    expectAllowedMethod(
      1,
      <EduContentBookInterface>{ id: 2, methodId: 2 },
      [3],
      false
    );
  });
});
