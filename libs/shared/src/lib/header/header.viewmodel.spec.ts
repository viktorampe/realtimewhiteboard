import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import {
  Alert,
  AlertActions,
  AlertFixture,
  AlertQueueInterface,
  AlertReducer,
  AUTH_SERVICE_TOKEN,
  DalState,
  PersonInterface,
  StateFeatureBuilder,
  UiActions,
  UiReducer,
  UserActions,
  UserReducer
} from '@campus/dal';
import { MockDate } from '@campus/testing';
import { Store, StoreModule } from '@ngrx/store';
import { hot } from '@nrwl/nx/testing';
import { QuickLinkTypeEnum } from '../components/quick-link/quick-link-type.enum';
import { QuickLinkComponent } from '../components/quick-link/quick-link.component';
import { ENVIRONMENT_ALERTS_FEATURE_TOKEN } from '../interfaces/environment.injectiontokens';
import { EnvironmentAlertsFeatureInterface } from '../interfaces/environment.interfaces';
import { AlertToNotificationItemPipe } from '../pipes/alert-to-notification/alert-to-notification-pipe';
import { HeaderViewModel } from './header.viewmodel';

let environmentAlertsFeature: EnvironmentAlertsFeatureInterface = {
  enabled: false,
  hasAppBarDropDown: false,
  appBarPollingInterval: 3000
};
let headerViewModel: HeaderViewModel;

let user: PersonInterface;
let unreadAlerts: Alert[];
let usedUserState: any;
let usedUnreadAlertsState: any;
let spy: jest.SpyInstance;
let dispatchSpy: jest.SpyInstance;
let store: Store<DalState>;
let dateMock: MockDate;

@Injectable({
  providedIn: 'root'
})
class MockHeaderResolver {
  resolve = spy;
}

describe('headerViewModel', () => {
  let matDialog: MatDialog;

  beforeAll(() => {
    dateMock = new MockDate();
  });

  afterAll(() => {
    dateMock.returnRealDate();
  });

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
          },
          {
            NAME: UiReducer.NAME,
            reducer: UiReducer.reducer,
            initialState: UiReducer.initialState
          }
        ])
      ],
      providers: [
        HeaderViewModel,
        AlertToNotificationItemPipe,
        {
          provide: AUTH_SERVICE_TOKEN,
          useValue: { userId: 1 }
        },
        {
          provide: ENVIRONMENT_ALERTS_FEATURE_TOKEN,
          useValue: environmentAlertsFeature
        },
        Store,
        {
          provide: MatDialog,
          useValue: {
            open: jest.fn()
          }
        }
      ]
    });
    headerViewModel = TestBed.get(HeaderViewModel);
    store = TestBed.get(Store);
    matDialog = TestBed.get(MatDialog);
    dispatchSpy = jest.spyOn(store, 'dispatch');
  });

  describe('creation', () => {
    beforeAll(() => {
      spy = jest.fn();
    });
    it('should be defined', () => {
      expect(headerViewModel).toBeDefined();
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
            hasAppBarDropDown: hasAppBarDropDown,
            appBarPollingInterval: 3000
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
  describe('streams', () => {
    beforeAll(() => {
      setInitialState();
    });

    describe('state streams', () => {
      it('should get the user from the provided state', () => {
        expect(headerViewModel.currentUser$).toBeObservable(
          hot('a', { a: user })
        );
      });

      it('should get unread alerts from the provided state', () => {
        expect(headerViewModel.unreadAlerts$).toBeObservable(
          hot('a', { a: unreadAlerts.map(asAlert) })
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
        expect(headerViewModel.alertNotifications$).toBeObservable(
          hot('a', { a: unreadAlerts.map(asAlert) })
        );
      });

      describe('should setup the back link stream', () => {
        const mockBreadcrumbs = [
          { displayText: 'foo', link: ['foo'] },
          { displayText: 'foo', link: ['foo bar'] }
        ];

        it('should return a link when one is available', () => {
          store.dispatch(
            new UiActions.SetBreadcrumbs({ breadcrumbs: mockBreadcrumbs })
          );

          const expected = mockBreadcrumbs[mockBreadcrumbs.length - 2].link;
          expect(headerViewModel.backLink$).toBeObservable(
            hot('a', { a: expected })
          );
        });

        it('should not return a link when none is available', () => {
          // no breadcrumbs -> not actually possible
          store.dispatch(new UiActions.SetBreadcrumbs({ breadcrumbs: [] }));
          const expected = undefined;
          expect(headerViewModel.backLink$).toBeObservable(
            hot('a', { a: expected })
          );

          // 1 breadcrumb
          store.dispatch(
            new UiActions.SetBreadcrumbs({ breadcrumbs: [mockBreadcrumbs[0]] })
          );
          expect(headerViewModel.backLink$).toBeObservable(
            hot('a', { a: expected })
          );
        });
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

  describe('open dialog', () => {
    it('should open the modal dialog with the correct mode', () => {
      // const spy = jest.spyOn(matDialog, 'open');
      headerViewModel.openDialog(QuickLinkTypeEnum.FAVORITES);
      expect(matDialog.open).toHaveBeenCalledWith(QuickLinkComponent, {
        data: { mode: QuickLinkTypeEnum.FAVORITES }
      });
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
}

// copy from alert selector
function asAlert(item: AlertQueueInterface): Alert {
  if (item) {
    return Object.assign<Alert, AlertQueueInterface>(new Alert(), item);
  }
}
