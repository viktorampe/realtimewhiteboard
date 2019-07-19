import { TestBed } from '@angular/core/testing';
import {
  AUTH_SERVICE_TOKEN,
  DalState,
  getStoreModuleForFeatures,
  UserReducer
} from '@campus/dal';
import { Store, StoreModule } from '@ngrx/store';
import { configureTestSuite } from 'ng-bullet';
import { MethodViewModel } from './method.viewmodel';

describe('MethodViewModel', () => {
  let methodViewModel: MethodViewModel;
  let store: Store<DalState>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        ...getStoreModuleForFeatures([UserReducer])
      ],
      providers: [
        Store,
        { provide: AUTH_SERVICE_TOKEN, useValue: { userId: 1 } }
      ]
    });

    methodViewModel = TestBed.get(MethodViewModel);
    store = TestBed.get(Store);
  });

  describe('creation', () => {
    it('should be defined', () => {
      expect(methodViewModel).toBeDefined();
    });
  });
});
