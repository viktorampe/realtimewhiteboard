import { TestBed } from '@angular/core/testing';
import {
  AUTH_SERVICE_TOKEN,
  DalState,
  EduContentReducer,
  getStoreModuleForFeatures,
  LearningAreaReducer
} from '@campus/dal';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Store, StoreModule } from '@ngrx/store';
import { ReportsViewModel } from './reports.viewmodel';

let reportsViewModel: ReportsViewModel;
let store: Store<DalState>;

describe('ReportsViewModel', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        ...getStoreModuleForFeatures([LearningAreaReducer, EduContentReducer])
      ],
      providers: [
        ReportsViewModel,
        { provide: AUTH_SERVICE_TOKEN, useValue: { userId: 1 } },
        { provide: PersonApi, useValue: {} },
        Store
      ]
    });
    reportsViewModel = TestBed.get(ReportsViewModel);
    store = TestBed.get(Store);
  });

  describe('creation', () => {
    it('should be defined', () => {
      expect(reportsViewModel).toBeDefined();
    });
  });
});
