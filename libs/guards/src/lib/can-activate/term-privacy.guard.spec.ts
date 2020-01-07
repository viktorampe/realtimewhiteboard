import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { WINDOW } from '@campus/browser';
import {
  DalState,
  PersonFixture,
  StateFeatureBuilder,
  UserActions,
  UserReducer
} from '@campus/dal';
import { ENVIRONMENT_TERM_PRIVACY_TOKEN } from '@campus/shared';
import { MockWindow } from '@campus/testing';
import { Store, StoreModule } from '@ngrx/store';
import { hot } from 'jasmine-marbles';
import { TermPrivacyGuard } from '.';

describe('TermPrivacyGuard', () => {
  let termPrivacyGuard: TermPrivacyGuard;
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
        StoreModule.forRoot(
          {},
          {
            runtimeChecks: {
              strictStateImmutability: false,
              strictActionImmutability: false
            }
          }
        ),
        ...StateFeatureBuilder.getStoreModuleForFeatures([UserReducer]),
        RouterTestingModule
      ],
      providers: [
        TermPrivacyGuard,
        Store,
        { provide: Router, useClass: MockRouter },
        {
          provide: ENVIRONMENT_TERM_PRIVACY_TOKEN,
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
    termPrivacyGuard = TestBed.get(TermPrivacyGuard);
    window = TestBed.get(WINDOW);
    store = TestBed.get(Store);
    assignSpy = jest.spyOn(window.location, 'assign');
  });
  it('should dispatch a loadUser action', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    termPrivacyGuard.canActivate(
      <ActivatedRouteSnapshot>{},
      <RouterStateSnapshot>{}
    );
    expect(dispatchSpy).toHaveBeenCalledWith(new UserActions.LoadUser({}));
  });
  it('should not return anything while the user is not loaded', () => {
    expect(
      termPrivacyGuard.canActivate(
        <ActivatedRouteSnapshot>{},
        <RouterStateSnapshot>{}
      )
    ).toBeObservable(hot(''));
    expect(assignSpy).not.toHaveBeenCalled();
  });
  it('should return true if the user is loaded and terms is true', () => {
    store.dispatch(
      new UserActions.UserLoaded(new PersonFixture({ terms: true }))
    );
    expect(
      termPrivacyGuard.canActivate(
        <ActivatedRouteSnapshot>{},
        <RouterStateSnapshot>{}
      )
    ).toBeObservable(hot('a', { a: true }));
    expect(assignSpy).toHaveBeenCalledTimes(0);
  });
  it('should return false if the user is loaded and terms is false', () => {
    store.dispatch(
      new UserActions.UserLoaded(new PersonFixture({ terms: false }))
    );
    expect(
      termPrivacyGuard.canActivate(
        <ActivatedRouteSnapshot>{},
        <RouterStateSnapshot>{}
      )
    ).toBeObservable(hot('a', { a: false }));
    expect(assignSpy).toHaveBeenCalledTimes(1);
    expect(assignSpy).toHaveBeenCalledWith('some-redirect-url');
  });
});
