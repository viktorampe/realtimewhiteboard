import { TestBed } from '@angular/core/testing';
import { DalState, getStoreModuleForFeatures, UserReducer } from '@campus/dal';
import { Store, StoreModule } from '@ngrx/store';
import { CoupledTeachersViewModel } from './coupled-teachers.viewmodel';
// file.only

let coupledTeacherViewModel: CoupledTeachersViewModel;
let store: Store<DalState>;

describe('CoupledTeacherViewModel', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        ...getStoreModuleForFeatures([UserReducer])
      ],
      providers: [Store]
    });

    coupledTeacherViewModel = TestBed.get(CoupledTeachersViewModel);
    store = TestBed.get(store);
  });

  describe('creation', () => {
    it('should be defined', () => {
      expect(coupledTeacherViewModel).toBeDefined();
    });
  });
});
