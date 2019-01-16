import { TestBed } from '@angular/core/testing';
import {
  DalState,
  getStoreModuleForFeatures,
  TeacherStudentActions,
  UserReducer
} from '@campus/dal';
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
    store = TestBed.get(Store);
  });

  describe('creation', () => {
    it('should be defined', () => {
      expect(coupledTeacherViewModel).toBeDefined();
    });
  });

  describe('actions', () => {
    beforeEach(() => {
      store.dispatch = jest.fn();
    });

    it('should dispath a LinkTeacherStudent action', () => {
      coupledTeacherViewModel.linkPerson('somePublicKey');

      expect(store.dispatch).toHaveBeenCalledWith(
        new TeacherStudentActions.LinkTeacherStudent({
          publicKey: 'somePublicKey'
        })
      );
    });

    it('should dispath an UnLinkTeacherStudent action', () => {
      coupledTeacherViewModel.unlinkPerson(1);

      expect(store.dispatch).toHaveBeenCalledWith(
        new TeacherStudentActions.UnlinkTeacherStudent({
          teacherId: 1
        })
      );
    });
  });
});
