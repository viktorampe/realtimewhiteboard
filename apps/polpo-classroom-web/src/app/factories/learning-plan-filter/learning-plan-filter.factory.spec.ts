import { TestBed } from '@angular/core/testing';
import {
  EduNetActions,
  EduNetFixture,
  EduNetReducer,
  getStoreModuleForFeatures,
  LearningAreaActions,
  LearningAreaFixture,
  LearningAreaReducer,
  LearningPlanFixture,
  LearningPlanInterface,
  LEARNING_PLAN_SERVICE_TOKEN,
  SchoolTypeActions,
  SchoolTypeFixture,
  SchoolTypeReducer,
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
import { of } from 'rxjs';
import {
  EDU_NETS_FILTER_PROPS,
  LEARNING_AREA_FILTER_PROPS,
  LEARNING_PLAN_ASSIGNMENTS_FILTER_PROPS,
  SCHOOL_TYPES_FILTER_PROPS,
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
    domHost: 'hostTop'
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
    let searchFilterCriterias;
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
          ...LEARNING_PLAN_ASSIGNMENTS_FILTER_PROPS,
          values: Array.from(mockLearningPlans).map(
            ([specialty, learningPlans]: [
              SpecialtyInterface,
              LearningPlanInterface[]
            ]) => {
              return {
                data: {
                  label: specialty.name,
                  ids: learningPlans.map(a => a.id)
                },
                hasChild: false
              };
            }
          )
        }
      ];
    });

    it('should return the correct searchFilterInterface array', () => {
      const loopValues: {
        filterCriteriaSelection: Map<string, (number | string)[]>;
        expectedSearchFilterCriterias: SearchFilterCriteriaInterface[];
        getLearningPlanAssignmentsCalled: boolean;
        getAvailableYearsForSearchCalled: boolean;
      }[] = [
        {
          filterCriteriaSelection: new Map<string, (number | string)[]>([
            ['learningAreas', []] // test if empty array is handled as nothing is selected
          ]),
          expectedSearchFilterCriterias: [searchFilterCriterias[0]],
          getAvailableYearsForSearchCalled: false,
          getLearningPlanAssignmentsCalled: false
        },
        {
          filterCriteriaSelection: new Map<string, (number | string)[]>([
            ['learningAreas', []],
            ['eduNets', ['2']] // test to make sure no column level can be skipped
          ]),
          expectedSearchFilterCriterias: [searchFilterCriterias[0]],
          getAvailableYearsForSearchCalled: false,
          getLearningPlanAssignmentsCalled: false
        },
        {
          filterCriteriaSelection: new Map<string, (number | string)[]>([]),
          expectedSearchFilterCriterias: [searchFilterCriterias[0]],
          getAvailableYearsForSearchCalled: false,
          getLearningPlanAssignmentsCalled: false
        },
        {
          filterCriteriaSelection: new Map<string, (number | string)[]>([
            ['learningAreas', [1]]
          ]),
          expectedSearchFilterCriterias: [
            searchFilterCriterias[0],
            searchFilterCriterias[1]
          ],
          getAvailableYearsForSearchCalled: false,
          getLearningPlanAssignmentsCalled: false
        },
        {
          filterCriteriaSelection: new Map<string, (number | string)[]>([
            ['learningAreas', [1]],
            ['eduNets', ['2']] //testing string to number convertion
          ]),
          expectedSearchFilterCriterias: [
            searchFilterCriterias[0],
            searchFilterCriterias[1],
            searchFilterCriterias[2]
          ],
          getAvailableYearsForSearchCalled: false,
          getLearningPlanAssignmentsCalled: false
        },
        {
          filterCriteriaSelection: new Map<string, (number | string)[]>([
            ['learningAreas', [1]],
            ['eduNets', [2]],
            ['schoolTypes', [4]]
          ]),
          expectedSearchFilterCriterias: [
            searchFilterCriterias[0],
            searchFilterCriterias[1],
            searchFilterCriterias[2],
            searchFilterCriterias[3]
          ],
          getAvailableYearsForSearchCalled: true,
          getLearningPlanAssignmentsCalled: false
        },
        {
          filterCriteriaSelection: new Map<string, (number | string)[]>([
            ['learningAreas', [1]],
            ['eduNets', [2]],
            ['schoolTypes', [4]],
            ['years', [4]]
          ]),
          expectedSearchFilterCriterias: [
            searchFilterCriterias[0],
            searchFilterCriterias[1],
            searchFilterCriterias[2],
            searchFilterCriterias[3],
            searchFilterCriterias[4]
          ],
          getAvailableYearsForSearchCalled: true,
          getLearningPlanAssignmentsCalled: true
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
        expect(getLearningPlanAssignmentsSpy).toHaveBeenCalledTimes(
          loopValue.getLearningPlanAssignmentsCalled ? 1 : 0
        );
        jest.restoreAllMocks();
      });
    });
  });
});
