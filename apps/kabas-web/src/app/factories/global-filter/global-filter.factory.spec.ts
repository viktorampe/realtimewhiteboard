import { TestBed } from '@angular/core/testing';
import {
  DalState,
  DiaboloPhaseActions,
  DiaboloPhaseFixture,
  DiaboloPhaseReducer,
  EduContentProductTypeActions,
  EduContentProductTypeFixture,
  EduContentProductTypeReducer,
  getStoreModuleForFeatures,
  LearningDomainActions,
  LearningDomainFixture,
  LearningDomainReducer,
  MethodActions,
  MethodFixture,
  MethodReducer,
  YearActions,
  YearFixture,
  YearReducer
} from '@campus/dal';
import {
  ButtonToggleFilterComponent,
  CheckboxLineFilterComponent,
  CheckboxListFilterComponent,
  SearchFilterInterface,
  SearchStateInterface
} from '@campus/search';
import { Store, StoreModule } from '@ngrx/store';
import { cold } from '@nrwl/angular/testing';
import { configureTestSuite } from 'ng-bullet';
import { GlobalFilterFactory } from './global-filter.factory';

describe('DiaboloChapterLessonFilterFactory', () => {
  let store: Store<DalState>;
  let factory: GlobalFilterFactory;

  const mockEduContentProductTypes = [
    new EduContentProductTypeFixture({ id: 12, parent: 0 }),
    new EduContentProductTypeFixture({ id: 13, parent: 0 }),
    new EduContentProductTypeFixture({ id: 14, parent: 13 })
  ];

  const mockDiaboloPhases = [
    new DiaboloPhaseFixture({ id: 1, phase: 1 }),
    new DiaboloPhaseFixture({ id: 2, phase: 2 }),
    new DiaboloPhaseFixture({ id: 3, phase: 3 })
  ];

  const mockMethods = [
    new MethodFixture({ id: 1, name: 'foo B@r' }),
    new MethodFixture({ id: 2, name: 'f00 Bar' }),
    new MethodFixture({ id: 3, name: '1 5p3ak l33t' })
  ];

  const mockLearningDomains = [
    new LearningDomainFixture({ id: 1, name: 'lezen' }),
    new LearningDomainFixture({ id: 2, name: 'spreken' }),
    new LearningDomainFixture({
      id: 3,
      name: 'Frederic accepteren zoals hij is'
    })
  ];

  const mockYears = [
    new YearFixture({ id: 1, name: 'K1' }),
    new YearFixture({ id: 2, name: 'K2' }),
    new YearFixture({ id: 3, name: 'K3' })
  ];

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        ...getStoreModuleForFeatures([
          EduContentProductTypeReducer,
          DiaboloPhaseReducer,
          MethodReducer,
          LearningDomainReducer,
          YearReducer
        ])
      ],
      providers: [GlobalFilterFactory, Store]
    });
  });

  beforeEach(() => {
    store = TestBed.get(Store);
    factory = TestBed.get(GlobalFilterFactory);

    loadInStore();
  });

  it('should be created', () => {
    expect(factory).toBeTruthy();
  });

  describe('getFilters', () => {
    const mockSearchState: SearchStateInterface = {
      searchTerm: '',
      filterCriteriaSelections: new Map<string, (number | string)[]>()
    };

    it('should return the right filters', () => {
      const result = factory.getFilters(mockSearchState);

      expect(result).toBeObservable(
        cold('a', {
          a: [
            getExpectedMethodFilter(),
            getExpectedLearningDomainFilter(),
            getExpectedDiaboloPhaseFilter(),
            getExpectedEduContentProductTypeFilter(),
            getExpectedYearFilter()
          ]
        })
      );
    });
  });

  describe('getPredictionFilterNames', () => {
    it('should return the correct filter names', () => {
      const filternames = factory.getPredictionFilterNames();
      expect(filternames).toEqual([
        'eduContentProductType',
        'diaboloPhase',
        'methods',
        'learningDomains',
        'years'
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
    options?
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
    if (options) searchFilter.options = options;
    return searchFilter;
  }

  function getExpectedEduContentProductTypeFilter() {
    return getExpectedFilter(
      'eduContentProductType',
      'Type',
      'id',
      'name',
      mockEduContentProductTypes,
      CheckboxListFilterComponent,
      { maxVisibleItems: 5 }
    );
  }

  function getExpectedDiaboloPhaseFilter() {
    return getExpectedFilter(
      'diaboloPhase',
      'Diabolo',
      'id',
      'icon',
      mockDiaboloPhases,
      ButtonToggleFilterComponent,
      { multiple: true }
    );
  }

  function getExpectedMethodFilter() {
    return getExpectedFilter(
      'methods',
      'Methode',
      'id',
      'name',
      mockMethods,
      CheckboxListFilterComponent,
      { maxVisibleItems: 5 }
    );
  }

  function getExpectedLearningDomainFilter() {
    return getExpectedFilter(
      'learningDomains',
      'Leerdomein',
      'id',
      'name',
      mockLearningDomains,
      CheckboxListFilterComponent,
      { maxVisibleItems: 5 }
    );
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

  function loadInStore() {
    store.dispatch(
      new EduContentProductTypeActions.EduContentProductTypesLoaded({
        eduContentProductTypes: mockEduContentProductTypes
      })
    );

    store.dispatch(
      new DiaboloPhaseActions.DiaboloPhasesLoaded({
        diaboloPhases: mockDiaboloPhases
      })
    );

    store.dispatch(
      new MethodActions.MethodsLoaded({
        methods: mockMethods
      })
    );

    store.dispatch(
      new MethodActions.AllowedMethodsLoaded({
        methodIds: mockMethods.map(method => method.id)
      })
    );

    store.dispatch(
      new LearningDomainActions.LearningDomainsLoaded({
        learningDomains: mockLearningDomains
      })
    );

    store.dispatch(
      new YearActions.YearsLoaded({
        years: mockYears
      })
    );
  }
});
