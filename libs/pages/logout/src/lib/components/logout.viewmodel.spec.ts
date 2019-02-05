import { TestBed } from '@angular/core/testing';
import {
  DalState,
  StateFeatureBuilder,
  UserActions,
  UserReducer
} from '@campus/dal';
import {
  EnvironmentLogoutInterface,
  ENVIRONMENT_LOGOUT_TOKEN
} from '@campus/shared';
import { Store, StoreModule } from '@ngrx/store';
import { Observable } from 'rxjs';
import { LogoutViewModel } from './logout.viewmodel';

let logoutViewModel: LogoutViewModel;
let store: Store<DalState>;
let mockData: any;

beforeEach(() => {
  mockData = { logoutUrl: 'http://some.link' };
  TestBed.configureTestingModule({
    imports: [
      StoreModule.forRoot({}),
      ...StateFeatureBuilder.getModuleWithForFeatureProviders([UserReducer])
    ],
    providers: [
      LogoutViewModel,
      Store,
      {
        provide: ENVIRONMENT_LOGOUT_TOKEN,
        useValue: <EnvironmentLogoutInterface>{ url: mockData.logoutUrl }
      }
    ]
  });

  logoutViewModel = TestBed.get(LogoutViewModel);
  store = TestBed.get(Store);
});

describe('logoutViewModel', () => {
  describe('creation', () => {
    it('should be defined', () => {
      expect(logoutViewModel).toBeDefined();
    });
  });

  describe('with currentUser is null', () => {
    describe('logout method', () => {
      let dispatchSpy: jest.SpyInstance;
      let pipeSpy: jest.SpyInstance;
      let subScribeSpy: jest.SpyInstance;
      beforeEach(() => {
        dispatchSpy = jest.spyOn(store, 'dispatch');
        pipeSpy = jest.spyOn(store, 'pipe');
        subScribeSpy = jest.spyOn(Observable.prototype, 'subscribe');
      });
      afterEach(() => {
        jest.resetAllMocks();
      });
      it('should dispatch a remove User action', () => {
        logoutViewModel.logout();
        expect(dispatchSpy).toHaveBeenCalled();
        expect(dispatchSpy).toHaveBeenCalledWith(new UserActions.RemoveUser());
      });
      it('should open pipe in store', () => {
        logoutViewModel.logout();
        expect(pipeSpy).toHaveBeenCalled();
      });
      it('should subscribe to the pipe', () => {
        logoutViewModel.logout();
        expect(subScribeSpy).toHaveBeenCalled();
      });
    });
  });
});
