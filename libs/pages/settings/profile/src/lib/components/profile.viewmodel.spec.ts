import { TestBed } from '@angular/core/testing';
import {
  AUTH_SERVICE_TOKEN,
  DalState,
  getStoreModuleForFeatures,
  PersonFixture,
  PersonInterface,
  UserActions,
  UserReducer
} from '@campus/dal';
import { ENVIRONMENT_UI_TOKEN } from '@campus/shared';
import { Store, StoreModule } from '@ngrx/store';
import { hot } from '@nrwl/nx/testing';
import { ProfileViewModel } from './profile.viewmodel';

describe('ProfileViewModel', () => {
  let profileViewModel: ProfileViewModel;
  let store: Store<DalState>;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        ...getStoreModuleForFeatures([UserReducer])
      ],
      providers: [
        Store,
        { provide: AUTH_SERVICE_TOKEN, useValue: { userId: 1 } },
        { provide: ENVIRONMENT_UI_TOKEN, useValue: { useInfoPanelStyle: true } }
      ]
    });

    profileViewModel = TestBed.get(ProfileViewModel);
    store = TestBed.get(Store);
  });

  describe('creation', () => {
    it('should be defined', () => {
      expect(profileViewModel).toBeDefined();
    });
    it('should set the streams', () => {
      expect(profileViewModel.currentUser$).toBeDefined();
    });
  });

  describe('presentation streams', () => {
    describe('currentUser', () => {
      const mockUser = new PersonFixture();
      beforeEach(() => {
        store.dispatch(new UserActions.UserLoaded(mockUser));
      });

      it('should return the currentUser', () => {
        expect(profileViewModel.currentUser$).toBeObservable(
          hot('a', { a: mockUser })
        );
      });
    });
  });

  describe('update profile', () => {
    const mockUser = new PersonFixture({ id: 1 });
    beforeEach(() => {
      store.dispatch(new UserActions.UserLoaded(mockUser));
    });

    it('should dispatch a UpdateUser action', () => {
      const mockChangesToProfile: Partial<PersonInterface> = {
        firstName: 'a new value'
      };
      store.dispatch = jest.fn();

      profileViewModel.updateProfile(mockChangesToProfile);

      expect(store.dispatch).toHaveBeenCalledWith(
        new UserActions.UpdateUser({
          userId: mockUser.id,
          changedProps: mockChangesToProfile
        })
      );
    });
  });
});
