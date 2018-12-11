//file.only
import { TestBed } from '@angular/core/testing';
import {
  AUTH_SERVICE_TOKEN,
  DalState,
  EduContentFixture,
  EduContentReducer,
  getStoreModuleForFeatures,
  LearningAreaReducer,
  ResultFixture
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

  describe('private methods', () => {
    it('getExerciseResults should return correct values', () => {
      const mockResults = [
        new ResultFixture({ id: 1, eduContentId: 1, score: 10 }),
        new ResultFixture({ id: 2, eduContentId: 1, score: 50 }),
        new ResultFixture({ id: 3, eduContentId: 20, score: 80 })
      ];

      const mockEduContents = [
        new EduContentFixture({ id: 1 }),
        new EduContentFixture({ id: 20 })
      ];

      const returnedValue = reportsViewModel['getExerciseResults'](
        mockResults,
        mockEduContents
      );

      const expectedValue = {
        totalScore: 65,
        exerciseResults: [
          {
            eduContent: mockEduContents[0],
            results: [mockResults[0], mockResults[1]],
            bestResult: mockResults[1],
            averageScore: 30
          },
          {
            eduContent: mockEduContents[1],
            results: [mockResults[2]],
            bestResult: mockResults[2],
            averageScore: 80
          }
        ]
      };
      expect(returnedValue).toEqual(expectedValue);
    });
  });
});
