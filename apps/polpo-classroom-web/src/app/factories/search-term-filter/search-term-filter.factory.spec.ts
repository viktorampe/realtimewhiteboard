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
  CheckboxFilterComponent,
  CheckboxLineFilterComponent,
  CheckboxListFilterComponent,
  SearchFilterInterface,
  SearchStateInterface
} from '@campus/search';
import { Store, StoreModule } from '@ngrx/store';
import { cold } from 'jasmine-marbles';
import { Observable } from 'rxjs';
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
    let result: Observable<SearchFilterInterface[]>;

    const mockSearchState: SearchStateInterface = {
      searchTerm: '',
      filterCriteriaSelections: new Map<string, (number | string)[]>()
    };

    const expectedFilters = [
      getExpectedYearFilter(),
      getExpectedEduNetFilter(),
      getExpectedSchoolTypeFilter(),
      getExpectedMethodFilter(),
      getExpectedEduContentProductTypeFilter(),
      getExpectedLearningDomainFilter()
    ];

    beforeEach(() => {
      factory = TestBed.get(SearchTermFilterFactory);

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

      result = factory.getFilters(mockSearchState);
    });

    it('should return the right filters', () => {
      expect(result).toBeObservable(cold('a', { a: expectedFilters }));
    });
  });

  function getExpectedFilter(
    name,
    label,
    keyProperty,
    displayProperty,
    values,
    component,
    selectedId?: number
  ) {
    return {
      criteria: {
        name: name,
        label: label,
        keyProperty: keyProperty,
        displayProperty: displayProperty,
        values: values.map(val => ({
          data: val,
          selected: val.id === selectedId,
          child: (val as any).children
            ? this.getExpectedFilter(
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
      domHost: 'hostLeft',
      options: undefined
    };
  }

  function getExpectedYearFilter(selectedId?: number) {
    return getExpectedFilter(
      'years',
      'Jaar',
      'id',
      'name',
      mockYears,
      CheckboxLineFilterComponent,
      selectedId
    );
  }

  function getExpectedEduNetFilter(selectedId?: number) {
    return getExpectedFilter(
      'eduNets',
      'Onderwijsnet',
      'id',
      'name',
      mockEduNets,
      CheckboxListFilterComponent,
      selectedId
    );
  }

  function getExpectedSchoolTypeFilter(selectedId?: number) {
    return getExpectedFilter(
      'schoolTypes',
      'Onderwijsvorm',
      'id',
      'name',
      mockSchoolTypes,
      CheckboxListFilterComponent,
      selectedId
    );
  }

  function getExpectedMethodFilter(selectedId?: number) {
    return getExpectedFilter(
      'methods',
      'Methode',
      'id',
      'name',
      mockMethods,
      CheckboxListFilterComponent,
      selectedId
    );
  }

  function getExpectedLearningDomainFilter(selectedId?: number) {
    return getExpectedFilter(
      'learningDomains',
      'Leergebied',
      'id',
      'name',
      mockLearningDomains,
      CheckboxListFilterComponent,
      selectedId
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
      CheckboxFilterComponent
    );
  }
});
//file.only
