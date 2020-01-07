import { TestBed } from '@angular/core/testing';
import {
  DalState,
  EffectFeedback,
  EffectFeedbackActions,
  EffectFeedbackInterface,
  getStoreModuleForFeatures,
  PersonFixture,
  UserActions,
  UserReducer
} from '@campus/dal';
import {
  EnvironmentLoginInterface,
  ENVIRONMENT_LOGIN_TOKEN
} from '@campus/shared';
import { routerReducer } from '@ngrx/router-store';
import { Store, StoreModule } from '@ngrx/store';
import { hot } from '@nrwl/angular/testing';
import { configureTestSuite } from 'ng-bullet';
import { BehaviorSubject } from 'rxjs';
import { LoginViewModel } from './login.viewmodel';

describe('LoginViewModel', () => {
  let loginViewModel: LoginViewModel;
  let store: Store<DalState>;
  let mockEnvironmentValues: EnvironmentLoginInterface;

  beforeAll(() => {
    mockEnvironmentValues = {
      url: 'not relevant',
      loginPresets: [
        {
          label: 'preset 1',
          username: 'weetikveel',
          password: 'ditweetikookniet'
        }
      ]
    };
  });

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(
          { router: routerReducer },
          {
            runtimeChecks: {
              strictStateImmutability: false,
              strictActionImmutability: false
            }
          }
        ),
        ...getStoreModuleForFeatures([UserReducer])
      ],
      providers: [
        LoginViewModel,
        { provide: ENVIRONMENT_LOGIN_TOKEN, useValue: mockEnvironmentValues }
      ]
    });
  });

  beforeEach(() => {
    loginViewModel = TestBed.get(LoginViewModel);
    store = TestBed.get(Store);
  });

  describe('creation', () => {
    it('should be defined', () => {
      expect(loginViewModel).toBeDefined();
    });
  });

  describe('user', () => {
    it('should log in', () => {
      store.dispatch = jest.fn();
      const username = 'admin';
      const password = 'god';
      loginViewModel.login(username, password);
      expect(store.dispatch).toHaveBeenCalledWith(
        new UserActions.LogInUser({
          username,
          password,
          customFeedbackHandlers: {
            useCustomErrorHandler: true,
            useCustomSuccessHandler: 'useNoHandler'
          }
        })
      );
    });

    it('should log in with email address', () => {
      store.dispatch = jest.fn();
      const username = 'admin@god.be';
      const password = 'god';
      loginViewModel.login(username, password);
      expect(store.dispatch).toHaveBeenCalledWith(
        new UserActions.LogInUser({
          email: username,
          password,
          customFeedbackHandlers: {
            useCustomErrorHandler: true,
            useCustomSuccessHandler: 'useNoHandler'
          }
        })
      );
    });

    it('should log out', () => {
      store.dispatch = jest.fn();

      loginViewModel.logout();
      expect(store.dispatch).toHaveBeenCalledWith(new UserActions.RemoveUser());
    });

    it('currentUser$', () => {
      store.dispatch(new UserActions.UserLoaded(new PersonFixture()));

      expect(loginViewModel.currentUser$).toBeObservable(
        hot('a', { a: new PersonFixture() })
      );
    });
  });

  describe('feedback', () => {
    it('should delete effectFeedback on clear error', () => {
      store.dispatch = jest.fn();
      const id = 'foo-id';
      const effectFeedback = new EffectFeedback({
        id,
        triggerAction: undefined,
        message: 'Foo',
        userActions: [],
        type: 'error'
      });

      loginViewModel.errorFeedback$ = new BehaviorSubject<
        EffectFeedbackInterface
      >(effectFeedback);

      loginViewModel.clearError();

      expect(store.dispatch).toHaveBeenCalledWith(
        new EffectFeedbackActions.DeleteEffectFeedback({ id })
      );
    });
  });

  describe('login presets', () => {
    it('should contain the environment values', () => {
      expect(loginViewModel.loginPresets).toEqual(
        mockEnvironmentValues.loginPresets
      );
    });
  });
});
