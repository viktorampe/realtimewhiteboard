import { TestBed } from '@angular/core/testing';
import {
  EduNetActions,
  EduNetFixture,
  EduNetReducer,
  getStoreModuleForFeatures,
  LearningAreaActions,
  LearningAreaFixture,
  LearningAreaReducer,
  LEARNING_PLAN_SERVICE_TOKEN,
  SchoolTypeActions,
  SchoolTypeFixture,
  SchoolTypeReducer,
  SpecialtyFixture,
  SpecialtyInterface,
  YearFixture,
  YearInterface
} from '@campus/dal';
import {
  BreadcrumbFilterComponent,
  ColumnFilterComponent,
  SearchFilterCriteriaInterface,
  SearchStateInterface
} from '@campus/search';
import { Store, StoreModule } from '@ngrx/store';
import { hot } from '@nrwl/nx/testing';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import {
  EDU_NETS_FILTER_PROPS,
  LEARNING_AREA_FILTER_PROPS,
  SCHOOL_TYPES_FILTER_PROPS,
  SPECIALITIES_FILTER_PROPS,
  YEARS_FILTER_PROPS
} from './learning-plan-filter-props';
import { LearningPlanFilterFactory } from './learning-plan-filter.factory';

const expectedOutputFilters = [
  {
    component: ColumnFilterComponent,
    domHost: 'hostLeft'
  },
  {
    component: BreadcrumbFilterComponent,
    domHost: 'hostBreadCrumbs'
  }
];

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

const mockSpecialities: SpecialtyInterface[] = [
  new SpecialtyFixture({ id: 1, name: 'speciality 1' }),
  new SpecialtyFixture({ id: 2, name: 'speciality 2' })
];

