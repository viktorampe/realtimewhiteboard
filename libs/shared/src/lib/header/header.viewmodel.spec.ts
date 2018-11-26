// file.only
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  AlertActions,
  AlertFixture,
  AlertQueueInterface,
  AlertReducer,
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
  ENVIRONMENT_ALERTS_FEATURE_TOKEN
} from '../interfaces/environment.features.interfaces';
import { HeaderResolver } from './header.resolver';
import { HeaderViewModel } from './header.viewmodel';

let environmentAlertsFeature: EnvironmentAlertsFeatureInterface = {
  enabled: false,
  hasAppBarDropDown: false
};
let headerViewModel: HeaderViewModel;
let user: PersonInterface;
let unreadAlerts: AlertQueueInterface[];
let usedUserState: any;
let usedUnreadAlertsState: any;
let spy: jest.SpyInstance;

@Injectable({
  providedIn: 'root'
})
class MockHeaderResolver {
  resolve = spy;
}

describe('headerViewModel', () => {
  afterEach(() => {
    jest.clearAllMocks();
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
          },
          {
            NAME: AlertReducer.NAME,
            reducer: AlertReducer.reducer,
            initialState: {
              initialState: usedUnreadAlertsState
            }
          }
        ])
      ],
      providers: [
        HeaderViewModel,
        {
          provide: AUTH_SERVICE_TOKEN,
          useValue: { userId: 1 }
        },
        {
          provide: ENVIRONMENT_ALERTS_FEATURE_TOKEN,
          useValue: environmentAlertsFeature
        },
        { provide: HeaderResolver, useClass: MockHeaderResolver },
        Store
      ]
    });
    headerViewModel = TestBed.get(HeaderViewModel);
  });
  describe('creation', () => {
    beforeAll(() => {
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
          environmentAlertsFeature = {
            enabled: enabled,
            hasAppBarDropDown: hasAppBarDropDown
          };
        });
        it(`should be ${expectedResult}`, () => {
          expect(headerViewModel.enableAlerts).toBe(expectedResult);
        });
      });
    }
    checkFeatureToggles(true, true, true);
    checkFeatureToggles(true, false, false);
    checkFeatureToggles(false, false, false);
    checkFeatureToggles(false, true, false);
  });
  describe('state streams', () => {
    beforeAll(() => {
      setInitialState();
    });
    it('should get the user from the provided state', () => {
      expect(headerViewModel.currentUser$).toBeObservable(
        hot('a', { a: user })
      );
    });

    it('should get unread alerts from the provided state', () => {
      expect(headerViewModel.unreadAlerts$).toBeObservable(
        hot('a', { a: unreadAlerts })
      );
    });
  });
});

function setInitialState() {
  user = { email: 'email expected' };
  usedUserState = UserReducer.reducer(
    UserReducer.initialState,
    new UserActions.UserLoaded(user)
  );

  unreadAlerts = [
    new AlertFixture({ id: 1, sentAt: new Date() }),
    new AlertFixture({ id: 2, sentAt: new Date() })
  ];
  usedUnreadAlertsState = AlertReducer.reducer(
    AlertReducer.initialState,
    new AlertActions.AlertsLoaded({
      alerts: unreadAlerts,
      timeStamp: Date.now()
    })
  );

  // TODO: add breadcrumbs state
}
