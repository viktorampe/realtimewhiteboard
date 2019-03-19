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
    new EduContentProductTypeFixture({ id: 13 })
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

  describe('getfilters', () => {
    let factory: SearchTermFilterFactory;
    let expected: SearchFilterInterface[];
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

    describe('years', () => {
      const mockSelectedYearId = 3;
      const expectedYearFilter = getExpectedYearFilter(mockSelectedYearId);

      beforeAll(() => {
        // select learningArea
        /*mockSearchState.filterCriteriaSelections.set('years', [
          mockSelectedYearId
        ]);*/
      });

      it('should return filterCriteria', () => {
        expect(result).toBeObservable(cold('a', { a: expectedFilters }));
      });
    });
  });

  function getExpectedYearFilter(selectedId?: number) {
    return {
      criteria: {
        name: 'years',
        label: 'Jaar',
        keyProperty: 'id',
        displayProperty: 'name',
        values: mockYears.map(year => ({
          data: year,
          selected: year.id === selectedId
        }))
      },
      component: CheckboxLineFilterComponent,
      domHost: 'hostLeft',
      options: undefined
    };
  }

  function getExpectedEduNetFilter(selectedId?: number) {
    return {
      criteria: {
        name: 'eduNets',
        label: 'Onderwijsnet',
        keyProperty: 'id',
        displayProperty: 'name',
        values: mockEduNets.map(eduNet => ({
          data: eduNet,
          selected: eduNet.id === selectedId
        }))
      },
      component: CheckboxListFilterComponent,
      domHost: 'hostLeft',
      options: undefined
    };
  }

  function getExpectedSchoolTypeFilter(selectedId?: number) {
    return {
      criteria: {
        name: 'schoolTypes',
        label: 'Onderwijsvorm',
        keyProperty: 'id',
        displayProperty: 'name',
        values: mockSchoolTypes.map(schoolType => ({
          data: schoolType,
          selected: schoolType.id === selectedId
        }))
      },
      component: CheckboxListFilterComponent,
      domHost: 'hostLeft',
      options: undefined
    };
  }

  function getExpectedMethodFilter(selectedId?: number) {
    return {
      criteria: {
        name: 'methods',
        label: 'Methode',
        keyProperty: 'id',
        displayProperty: 'name',
        values: mockMethods.map(method => ({
          data: method,
          selected: method.id === selectedId
        }))
      },
      component: CheckboxListFilterComponent,
      domHost: 'hostLeft',
      options: undefined
    };
  }

  function getExpectedEduContentProductTypeFilter(selectedId?: number) {
    return {
      criteria: {
        name: 'eduContentProductType',
        label: 'Type',
        keyProperty: 'id',
        displayProperty: 'name',
        values: mockEduContentProductTypes.map(eduContentProductType => ({
          data: eduContentProductType,
          selected: eduContentProductType.id === selectedId
        }))
      },
      component: CheckboxListFilterComponent,
      domHost: 'hostLeft',
      options: undefined
    };
  }

  function getExpectedLearningDomainFilter(selectedId?: number) {
    return {
      criteria: {
        name: 'learningDomains',
        label: 'Leergebied',
        keyProperty: 'id',
        displayProperty: 'name',
        values: mockLearningDomains.map(learningDomain => ({
          data: learningDomain,
          selected: learningDomain.id === selectedId
        }))
      },
      component: CheckboxListFilterComponent,
      domHost: 'hostLeft',
      options: undefined
    };
  }
});
//file.only
