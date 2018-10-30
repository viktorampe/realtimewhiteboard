import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  AUTH_SERVICE_TOKEN,
  PersonInterface,
  StateFeatureBuilder,
  UserActions,
  UserReducer
} from '@campus/dal';
import { Store, StoreModule } from '@ngrx/store';
import { hot } from '@nrwl/nx/testing';
import {
  EnvironmentAlertsFeatureInterface,
  EnvironmentMessagesFeatureInterface,
  ENVIRONMENT_ALERTS_FEATURE_TOKEN,
  ENVIRONMENT_MESSAGES_FEATURE_TOKEN
} from '../interfaces';
import { HeaderResolver } from './header.resolver';
import { HeaderViewModel } from './header.viewmodel';

let environmentMessagesFeature: EnvironmentMessagesFeatureInterface = {
  enabled: false,
  hasAppBarDropDown: false
};
let environmentAlertsFeature: EnvironmentAlertsFeatureInterface = {
  enabled: false,
  hasAppBarDropDown: false
};
let headerViewModel: HeaderViewModel;
let usedUserState: any;
let spy;

@Injectable({
  providedIn: 'root'
})
class MockHeaderResolver {
  resolve = spy;
}

describe('headerViewModel', () => {
  afterEach(() => {
    jest.clearAllMocks();
    usedUserState = {};
  });
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        ...StateFeatureBuilder.getModuleWithForFeatureProviders([
          {
            NAME: UserReducer.NAME,
            reducer: UserReducer.reducer,
            initialState: {
              initialState: usedUserState
            }
          }
        ])
      ],
      providers: [
        HeaderViewModel,
        {
          provide: ENVIRONMENT_ALERTS_FEATURE_TOKEN,
          useValue: environmentAlertsFeature
        },
        {
          provide: ENVIRONMENT_MESSAGES_FEATURE_TOKEN,
          useValue: environmentMessagesFeature
        },
        { provide: AUTH_SERVICE_TOKEN, useValue: {} },
        Store,
        { provide: HeaderResolver, useClass: MockHeaderResolver }
      ]
    });
    headerViewModel = TestBed.get(HeaderViewModel);
  });
  describe('creation', () => {
    beforeAll(() => {
      // usedState = UserReducer.initialState;
      spy = jest.fn();
    });
    it('should be defined', () => {
      expect(headerViewModel).toBeDefined();
    });
    it('should call the headerResolver.resolve', () => {
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
  describe('feature toggles', () => {
    function checkFeatureToggles(
      enabled: boolean,
      hasAppBarDropDown: boolean,
      expectedResult
    ) {
      describe(`env enabled is ${enabled} and hasAppBarDropDown is ${hasAppBarDropDown}`, () => {
        beforeAll(() => {
          usedUserState = UserReducer.initialState;
          environmentMessagesFeature = {
            enabled: enabled,
            hasAppBarDropDown: hasAppBarDropDown
          };
          environmentAlertsFeature = {
            enabled: enabled,
            hasAppBarDropDown: hasAppBarDropDown
          };
        });
        it(`should be ${expectedResult}`, () => {
          expect(headerViewModel.enableAlerts).toBe(expectedResult);
          expect(headerViewModel.enableMessages).toBe(expectedResult);
        });
      });
    }
    checkFeatureToggles(true, true, true);
    checkFeatureToggles(true, false, false);
    checkFeatureToggles(false, false, false);
    checkFeatureToggles(false, true, false);
  });
  describe('state streams', () => {
    let user: PersonInterface;
    beforeAll(() => {
      user = { email: 'email expected' };
      usedUserState = UserReducer.reducer(
        UserReducer.initialState,
        new UserActions.UserLoaded(user)
      );
    });
    it('should get the user from the provided state', () => {
      expect(headerViewModel.currentUser$).toBeObservable(
        hot('a', { a: user })
      );
    });
  });
});
