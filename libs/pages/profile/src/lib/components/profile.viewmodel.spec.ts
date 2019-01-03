import { TestBed } from '@angular/core/testing';
import { ProfileViewModel } from './profile.viewmodel';
import { MockProfileViewModel } from './profile.viewmodel.mock';

let profileViewModel: ProfileViewModel;

describe('ProfileViewModel', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      // imports: [
      //   StoreModule.forRoot({}),
      //   ...getStoreModuleForFeatures([
      //     PersonReducer //ProfileReducer?
      //   ])
      // ],
      providers: [{ provide: ProfileViewModel, useclass: MockProfileViewModel }]
    });
    profileViewModel = TestBed.get(ProfileViewModel);
  });

  test('it should return', () => {
    return;
  });
});
