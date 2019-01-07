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
  PersonFixture,
  StateFeatureBuilder,
  UserActions,
  UserReducer
} from '@campus/dal';
import { Store, StoreModule } from '@ngrx/store';
import { hot } from 'jasmine-marbles';
import { AuthenticationGuard } from '.';

describe('AuthenticationGuard', () => {
  let authenticationGuard: AuthenticationGuard;
  let isLoggedInMock: boolean;
  const navigateSpy = jest.fn();
  let store: Store<DalState>;
  class MockRouter {
    navigate = navigateSpy;
  }

  afterEach(() => {
    jest.resetAllMocks();
  });
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        ...StateFeatureBuilder.getStoreModuleForFeatures([UserReducer]),
        RouterTestingModule
      ],
      providers: [
        AuthenticationGuard,
        Store,
        { provide: Router, useClass: MockRouter },
        {
          provide: AUTH_SERVICE_TOKEN,
          useValue: {
            isLoggedIn: () => {
              return isLoggedInMock;
            }
          }
        }
      ]
    });
    authenticationGuard = TestBed.get(AuthenticationGuard);
    store = TestBed.get(Store);
  });
  it('should redirect to login if there are no credentials present', () => {
    isLoggedInMock = false;
    expect(
      authenticationGuard.canActivate(
        <ActivatedRouteSnapshot>{},
        <RouterStateSnapshot>{}
      )
    ).toBe(false);
    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
  it('should not return if credentials are present while UserQueries.getLoaded is false', () => {
    isLoggedInMock = true;
    expect(
      authenticationGuard.canActivate(
        <ActivatedRouteSnapshot>{},
        <RouterStateSnapshot>{}
      )
    ).toBeObservable(hot(''));
    expect(navigateSpy).toHaveBeenCalledTimes(0);
  });
  it('should return nothing if credentials are present while UserQueries.getLoaded is true but permissionsLoaded is false', () => {
    isLoggedInMock = true;
    store.dispatch(new UserActions.UserLoaded(new PersonFixture()));
    expect(
      authenticationGuard.canActivate(
        <ActivatedRouteSnapshot>{},
        <RouterStateSnapshot>{}
      )
    ).toBeObservable(hot(''));
    expect(navigateSpy).toHaveBeenCalledTimes(0);
  });
  it('should return true if credentials are present while UserQueries.getLoaded is true and permissionsLoaded is true', () => {
    isLoggedInMock = true;
    store.dispatch(new UserActions.UserLoaded(new PersonFixture()));
    store.dispatch(new UserActions.PermissionsLoaded([]));
    expect(
      authenticationGuard.canActivate(
        <ActivatedRouteSnapshot>{},
        <RouterStateSnapshot>{}
      )
    ).toBeObservable(hot('a', { a: true }));
    expect(navigateSpy).toHaveBeenCalledTimes(0);
  });
});
