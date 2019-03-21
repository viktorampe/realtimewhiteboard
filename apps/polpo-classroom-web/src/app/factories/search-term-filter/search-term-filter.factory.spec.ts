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
  SearchStateInterface
} from '@campus/search';
import { Store, StoreModule } from '@ngrx/store';
import { cold } from 'jasmine-marbles';
import { SearchTermFilterFactory } from './search-term-filter.factory';

describe('SearchTermFilterFactory', () => {
  let store: Store<DalState>;

  const mockYears = [new YearFixture({ id: 3 }), new YearFixture({ id: 4 })];

  const mockEduNets = [
    new EduNetFixture({ id: 8 }),
    new EduNetFixture({ id: 9 })
  ];

  const mockSchoolTypes = [
    new SchoolTypeFixture({ id: 10 }),
    new SchoolTypeFixture({ id: 11 })
  ];

  const mockMethods = [
    new MethodFixture({ id: 5 }),
    new MethodFixture({ id: 6 }),
    new MethodFixture({ id: 7 })
  ];

  const mockLearningDomains = SearchTermFilterFactory.learningDomains;

  const mockEduContentProductTypes = [
    new EduContentProductTypeFixture({ id: 12 }),
    new EduContentProductTypeFixture({ id: 13 }),
    new EduContentProductTypeFixture({ id: 14, parent: 13 })
  ];

  const nestedMockEduContentProductTypes = [
    new EduContentProductTypeFixture({ id: 12 }),
    {
      id: 13,
      children: [new EduContentProductTypeFixture({ id: 14, parent: 13 })]
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        ...getStoreModuleForFeatures([
          YearReducer,
          EduNetReducer,
          SchoolTypeReducer,
          MethodReducer,
          EduContentProductTypeReducer
        ])
      ],
      providers: [Store]
    });

    store = TestBed.get(Store);
  });

  it('should be created', () => {
    const factory: SearchTermFilterFactory = TestBed.get(
      SearchTermFilterFactory
    );
    expect(factory).toBeTruthy();
  });

  describe('getFilters', () => {
    let factory: SearchTermFilterFactory;

    const mockSearchState: SearchStateInterface = {
      searchTerm: '',
      filterCriteriaSelections: new Map<string, (number | string)[]>()
    };

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
    }

    beforeEach(() => {
      factory = TestBed.get(SearchTermFilterFactory);

      loadInStore();
    });

    it('should return the right filters', () => {
      const result = factory.getFilters(mockSearchState);
      const expectedFilters = [
        getExpectedYearFilter(),
        getExpectedEduNetFilter(),
        getExpectedSchoolTypeFilter(),
        getExpectedMethodFilter(),
        getExpectedEduContentProductTypeFilter(),
        getExpectedLearningDomainFilter()
      ];

      expect(result).toBeObservable(cold('a', { a: expectedFilters }));
    });
  });

  function getExpectedFilter(
    name,
    label,
    keyProperty,
    displayProperty,
    values,
    component
  ) {
    return {
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
    };
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
      CheckboxListFilterComponent
    );
  }

  function getExpectedSchoolTypeFilter() {
    return getExpectedFilter(
      'schoolTypes',
      'Onderwijsvorm',
      'id',
      'name',
      mockSchoolTypes,
      CheckboxListFilterComponent
    );
  }

  function getExpectedMethodFilter() {
    return getExpectedFilter(
      'methods',
      'Methode',
      'id',
      'name',
      mockMethods,
      CheckboxListFilterComponent
    );
  }

  function getExpectedLearningDomainFilter() {
    return getExpectedFilter(
      'learningDomains',
      'Leergebied',
      'id',
      'name',
      mockLearningDomains,
      CheckboxListFilterComponent
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
      CheckboxListFilterComponent
    );
  }
});
