import { TestBed } from '@angular/core/testing';
import {
  CredentialActions,
  CredentialFixture,
  CredentialReducer,
  DalState,
  EffectFeedback,
  EffectFeedbackActions,
  getStoreModuleForFeatures,
  PersonFixture,
  Priority,
  UserActions,
  UserReducer
} from '@campus/dal';
import { EnvironmentSsoInterface, ENVIRONMENT_SSO_TOKEN } from '@campus/shared';
import { MockDate } from '@campus/testing';
import { Action, Store, StoreModule } from '@ngrx/store';
import { hot } from 'jasmine-marbles';
import {
  CredentialErrors,
  CredentialsViewModel,
  SingleSignOnProviderInterface
} from './credentials.viewmodel';

let credentialsViewModel: CredentialsViewModel;
let store: Store<DalState>;
let uuid: Function;

const environmentSsoSettings: EnvironmentSsoInterface = {
  google: { description: 'Hoehel', linkUrl: '', enabled: true },
  facebook: { description: 'Smoelboek', linkUrl: '', enabled: true },
  smartschool: {
    description: 'SmaaaaaartSchool',
    linkUrl: '',
    maxNumberAllowed: 3,
    enabled: true
  },
  myspace: {
    description: 'The90sWantTheirSocialMediaBack',
    linkUrl: '',
    enabled: false
  }
};

