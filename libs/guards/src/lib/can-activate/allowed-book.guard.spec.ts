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
  StateFeatureBuilder
} from '@campus/dal';
import { Store, StoreModule } from '@ngrx/store';
import { hot } from 'jasmine-marbles';
import { AllowedBookGuard } from './allowed-book.guard';

describe('AllowedBookGuard', () => {
  let allowedBookGuard: AllowedBookGuard;
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

    expect(
      allowedBookGuard.canActivate(
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
          EduContentBookReducer
        ]),
        RouterTestingModule
      ],
      providers: [
        AllowedBookGuard,
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
    allowedBookGuard = TestBed.get(AllowedBookGuard);
    store = TestBed.get(Store);
  });

  it('should return true if book is present', () => {
    expectAllowedMethod(
      1,
      <EduContentBookInterface>{ id: 1, methodId: 2 },
      [2],
      true
    );
  });

  it('should return false if book is not present', () => {
    expectAllowedMethod(
      1,
      <EduContentBookInterface>{ id: 2, methodId: 2 },
      [3],
      false
    );
  });
});
