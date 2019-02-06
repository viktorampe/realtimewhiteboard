import { TestBed } from '@angular/core/testing';
import { WindowServiceInterface, WINDOW_SERVICE_TOKEN } from '@campus/browser';
import {
  DalState,
  PersonFixture,
  StateFeatureBuilder,
  UserActions,
  UserReducer
} from '@campus/dal';
import {
  EnvironmentLogoutInterface,
  ENVIRONMENT_LOGOUT_TOKEN
} from '@campus/shared';
import { Store, StoreModule } from '@ngrx/store';
import { hot } from '@nrwl/nx/testing';
import { LogoutViewModel } from './logout.viewmodel';

let logoutViewModel: LogoutViewModel;
let store: Store<DalState>;
let windowService: WindowServiceInterface;
let mockData: any;

beforeEach(() => {
  mockData = { logoutUrl: 'http://some.link' };
  TestBed.configureTestingModule({
    imports: [
      StoreModule.forRoot({}),
      ...StateFeatureBuilder.getModuleWithForFeatureProviders([
        {
          NAME: UserReducer.NAME,
          reducer: UserReducer.reducer,
          initialState: UserReducer.reducer(
            UserReducer.initialState,
            new UserActions.UserLoaded(new PersonFixture())
          )
        }
      ])
    ],
    providers: [
      LogoutViewModel,
      Store,
      {
        provide: ENVIRONMENT_LOGOUT_TOKEN,
        useValue: <EnvironmentLogoutInterface>{ url: mockData.logoutUrl }
      },
      {
        provide: WINDOW_SERVICE_TOKEN,
        useValue: { window: { location: { assign: () => {} } } }
      }
    ]
  });

  logoutViewModel = TestBed.get(LogoutViewModel);
  windowService = TestBed.get(WINDOW_SERVICE_TOKEN);
  store = TestBed.get(Store);
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
      let pipeSpy: jest.SpyInstance;
      let assignSpy: jest.SpyInstance;
      beforeEach(() => {
        dispatchSpy = jest.spyOn(store, 'dispatch');
        pipeSpy = jest.spyOn(store, 'pipe');
        assignSpy = jest.spyOn(windowService.window.location, 'assign');
      });
      afterEach(() => {
        jest.resetAllMocks();
      });
      it('should dispatch a remove User action', () => {
        logoutViewModel.logout();
        expect(dispatchSpy).toHaveBeenCalled();
        expect(dispatchSpy).toHaveBeenCalledWith(new UserActions.RemoveUser());
      });
      it('should return null and then close', () => {
        expect(logoutViewModel['currentNullUser']).toBeFalsy();
        logoutViewModel.logout();
        expect(pipeSpy).toHaveBeenCalled();
        expect(logoutViewModel['currentNullUser']).toBeObservable(
          hot('(a|)', { a: null })
        );
      });
      it('should call window.location.assign', () => {
        logoutViewModel.logout();
        expect(assignSpy).toHaveBeenCalled();
        expect(assignSpy).toHaveBeenCalledWith(mockData.logoutUrl);
      });
    });
  });
});
