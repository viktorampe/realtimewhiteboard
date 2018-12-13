import { TestBed } from '@angular/core/testing';
import { AUTH_SERVICE_TOKEN, DalState, EduContentReducer, getStoreModuleForFeatures, LearningAreaActions, LearningAreaFixture, LearningAreaReducer, ResultReducer } from '@campus/dal';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Store, StoreModule } from '@ngrx/store';
import { hot } from 'jasmine-marbles';
import { ReportsViewModel } from './reports.viewmodel';

let reportsViewModel: ReportsViewModel;
let store: Store<DalState>;

describe('ReportsViewModel', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        ...getStoreModuleForFeatures([
          LearningAreaReducer,
          EduContentReducer,
          ResultReducer
        ])
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

  describe('presentation streams', () => {
    describe('getLearningAreaById', () => {
      const mockLearningAreas = [
        new LearningAreaFixture({ id: 1 }),
        new LearningAreaFixture({ id: 2 })
      ];
      beforeEach(() => {
        store.dispatch(
          new LearningAreaActions.LearningAreasLoaded({
            learningAreas: mockLearningAreas
          })
        );
      });

      it('should return the requested LearningArea', () => {
        const returnedValue = reportsViewModel.getLearningAreaById(2);

        expect(returnedValue).toBeObservable(
          hot('a', { a: mockLearningAreas[1] })
        );
      });
    });


