import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  Alert,
  AlertActions,
  AlertFixture,
  AlertReducer,
  AUTH_SERVICE_TOKEN,
  PersonInterface,
  StateFeatureBuilder,
  UiActions,
  UserActions,
  UserReducer
} from '@campus/dal';
import { BreadcrumbLinkInterface, NotificationItemInterface } from '@campus/ui';
import { Store, StoreModule } from '@ngrx/store';
import { hot } from '@nrwl/nx/testing';
import { BehaviorSubject } from 'rxjs';
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
let unreadAlerts: Alert[];
let usedUserState: any;
let usedUnreadAlertsState: any;
let spy: jest.SpyInstance;
let dispatchSpy: jest.SpyInstance;

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
    dispatchSpy = jest.spyOn(TestBed.get(Store), 'dispatch');
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

  describe('display streams', () => {
    it('should setup the unread alert count stream', () => {
      const expected = unreadAlerts.length;
      expect(headerViewModel.unreadAlertCount$).toBeObservable(
        hot('a', { a: expected })
      );
    });
    it('should setup the alert notifications stream', () => {
      const expected: NotificationItemInterface[] = unreadAlerts.map(
        (alert: Alert) => {
          return {
            icon: alert.icon,
            titleText: alert.title,
            link: alert.link,
            notificationText: alert.message,
            notificationDate: new Date(alert.sentAt)
          };
        }
      );

      expect(headerViewModel.alertNotifications$).toBeObservable(
        hot('a', { a: expected })
      );
    });

    describe('should setup the back link stream', () => {
      it('should return a link when one is available', () => {
        // headerViewModel.breadCrumbs$ = new MockHeaderViewModel().breadCrumbs$;
        const expected = '/link';
        expect(headerViewModel.backLink$).toBeObservable(
          hot('a', { a: expected })
        );
      });

      it('should not return a link when none is available', () => {
        headerViewModel.breadCrumbs$ = new BehaviorSubject<
          BreadcrumbLinkInterface[]
        >([]);
        headerViewModel['loadDisplayStream'](); // need to trigger this, otherwise breadcrumbs$ won't be reset
        const expected = undefined;
        expect(headerViewModel.backLink$).toBeObservable(
          hot('a', { a: expected })
        );
      });
    });
  });

  describe('user interactions', () => {
    it('should set alert as read', () => {
      headerViewModel.setAlertAsRead(1);
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        new AlertActions.SetReadAlert({
          alertIds: 1,
          personId: 1,
          read: true
        })
      );
    });

    it('should toggle the side nav', () => {
      headerViewModel.toggleSideNav();
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(new UiActions.ToggleSideNav());
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
    new AlertFixture({ id: 1, sentAt: new Date(), type: 'bundle' }),
    new AlertFixture({ id: 2, sentAt: new Date(), type: 'educontent' })
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
