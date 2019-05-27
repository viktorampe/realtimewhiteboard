import { TestBed } from '@angular/core/testing';
import {
  DalState,
  EduContentProductTypeActions,
  EduContentProductTypeFixture,
  EduContentProductTypeReducer,
  EduNetActions,
  EduNetFixture,
  EduNetReducer,
  getStoreModuleForFeatures,
  LearningAreaReducer,
  LearningDomainActions,
  LearningDomainFixture,
  LearningDomainReducer,
  MethodActions,
  MethodFixture,
  MethodReducer,
  SchoolTypeActions,
  SchoolTypeFixture,
  SchoolTypeReducer,
  YearActions,
  YearFixture,
  YearReducer
} from '@campus/dal';
import {
  CheckboxLineFilterComponent,
  CheckboxListFilterComponent,
  SearchFilterInterface,
  SearchStateInterface
} from '@campus/search';
import { Store, StoreModule } from '@ngrx/store';
import { cold } from 'jasmine-marbles';
import { configureTestSuite } from 'ng-bullet';
import { SearchTermFilterFactory } from './search-term-filter.factory';

describe('SearchTermFilterFactory', () => {
  let store: Store<DalState>;
  let factory: SearchTermFilterFactory;

  const mockYears = [new YearFixture({ id: 3 }), new YearFixture({ id: 4 })];
  const currentLearningAreaId = 2;

  const mockEduNets = [
    new EduNetFixture({ id: 8 }),
    new EduNetFixture({ id: 9 })
  ];

  const mockSchoolTypes = [
    new SchoolTypeFixture({ id: 10 }),
    new SchoolTypeFixture({ id: 11 })
  ];

  const mockMethods = [
    new MethodFixture({ id: 5, learningAreaId: currentLearningAreaId }),
    new MethodFixture({ id: 6, learningAreaId: currentLearningAreaId }),
    new MethodFixture({ id: 7 })
  ];

  const mockLearningDomains = [
    new LearningDomainFixture({
      id: 15,
      learningAreaId: currentLearningAreaId
    }),
    new LearningDomainFixture({
      id: 16,
      learningAreaId: currentLearningAreaId
    }),
    new LearningDomainFixture({
      id: 17
    })
  ];

  const mockEduContentProductTypes = [
    new EduContentProductTypeFixture({ id: 12, parent: 0 }),
    new EduContentProductTypeFixture({ id: 13, parent: 0 }),
    new EduContentProductTypeFixture({ id: 14, parent: 13 })
  ];

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        ...getStoreModuleForFeatures([
          YearReducer,
          EduNetReducer,
          SchoolTypeReducer,
          MethodReducer,
          EduContentProductTypeReducer,
          LearningDomainReducer,
          LearningAreaReducer
        ])
      ],
      providers: [Store, SearchTermFilterFactory]
    });

    store = TestBed.get(Store);

    loadInStore();

    factory = TestBed.get(SearchTermFilterFactory);
  });

  it('should be created', () => {
    expect(factory).toBeTruthy();
  });

  describe('getFilters', () => {
    const mockSearchState: SearchStateInterface = {
      searchTerm: '',
      filterCriteriaSelections: new Map<string, (number | string)[]>([
        ['learningArea', [2]]
      ])
    };

    it('should return the right filters, in the correct order', () => {
      const result = factory.getFilters(mockSearchState);
      const expectedFilters = [
        getExpectedYearFilter(),
        getExpectedEduNetFilter(),
        getExpectedSchoolTypeFilter(),
        getExpectedMethodFilter(),
        getExpectedLearningDomainFilter(),
        getExpectedEduContentProductTypeFilter()
      ];

      expect(result).toBeObservable(cold('a', { a: expectedFilters }));
    });

    it('should remove filters without values', () => {
      // empty years from store
      store.dispatch(new YearActions.ClearYears());

      const result = factory.getFilters(mockSearchState);
      const expectedFilters = [
        getExpectedEduNetFilter(),
        getExpectedSchoolTypeFilter(),
        getExpectedMethodFilter(),
        getExpectedLearningDomainFilter(),
        getExpectedEduContentProductTypeFilter()
      ];

      expect(result).toBeObservable(cold('a', { a: expectedFilters }));
    });
  });

  describe('getPredictionFilterNames', () => {
    it('should return the correct filter names', () => {
      const factory: SearchTermFilterFactory = TestBed.get(
        SearchTermFilterFactory
      );

      // this specific factory doesn't need the searchState for this
      const result = factory.getPredictionFilterNames();

      expect(result).toEqual([
        'learningArea',
        'years',
        'eduNets',
        'schoolTypes',
        'methods',
        'learningDomains',
        'grades',
        'eduContentProductType'
      ]);
    });
  });

  function getExpectedFilter(
    name,
    label,
    keyProperty,
    displayProperty,
    values,
    component,
    maxVisibleItems?
  ): SearchFilterInterface {
    const searchFilter = {
      criteria: {
        name: name,
        label: label,
        keyProperty: keyProperty,
        displayProperty: displayProperty,
        values: values.map(val => ({
          data: val,
          visible: true,
          child: (val as any).children
            ? getExpectedFilter(
                name,
                label,
                keyProperty,
                displayProperty,
                (val as any).children,
                component
              ).criteria
            : undefined
        }))
      },
      component: component,
      domHost: 'hostLeft'
    } as SearchFilterInterface;
    if (maxVisibleItems) searchFilter.options = { maxVisibleItems };
    return searchFilter;
  }

  function getExpectedYearFilter() {
    return getExpectedFilter(
      'years',
      'Jaar',
      'id',
      'name',
      mockYears,
      CheckboxLineFilterComponent
    );
  }

  function getExpectedEduNetFilter() {
    return getExpectedFilter(
      'eduNets',
      'Onderwijsnet',
      'id',
      'name',
      mockEduNets,
      CheckboxListFilterComponent,
      5
    );
  }

  function getExpectedSchoolTypeFilter() {
    return getExpectedFilter(
      'schoolTypes',
      'Onderwijsvorm',
      'id',
      'name',
      mockSchoolTypes,
      CheckboxListFilterComponent,
      5
    );
  }

  function getExpectedMethodFilter() {
    return getExpectedFilter(
      'methods',
      'Methode',
      'id',
      'name',
      mockMethods.filter(
        method => method.learningAreaId === currentLearningAreaId
      ),
      CheckboxListFilterComponent,
      5
    );
  }

  function getExpectedLearningDomainFilter() {
    return getExpectedFilter(
      'learningDomains',
      'Leerdomein',
      'id',
      'name',
      mockLearningDomains.filter(
        ld => ld.learningAreaId === currentLearningAreaId
      ),
      CheckboxListFilterComponent,
      5
    );
  }

  function getExpectedEduContentProductTypeFilter() {
    const extendedProductTypes = mockEduContentProductTypes
      .map((val, ind, arr) => {
        return {
          children: arr.filter(child => child.parent === val.id),
          ...val
        };
      })
      .filter(val => val.parent === 0);

    return getExpectedFilter(
      'eduContentProductType',
      'Type',
      'id',
      'name',
      extendedProductTypes,
      CheckboxListFilterComponent,
      5
    );
  }

  function loadInStore() {
    store.dispatch(
      new YearActions.YearsLoaded({
        years: mockYears
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

    store.dispatch(
      new MethodActions.MethodsLoaded({
        methods: mockMethods
      })
    );

    store.dispatch(
      new EduContentProductTypeActions.EduContentProductTypesLoaded({
        eduContentProductTypes: mockEduContentProductTypes
      })
    );

    store.dispatch(
      new LearningDomainActions.LearningDomainsLoaded({
        learningDomains: mockLearningDomains
      })
    );
  }
});
