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
import { Store, StoreModule } from '@ngrx/store';
import { hot } from 'jasmine-marbles';
import {
  CredentialsViewModel,
  SingleSignOnProviderInterface
} from './credentials.viewmodel';

let credentialsViewModel: CredentialsViewModel;
let store: Store<DalState>;

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
      providers: [Store]
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
        { providerId: 1, name: 'google', description: 'Hoehel', url: '' },
        { providerId: 2, name: 'facebook', description: 'Smoelboek', url: '' },
        {
          providerId: 3,
          name: 'smartschool',
          description: 'SmaaaaaartSchool',
          url: '',
          maxNumberAllowed: 3
        }
      ];

      it('should return the SingleSignOn-providers', () => {
        store.dispatch(
          new CredentialActions.CredentialsLoaded({
            credentials: []
          })
        );

        expect(credentialsViewModel.singleSignOnProviders$).toBeObservable(
          hot('a', { a: mockProviders })
        );
      });

      it('shouldnt return SingleSignOn-providers (no maxNumberAllowed) that match a credential ', () => {
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

      it('shouldnt return SingleSignOn-providers that have exceeded maxNumberAllowed', () => {
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
          providerId: 1,
          name: 'google',
          description: 'Hoehel',
          url: 'link.toApi.be'
        } as SingleSignOnProviderInterface;

        window.open = jest.fn();
        credentialsViewModel.linkCredential(mockProvider);

        expect(window.open).toHaveBeenCalled();
        expect(window.open).toHaveBeenCalledTimes(1);
        expect(window.open).toHaveBeenCalledWith(mockProvider.url, '_blank');
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
  });
});
