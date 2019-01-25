import { TestBed } from '@angular/core/testing';
import {
  CredentialActions,
  CredentialFixture,
  CredentialReducer,
  DalState,
  getStoreModuleForFeatures,
  PersonFixture,
  UserActions,
  UserReducer
} from '@campus/dal';
import { EnvironmentSsoInterface, ENVIRONMENT_SSO_TOKEN } from '@campus/shared';
import { Store, StoreModule } from '@ngrx/store';
import { hot } from 'jasmine-marbles';
import { merge } from 'rxjs';
import {
  CredentialErrors,
  CredentialsViewModel,
  SingleSignOnProviderInterface
} from './credentials.viewmodel';

let credentialsViewModel: CredentialsViewModel;
let store: Store<DalState>;

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
        StoreModule.forRoot({}),
        ...getStoreModuleForFeatures([UserReducer, CredentialReducer])
      ],
      providers: [
        Store,
        {
          provide: ENVIRONMENT_SSO_TOKEN,
          useValue: environmentSsoSettings
        }
      ]
    });

    credentialsViewModel = TestBed.get(CredentialsViewModel);
    store = TestBed.get(Store);
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

      it('should return the enabled SingleSignOn-providers', () => {
        store.dispatch(
          new CredentialActions.CredentialsLoaded({
            credentials: []
          })
        );

        expect(credentialsViewModel.singleSignOnProviders$).toBeObservable(
          hot('a', { a: mockProviders })
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

        const expectedProviders = mockProviders.filter(
          provider => provider.name !== 'google'
        );

        expect(credentialsViewModel.singleSignOnProviders$).toBeObservable(
          hot('a', {
            a: expectedProviders
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

        const expectedProviders = mockProviders.filter(
          provider => provider.name !== 'smartschool'
        );

        expect(credentialsViewModel.singleSignOnProviders$).toBeObservable(
          hot('a', {
            a: expectedProviders
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

    it('should return the correct error message for teacher', () => {
      const mockUser = new PersonFixture();
      store.dispatch(new UserActions.UserLoaded(mockUser));

      let message$ = merge(
        credentialsViewModel.getErrorMessageFromCode(
          CredentialErrors.AlreadyLinked
        ),
        credentialsViewModel.getErrorMessageFromCode(
          CredentialErrors.ForbiddenInvalidRoles
        ),
        credentialsViewModel.getErrorMessageFromCode(
          CredentialErrors.ForbiddenMixedRoles
        )
      );
      expect(message$).toBeObservable(
        hot('(abc)', {
          a: 'Dit account werd al aan een ander profiel gekoppeld.',
          b:
            'Je kan enkel een Smartschool-LEERKRACHT profiel koppelen aan dit POLPO-profiel.',
          c:
            'Je kan enkel een Smartschool-LEERKRACHT profiel koppelen aan dit POLPO-profiel.'
        })
      );
    });

    it('should return the correct error message for student', () => {
      const mockUser = new PersonFixture({ type: 'student' });
      store.dispatch(new UserActions.UserLoaded(mockUser));

      let message$ = merge(
        credentialsViewModel.getErrorMessageFromCode(
          CredentialErrors.AlreadyLinked
        ),
        credentialsViewModel.getErrorMessageFromCode(
          CredentialErrors.ForbiddenInvalidRoles
        ),
        credentialsViewModel.getErrorMessageFromCode(
          CredentialErrors.ForbiddenMixedRoles
        )
      );
      expect(message$).toBeObservable(
        hot('(abc)', {
          a: 'Dit account werd al aan een ander profiel gekoppeld.',
          b:
            'Je kan enkel een Smartschool-LEERLING profiel koppelen aan dit POLPO-profiel.',
          c:
            'Je kan enkel een Smartschool-LEERLING profiel koppelen aan dit POLPO-profiel.'
        })
      );
    });
  });
});
