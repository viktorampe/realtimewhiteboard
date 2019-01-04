import { TestBed } from '@angular/core/testing';
import {
  DalState,
  getStoreModuleForFeatures,
  PersonFixture,
  PersonInterface,
  UserActions,
  UserReducer
} from '@campus/dal';
import { Store, StoreModule } from '@ngrx/store';
import { hot } from 'jasmine-marbles';
import { ProfileViewModel } from './profile.viewmodel';

let profileViewModel: ProfileViewModel;
let store: Store<DalState>;

describe('ProfileViewModel', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        ...getStoreModuleForFeatures([UserReducer])
      ],
      providers: [Store]
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
    const mockUser = new PersonFixture();
    beforeEach(() => {
      store.dispatch(new UserActions.UserLoaded(mockUser));
    });

    it('should dispatch a UpdateUser action', () => {
      const mockChangesToProfile: Partial<PersonInterface> = {
        firstName: 'a new value'
      };
      store.dispatch = jest.fn();

      profileViewModel.updateProfile(mockUser.id, mockChangesToProfile);

      expect(store.dispatch).toHaveBeenCalledWith(
        new UserActions.UpdateUser({
          userid: mockUser.id,
          mockChangesToProfile
        })
      );
    });
  });
});
