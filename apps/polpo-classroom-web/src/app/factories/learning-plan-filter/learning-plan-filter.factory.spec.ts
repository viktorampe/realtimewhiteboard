import { TestBed } from '@angular/core/testing';
import {
  EduNetActions,
  EduNetFixture,
  EduNetReducer,
  getStoreModuleForFeatures,
  LearningAreaActions,
  LearningAreaFixture,
  LearningAreaReducer,
  LearningPlanAssignmentInterface,
  LEARNING_PLAN_SERVICE_TOKEN,
  SchoolTypeActions,
  SchoolTypeFixture,
  SchoolTypeReducer,
  SpecialtyInterface,
  YearInterface
} from '@campus/dal';
import {
  ColumnFilterComponent,
  SearchFilterCriteriaInterface,
  SearchStateInterface
} from '@campus/search';
import { Store, StoreModule } from '@ngrx/store';
import { hot } from '@nrwl/nx/testing';
import { of } from 'rxjs';
import { LearningPlanFilterFactory } from './learning-plan-filter.factory';

const mockLearningAreas = [
  new LearningAreaFixture({ id: 1, name: 'Wiskunde' }),
  new LearningAreaFixture({ id: 2, name: 'Aardrijkskunde' })
];
const mockEduNets = [
  new EduNetFixture({ id: 1 }),
  new EduNetFixture({ id: 2 })
];
const mockSchoolTypes = [
  new SchoolTypeFixture({ id: 2 }),
  new SchoolTypeFixture({ id: 3 })
];

const mockAvailableYears: YearInterface[] = [
  new YearFixture({ id: 4 }),
  new YearFixture({ id: 6 })
];

const mockLearningPlans: Map<
  SpecialtyInterface,
  LearningPlanInterface[]
> = new Map([
  [
    { name: 'one', id: 1 },
    [new LearningPlanFixture({ id: 1 }), new LearningPlanFixture({ id: 2 })]
  ],
  [
    { name: 'two', id: 2 },
    [new LearningPlanFixture({ id: 1 }), new LearningPlanFixture({ id: 2 })]
  ]
]);

describe('LearningPlanFilterFactory', () => {
  let store;
  let learningPlanService;
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
    it('should throw an error if a value higher thatn 4 is given to getSearchFilterStringProperties', () => {
      expect(() => {
        learningPlanFilterFactory['getSearchFilterStringProperties'](5);
      }).toThrowError(
        `LearningPlanFilterFactory: getStartingFilterStringProperties: Given currentColumnLevel: ${5} should not exist`
      );
    });
    it('should return the correct searchFitlerInterface array', () => {
      const loopValues: {
        filterCriteriaSelection: Map<string, (number | string)[]>;
        searchFilterCriteria: SearchFilterCriteriaInterface;
        getLearningPlanAssignmentsCalled: boolean;
        getAvailableYearsForSearchCalled: boolean;
      }[] = [
        {
          filterCriteriaSelection: new Map<string, (number | string)[]>([]),
          searchFilterCriteria: {
            ...learningPlanFilterFactory['getSearchFilterStringProperties'](0),
            values: mockLearningAreas.map(mockLearningArea => {
              return {
                data: mockLearningArea,
                hasChild: true
              };
            })
          },
          getLearningPlanAssignmentsCalled: false,
          getAvailableYearsForSearchCalled: false
        }
      ];
      loopValues.forEach(loopValue => {
        const searchState: SearchStateInterface = {
          filterCriteriaSelections: loopValue.filterCriteriaSelection,
          searchTerm: ''
        };
        const getLearningPlanAssignmentsSpy = jest.spyOn(
          learningPlanService,
          'getLearningPlanAssignments'
        );
        const getAvailableYearsForSearchSpy = jest.spyOn(
          learningPlanService,
          'getAvailableYearsForSearch'
        );
        expect(
          learningPlanFilterFactory.getFilters(searchState)
        ).toBeObservable(
          hot('a', {
            a: [
              {
                criteria: loopValue.searchFilterCriteria,
                component: ColumnFilterComponent,
                domHost: 'hostLeft'
              }
            ]
          })
        );
        expect(getLearningPlanAssignmentsSpy).toHaveBeenCalledTimes(
          loopValue.getLearningPlanAssignmentsCalled ? 1 : 0
        );
        expect(getAvailableYearsForSearchSpy).toHaveBeenCalledTimes(
          loopValue.getAvailableYearsForSearchCalled ? 1 : 0
        );
      });
    });
  });
});