describe('LearningPlanFilterFactory', () => {
  let store;
  let learningPlanFilterFactory: LearningPlanFilterFactory;

  let learningPlanService;
  configureTestSuite(() => {
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
        LearningPlanFilterFactory,
        {
          provide: LEARNING_PLAN_SERVICE_TOKEN,
          useValue: {
            getSpecialities: () => of(mockSpecialities),
            getAvailableYearsForSearch: () => of(mockAvailableYears)
          }
        }
      ]
    });

    store = TestBed.get(Store);

    learningPlanFilterFactory = TestBed.get(LearningPlanFilterFactory);
    learningPlanService = TestBed.get(LEARNING_PLAN_SERVICE_TOKEN);
  });

  beforeEach(() => {
    loadInStore();
  });

  it('should be created', () => {
    expect(learningPlanFilterFactory).toBeTruthy();
  });

  describe('getFilters', () => {
    let searchFilterCriterias;
    beforeEach(() => {
      searchFilterCriterias = [
        {
          ...LEARNING_AREA_FILTER_PROPS,
          values: mockLearningAreas.map(mockLearningArea => {
            return {
              data: mockLearningArea,
              hasChild: true
            };
          })
        },
        {
          ...EDU_NETS_FILTER_PROPS,
          values: mockEduNets.map(mockEduNet => {
            return {
              data: mockEduNet,
              hasChild: true
            };
          })
        },
        {
          ...SCHOOL_TYPES_FILTER_PROPS,
          values: mockSchoolTypes.map(mockSchoolType => {
            return {
              data: mockSchoolType,
              hasChild: true
            };
          })
        },
        {
          ...YEARS_FILTER_PROPS,
          values: mockAvailableYears.map(mockAvailableYear => {
            return {
              data: mockAvailableYear,
              hasChild: true
            };
          })
        },
        {
          ...SPECIALITIES_FILTER_PROPS,
          values: mockSpecialities.map(mockSpeciality => {
            return {
              data: mockSpeciality,
              hasChild: false
            };
          })
        }
      ];
    });

    it('should return the correct searchFilterInterface array', () => {
      const loopValues: {
        filterCriteriaSelection: Map<string, (number | string)[]>;
        expectedSearchFilterCriterias: SearchFilterCriteriaInterface[];
        getSpecialitiesCalled: boolean;
        getAvailableYearsForSearchCalled: boolean;
      }[] = [
        {
          filterCriteriaSelection: new Map<string, (number | string)[]>([
            ['learningArea', []] // test if empty array is handled as nothing is selected
          ]),
          expectedSearchFilterCriterias: [],
          getAvailableYearsForSearchCalled: false,
          getSpecialitiesCalled: false
        },
        {
          filterCriteriaSelection: new Map<string, (number | string)[]>([
            ['learningArea', []],
            ['eduNets', ['2']] // test to make sure no column level can be skipped
          ]),
          expectedSearchFilterCriterias: [],
          getAvailableYearsForSearchCalled: false,
          getSpecialitiesCalled: false
        },
        {
          filterCriteriaSelection: new Map<string, (number | string)[]>([]),
          expectedSearchFilterCriterias: [],
          getAvailableYearsForSearchCalled: false,
          getSpecialitiesCalled: false
        },
        {
          filterCriteriaSelection: new Map<string, (number | string)[]>([
            ['learningArea', [1]]
          ]),
          expectedSearchFilterCriterias: [searchFilterCriterias[1]],
          getAvailableYearsForSearchCalled: false,
          getSpecialitiesCalled: false
        },
        {
          filterCriteriaSelection: new Map<string, (number | string)[]>([
            ['learningArea', [1]],
            ['eduNets', ['2']] //testing string to number convertion
          ]),
          expectedSearchFilterCriterias: [
            searchFilterCriterias[1],
            searchFilterCriterias[2]
          ],
          getAvailableYearsForSearchCalled: false,
          getSpecialitiesCalled: false
        },
        {
          filterCriteriaSelection: new Map<string, (number | string)[]>([
            ['learningArea', [1]],
            ['eduNets', [2]],
            ['schoolTypes', [4]]
          ]),
          expectedSearchFilterCriterias: [
            searchFilterCriterias[1],
            searchFilterCriterias[2],
            searchFilterCriterias[3]
          ],
          getAvailableYearsForSearchCalled: true,
          getSpecialitiesCalled: false
        },
        {
          filterCriteriaSelection: new Map<string, (number | string)[]>([
            ['learningArea', [1]],
            ['eduNets', [2]],
            ['schoolTypes', [4]],
            ['years', [4]]
          ]),
          expectedSearchFilterCriterias: [
            searchFilterCriterias[1],
            searchFilterCriterias[2],
            searchFilterCriterias[3],
            searchFilterCriterias[4]
          ],
          getAvailableYearsForSearchCalled: true,
          getSpecialitiesCalled: true
        }
      ];
      loopValues.forEach(loopValue => {
        const searchState: SearchStateInterface = {
          filterCriteriaSelections: loopValue.filterCriteriaSelection,
          searchTerm: ''
        };
        const getSpecialitiesSpy = jest.spyOn(
          learningPlanService,
          'getSpecialities'
        );
        const getAvailableYearsForSearchSpy = jest.spyOn(
          learningPlanService,
          'getAvailableYearsForSearch'
        );
        expect(
          learningPlanFilterFactory.getFilters(searchState)
        ).toBeObservable(
          hot('a', {
            a: expectedOutputFilters.map(outputFilter => ({
              criteria: loopValue.expectedSearchFilterCriterias,
              component: outputFilter.component,
              domHost: outputFilter.domHost
            }))
          })
        );
        expect(getAvailableYearsForSearchSpy).toHaveBeenCalledTimes(
          loopValue.getAvailableYearsForSearchCalled ? 1 : 0
        );
        expect(getSpecialitiesSpy).toHaveBeenCalledTimes(
          loopValue.getSpecialitiesCalled ? 1 : 0
        );
        jest.restoreAllMocks();
      });
    });
  });

  describe('getPredictionFilterNames', () => {
    it('should return the filternames', () => {
      // learningarea present
      const mockSearchState = {
        filterCriteriaSelections: new Map([['learningArea', [1]]]),
        searchTerm: ''
      } as SearchStateInterface;
      let result = learningPlanFilterFactory.getPredictionFilterNames(
        mockSearchState
      );
      expect(result).toEqual(['eduNets']);

      // learningArea, eduNets present
      mockSearchState.filterCriteriaSelections.set('eduNets', [1]);
      result = learningPlanFilterFactory.getPredictionFilterNames(
        mockSearchState
      );
      expect(result).toEqual(['eduNets', 'schoolTypes']);

      // learningArea, eduNets, schoolTypes present
      mockSearchState.filterCriteriaSelections.set('schoolTypes', [1]);
      result = learningPlanFilterFactory.getPredictionFilterNames(
        mockSearchState
      );
      expect(result).toEqual(['eduNets', 'schoolTypes', 'years']);

      // learningArea, eduNets, schoolTypes, years present
      mockSearchState.filterCriteriaSelections.set('years', [1]);
      result = learningPlanFilterFactory.getPredictionFilterNames(
        mockSearchState
      );
      expect(result).toEqual([
        'eduNets',
        'schoolTypes',
        'years',
        'learningPlans.assignments.specialty'
      ]);

      // learningArea, eduNets, schoolTypes, years, specialty present -> same as last
      mockSearchState.filterCriteriaSelections.set(
        'learningPlans.assignments.specialty',
        [1]
      );
      result = learningPlanFilterFactory.getPredictionFilterNames(
        mockSearchState
      );
      expect(result).toEqual([
        'eduNets',
        'schoolTypes',
        'years',
        'learningPlans.assignments.specialty'
      ]);
    });
  });

  function loadInStore() {
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
  }
});
