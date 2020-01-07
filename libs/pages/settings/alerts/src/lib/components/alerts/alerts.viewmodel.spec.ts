import { TestBed } from '@angular/core/testing';
import {
  AlertActions,
  AlertFixture,
  AlertReducer,
  AUTH_SERVICE_TOKEN,
  DalState,
  StateFeatureBuilder
} from '@campus/dal';
import { Store, StoreModule } from '@ngrx/store';
import { hot } from 'jasmine-marbles';
import { AlertsViewModel } from './alerts.viewmodel';

let alertsViewModel: AlertsViewModel;
let store: Store<DalState>;

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
      ...StateFeatureBuilder.getModuleWithForFeatureProviders([AlertReducer])
    ],
    providers: [
      AlertsViewModel,
      Store,
      { provide: AUTH_SERVICE_TOKEN, useValue: { userId: 1 } }
    ]
  });

  alertsViewModel = TestBed.get(AlertsViewModel);
  store = TestBed.get(Store);
});

describe('alertViewmodel', () => {
  describe('creation', () => {
    it('should be defined', () => {
      expect(alertsViewModel).toBeDefined();
    });
    it('should set the streams', () => {
      expect(alertsViewModel.alerts$).toBeDefined();
    });
  });

  describe('presentation streams', () => {
    describe('alerts$', () => {
      const mockAlert = new AlertFixture({
        message: "Look at me! I'm an alert."
      });

      beforeEach(() => {
        store.dispatch(
          new AlertActions.AlertsLoaded({ alerts: [mockAlert], timeStamp: 1 })
        );
      });

      it('should return the alerts', () => {
        expect(alertsViewModel.alerts$).toBeObservable(
          hot('a', { a: [mockAlert] })
        );
      });
    });
  });

  describe('user interactions', () => {
    it('should set alert as read', () => {
      store.dispatch = jest.fn();

      alertsViewModel.setAlertAsRead(1);
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        new AlertActions.SetReadAlert({
          alertIds: 1,
          personId: 1,
          read: true,
          intended: true
        })
      );
    });

    it('should set alert as unread', () => {
      store.dispatch = jest.fn();

      alertsViewModel.setAlertAsUnread(1);
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        new AlertActions.SetReadAlert({
          alertIds: 1,
          personId: 1,
          read: false,
          intended: true
        })
      );
    });

    it('should delete an alert', () => {
      store.dispatch = jest.fn();

      alertsViewModel.removeAlert(1);
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        new AlertActions.DeleteAlert({
          id: 1,
          personId: 1
        })
      );
    });
  });
});
