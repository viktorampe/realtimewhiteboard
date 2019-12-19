import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { WINDOW } from '@campus/browser';
import { AUTH_SERVICE_TOKEN, DalState, PersonFixture, StateFeatureBuilder, UserActions, UserReducer } from '@campus/dal';
import { ENVIRONMENT_LOGIN_TOKEN } from '@campus/shared';
import { MockWindow } from '@campus/testing';
import { Store, StoreModule } from '@ngrx/store';
import { hot } from 'jasmine-marbles';
import { AuthenticationGuard } from '.';

describe('AuthenticationGuard', () => {
  let authenticationGuard: AuthenticationGuard;
  let isLoggedInMock: boolean;
  let assignSpy: jest.SpyInstance;
  let store: Store<DalState>;
  let window: Window;
  class MockRouter {
    navigate = assignSpy;
  }

  afterEach(() => {
    jest.resetAllMocks();
  });
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
                StoreModule.forRoot({},{
          runtimeChecks: {
            strictStateImmutability: false,
            strictActionImmutability: false
          }}),
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
            },
            loginWithToken: jest.fn()
          }
        },
        {
          provide: ENVIRONMENT_LOGIN_TOKEN,
          useValue: {
            url: 'some-redirect-url'
          }
        },
        {
          provide: WINDOW,
          useClass: MockWindow
        }
      ]
    });
    authenticationGuard = TestBed.get(AuthenticationGuard);
    window = TestBed.get(WINDOW);
    store = TestBed.get(Store);
    assignSpy = jest.spyOn(window.location, 'assign');
  });
  it('should redirect to login if there are no credentials present', () => {
    isLoggedInMock = false;
    expect(
      authenticationGuard.canActivate(
        <ActivatedRouteSnapshot>{ queryParams: {} },
        <RouterStateSnapshot>{}
      )
    ).toBe(false);
    expect(assignSpy).toHaveBeenCalledTimes(1);
    expect(assignSpy).toHaveBeenCalledWith('some-redirect-url');
  });
  it('should not return if credentials are present while UserQueries.getLoaded is false', () => {
    isLoggedInMock = true;
    expect(
      authenticationGuard.canActivate(
        <ActivatedRouteSnapshot>{ queryParams: {} },
        <RouterStateSnapshot>{}
      )
    ).toBeObservable(hot(''));
    expect(assignSpy).toHaveBeenCalledTimes(0);
  });
  it('should return nothing if credentials are present while UserQueries.getLoaded is true but permissionsLoaded is false', () => {
    isLoggedInMock = true;
    store.dispatch(new UserActions.UserLoaded(new PersonFixture()));
    expect(
      authenticationGuard.canActivate(
        <ActivatedRouteSnapshot>{ queryParams: {} },
        <RouterStateSnapshot>{}
      )
    ).toBeObservable(hot(''));
    expect(assignSpy).toHaveBeenCalledTimes(0);
  });
  it('should return true if credentials are present while UserQueries.getLoaded is true and permissionsLoaded is true', () => {
    isLoggedInMock = true;
    store.dispatch(new UserActions.UserLoaded(new PersonFixture()));
    store.dispatch(new UserActions.PermissionsLoaded([]));
    expect(
      authenticationGuard.canActivate(
        <ActivatedRouteSnapshot>{ queryParams: {} },
        <RouterStateSnapshot>{}
      )
    ).toBeObservable(hot('a', { a: true }));
    expect(assignSpy).toHaveBeenCalledTimes(0);
  });

  it('should call authservice loginWithToken when provided in routes', () => {
    const spy = TestBed.get(AUTH_SERVICE_TOKEN).loginWithToken;
    canActivate({
      accessToken: 'test',
      userId: '1'
    });
    expect(spy).toHaveBeenCalled();

    canActivate({ accessToken: 'test' });
    expect(spy).not.toHaveBeenCalled();

    canActivate({ userId: 'test' });
    expect(spy).not.toHaveBeenCalled();

    canActivate({});
    expect(spy).not.toHaveBeenCalled();

    function canActivate(params) {
      spy.mockReset();
      authenticationGuard.canActivate(
        <ActivatedRouteSnapshot>{
          queryParams: params
        },
        <RouterStateSnapshot>{}
      );
    }
  });
});
