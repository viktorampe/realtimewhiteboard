import { TestBed } from '@angular/core/testing';
import { WINDOW } from '@campus/browser';
import { DalState, PersonFixture, StateFeatureBuilder, UserActions, UserReducer } from '@campus/dal';
import { EnvironmentLogoutInterface, ENVIRONMENT_LOGOUT_TOKEN } from '@campus/shared';
import { MockWindow } from '@campus/testing';
import { Store, StoreModule } from '@ngrx/store';
import { LogoutViewModel } from './logout.viewmodel';

let logoutViewModel: LogoutViewModel;
let store: Store<DalState>;
let window: Window;
let mockData: any;

beforeEach(() => {
  mockData = { logoutUrl: 'http://some.link' };
  TestBed.configureTestingModule({
    imports: [
              StoreModule.forRoot({},{
          runtimeChecks: {
            strictStateImmutability: false,
            strictActionImmutability: false
          }}),
      ...StateFeatureBuilder.getModuleWithForFeatureProviders([UserReducer])
    ],
    providers: [
      LogoutViewModel,
      Store,
      {
        provide: ENVIRONMENT_LOGOUT_TOKEN,
        useValue: <EnvironmentLogoutInterface>{ url: mockData.logoutUrl }
      },
      {
        provide: WINDOW,
        useClass: MockWindow
      }
    ]
  });
  logoutViewModel = TestBed.get(LogoutViewModel);
  window = TestBed.get(WINDOW);
  store = TestBed.get(Store);

  store.dispatch(new UserActions.UserLoaded(new PersonFixture()));
});

describe('logoutViewModel', () => {
  describe('creation', () => {
    it('should be defined', () => {
      expect(logoutViewModel).toBeDefined();
    });
  });

  describe('with currentUser in store', () => {
    describe('logout method', () => {
      let dispatchSpy: jest.SpyInstance;
      let assignSpy: jest.SpyInstance;
      beforeEach(() => {
        dispatchSpy = jest.spyOn(store, 'dispatch');
        assignSpy = jest.spyOn(window.location, 'assign');
      });
      afterEach(() => {
        jest.resetAllMocks();
      });
      it('should dispatch a remove User action', () => {
        logoutViewModel.logout();
        expect(dispatchSpy).toHaveBeenCalled();
        expect(dispatchSpy).toHaveBeenCalledWith(new UserActions.RemoveUser());
      });
      it('should wait for store update to navigate away', () => {
        logoutViewModel.logout();
        //effects are not triggered automagically here, and that's our luck
        expect(assignSpy).not.toHaveBeenCalled();
        store.dispatch(new UserActions.UserRemoved());
        expect(assignSpy).toHaveBeenCalled();
      });
    });
  });
});
