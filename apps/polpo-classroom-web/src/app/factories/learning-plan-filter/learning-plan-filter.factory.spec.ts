import { TestBed } from '@angular/core/testing';
import {
  EduNetActions,
  EduNetReducer,
  getStoreModuleForFeatures,
  LearningAreaActions,
  LearningAreaFixture,
  LearningAreaReducer,
  LearningPlanAssignmentInterface,
  LEARNING_PLAN_SERVICE_TOKEN,
  SchoolTypeActions,
  SchoolTypeReducer,
  SpecialtyInterface,
  YearInterface
} from '@campus/dal';
import { Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import { LearningPlanFilterFactory } from './learning-plan-filter.factory';

const mockLearningAreas = [
  new LearningAreaFixture({ id: 1 }),
  new LearningAreaFixture({ id: 2 })
];
const mockEduNets = []; //TODO -- expand
const mockSchoolTypes = []; //TODO -- expand

describe('LearningPlanFilterFactory', () => {
  let store;
  let learningPlanService;
  let mockLearningPlans: Map<
    SpecialtyInterface,
    LearningPlanAssignmentInterface[]
  >;
  let mockAvailableYears: YearInterface[];
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        ...getStoreModuleForFeatures([
          LearningAreaReducer,
          EduNetReducer,
          SchoolTypeReducer
        ])
      ],
      providers: [
        Store,
        {
          provide: LEARNING_PLAN_SERVICE_TOKEN,
          useValue: {
            getLearningPlanAssignments: () => of(mockLearningPlans),
            getAvailableYearsForSearch: () => of(mockAvailableYears)
          }
        }
      ]
    });

    store = TestBed.get(Store);
    learningPlanService = TestBed.get(LEARNING_PLAN_SERVICE_TOKEN);
  });

  it('should be created', () => {
    const factory: LearningPlanFilterFactory = TestBed.get(
      LearningPlanFilterFactory
    );
    expect(factory).toBeTruthy();
  });

  describe('getFilters', () => {
    let learningPlanFilterFactory;
    beforeEach(() => {
      store.dispatch(
        new LearningAreaActions.LearningAreasLoaded({
          learningAreas: mockLearningAreas
        })
      );
      store.dispatch(
        new EduNetActions.EduNetsLoaded({
          eduNets: mockEduNets
        })
      );
      store.dispatch(
        new SchoolTypeActions.SchoolTypesLoaded({
          schoolTypes: mockSchoolTypes
        })
      );

      learningPlanFilterFactory = TestBed.get(LearningPlanFilterFactory);
    });
  });
});