describe('CredentialsViewModel', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(
          {},
          {
            runtimeChecks: {
              strictStateImmutability: true,
              strictActionImmutability: true
            }
          }
        ),
        ...getStoreModuleForFeatures([UserReducer, CredentialReducer])
      ],
      providers: [
        Store,
        {
          provide: ENVIRONMENT_SSO_TOKEN,
          useValue: environmentSsoSettings
        },
        {
          provide: 'uuid',
          useValue: () => 'foo'
        }
      ]
    });

    credentialsViewModel = TestBed.get(CredentialsViewModel);
    store = TestBed.get(Store);
    uuid = TestBed.get('uuid');
  });

  describe('creation', () => {
    it('should be defined', () => {
      expect(credentialsViewModel).toBeDefined();
    });
    it('should set the streams', () => {
      expect(credentialsViewModel.currentUser$).toBeDefined();
      expect(credentialsViewModel.credentials$).toBeDefined();
      expect(credentialsViewModel.singleSignOnProviders$).toBeDefined();
    });
  });

  describe('presentation streams', () => {
    describe('currentUser$', () => {
      const mockUser = new PersonFixture();
      beforeEach(() => {
        store.dispatch(new UserActions.UserLoaded(mockUser));
      });

      it('should return the currentUser', () => {
        expect(credentialsViewModel.currentUser$).toBeObservable(
          hot('a', { a: mockUser })
        );
      });
    });

    describe('credentials$', () => {
      const mockCredentials = [
        new CredentialFixture({
          id: 8,
          profile: { platform: 'foo.smartschool.be' },
          provider: 'smartschool'
        }),
        new CredentialFixture({
          id: 9,
          profile: { platform: 'foo.smartschool.be' },
          provider: 'smartschool'
        })
      ];

      beforeEach(() => {
        store.dispatch(
          new CredentialActions.CredentialsLoaded({
            credentials: mockCredentials
          })
        );
      });

      it('should return the credentials', () => {
        expect(credentialsViewModel.credentials$).toBeObservable(
          hot('a', { a: mockCredentials })
        );
      });
    });

    describe('singleSignOnProviders$', () => {
      const mockCredentials = [
        new CredentialFixture({
          id: 8,
          profile: { platform: 'foo.smartschool.be' },
          provider: 'smartschool'
        }),
        new CredentialFixture({
          id: 9,
          profile: { platform: 'foo.google.com' },
          provider: 'google'
        })
      ];

      const mockProviders = [
        {
          name: 'google',
          description: 'Hoehel',
          linkUrl: '',
          enabled: true,
          maxNumberAllowed: 1
        },
        {
          name: 'facebook',
          description: 'Smoelboek',
          linkUrl: '',
          enabled: true,
          maxNumberAllowed: 1
        },
        {
          name: 'smartschool',
          description: 'SmaaaaaartSchool',
          linkUrl: '',
          maxNumberAllowed: 3,
          enabled: true
        }
        // no myspace-provider, because it isn't enabled
      ];

      const expectedProviders = mockProviders.map(pr => {
        return { ...pr, className: pr.name + '-btn' };
      });

      it('should return the enabled SingleSignOn-providers', () => {
        store.dispatch(
          new CredentialActions.CredentialsLoaded({
            credentials: []
          })
        );

        expect(credentialsViewModel.singleSignOnProviders$).toBeObservable(
          hot('a', { a: expectedProviders })
        );
      });

      it("shouldn't return SingleSignOn-providers (no maxNumberAllowed) that already have a linked credential", () => {
        store.dispatch(
          new CredentialActions.CredentialsLoaded({
            credentials: mockCredentials.filter(
              credential => credential.provider === 'google'
            )
          })
        );

        expect(credentialsViewModel.singleSignOnProviders$).toBeObservable(
          hot('a', {
            a: expectedProviders.filter(provider => provider.name !== 'google')
          })
        );
      });

      it("shouldn't return SingleSignOn-providers that have exceeded maxNumberAllowed", () => {
        const smartschoolCredential = mockCredentials[0];

        store.dispatch(
          new CredentialActions.CredentialsLoaded({
            credentials: [
              smartschoolCredential,
              { ...smartschoolCredential, id: 10 },
              { ...smartschoolCredential, id: 11 }
            ]
          })
        );

        expect(credentialsViewModel.singleSignOnProviders$).toBeObservable(
          hot('a', {
            a: expectedProviders.filter(
              provider => provider.name !== 'smartschool'
            )
          })
        );
      });
    });
  });

  describe('public methods', () => {
    describe('linkCredential', () => {
      it('should open a new windows with the provider url', () => {
        const mockProvider = {
          name: 'google',
          description: 'Hoehel',
          linkUrl: 'link.toApi.be'
        } as SingleSignOnProviderInterface;

        window.open = jest.fn();
        credentialsViewModel.linkCredential(mockProvider);

        expect(window.open).toHaveBeenCalled();
        expect(window.open).toHaveBeenCalledTimes(1);
        expect(window.open).toHaveBeenCalledWith(mockProvider.linkUrl, '_self');
      });
    });

    describe('unlinkCredential', () => {
      it('should dispatch an action', () => {
        const mockCredential = new CredentialFixture();

        store.dispatch = jest.fn();
        credentialsViewModel.unlinkCredential(mockCredential);

        expect(store.dispatch).toHaveBeenCalled();
        expect(store.dispatch).toHaveBeenCalledWith(
          new CredentialActions.UnlinkCredential({ credential: mockCredential })
        );
      });
    });

    describe('useProfilePicture', () => {
      it('should dispatch an action', () => {
        const mockCredential = new CredentialFixture();

        store.dispatch = jest.fn();
        credentialsViewModel.useProfilePicture(mockCredential);

        expect(store.dispatch).toHaveBeenCalled();
        expect(store.dispatch).toHaveBeenCalledWith(
          new CredentialActions.UseCredentialProfilePicture({
            credential: mockCredential
          })
        );
      });
    });

    describe('handleLinkError', () => {
      let mockDate: MockDate;
      let effectFeedback: EffectFeedback;
      let addEffectFeedbackAction: Action;

      beforeEach(() => {
        mockDate = new MockDate();
        effectFeedback = new EffectFeedback({
          id: uuid(),
          timeStamp: mockDate.mockDate.getTime(),
          triggerAction: null,
          message: '',
          type: 'error',
          priority: Priority.HIGH
        });

        addEffectFeedbackAction = new EffectFeedbackActions.AddEffectFeedback({
          effectFeedback
        });
      });

      it('should add feedback to the store', () => {
        checkFeedback(
          'teacher',
          'Dit account werd al aan een ander profiel gekoppeld.',
          CredentialErrors.AlreadyLinked
        );

        checkFeedback(
          'teacher',
          'Je kan enkel een Smartschool-LEERKRACHT profiel koppelen aan dit POLPO-profiel.',
          CredentialErrors.ForbiddenInvalidRoles
        );
        checkFeedback(
          'teacher',
          'Je kan enkel een Smartschool-LEERKRACHT profiel koppelen aan dit POLPO-profiel.',
          CredentialErrors.ForbiddenMixedRoles
        );
        checkFeedback(
          'student',
          'Dit account werd al aan een ander profiel gekoppeld.',
          CredentialErrors.AlreadyLinked
        );
        checkFeedback(
          'student',
          'Je kan enkel een Smartschool-LEERLING profiel koppelen aan dit POLPO-profiel.',
          CredentialErrors.ForbiddenMixedRoles
        );
        checkFeedback(
          'student',
          'Je kan enkel een Smartschool-LEERLING profiel koppelen aan dit POLPO-profiel.',
          CredentialErrors.ForbiddenInvalidRoles
        );
      });

      function checkFeedback(
        userType: 'student' | 'teacher',
        feedbackMessage: string,
        queryParamError: CredentialErrors
      ) {
        const mockUser = new PersonFixture({ type: userType });
        store.dispatch(new UserActions.UserLoaded(mockUser));

        const dispatchSpy = jest.spyOn(store, 'dispatch');

        effectFeedback.message = feedbackMessage;

        credentialsViewModel.handleLinkError(queryParamError);

        expect(dispatchSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledWith(addEffectFeedbackAction);

        dispatchSpy.mockReset();
        dispatchSpy.mockRestore();
      }
    });
  });
});
