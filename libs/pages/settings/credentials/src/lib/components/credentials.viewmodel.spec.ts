import { TestBed } from '@angular/core/testing';
import {
  DalState,
  getStoreModuleForFeatures,
  PersonFixture,
  UserActions,
  UserReducer
} from '@campus/dal';
import { Store, StoreModule } from '@ngrx/store';
import { hot } from 'jasmine-marbles';
import { CredentialsViewModel } from './credentials.viewmodel';

let credentialsViewModel: CredentialsViewModel;
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

    credentialsViewModel = TestBed.get(CredentialsViewModel);
    store = TestBed.get(Store);
  });

  describe('creation', () => {
    it('should be defined', () => {
      expect(credentialsViewModel).toBeDefined();
    });
    it('should set the streams', () => {
      expect(credentialsViewModel.currentUser$).toBeDefined();
    });
  });

  describe('presentation streams', () => {
    describe('currentUser', () => {
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
  });
});
