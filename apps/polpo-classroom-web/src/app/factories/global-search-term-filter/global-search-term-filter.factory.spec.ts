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
  LearningAreaActions,
  LearningAreaFixture,
  LearningAreaReducer,
  LearningDomainActions,
  LearningDomainFixture,
  LearningDomainReducer,
  MethodActions,
  MethodFixture,
  MethodReducer,
  SchoolTypeActions,
  SchoolTypeFixture,
  SchoolTypeQueries,
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
import { hot } from '@nrwl/nx/testing';
import { GlobalSearchTermFilterFactory } from './global-search-term-filter.factory';

describe('GlobalSearchTermFilterFactory', () => {
  let store: Store<DalState>;
  let factory: GlobalSearchTermFilterFactory;

  const mockLearningAreas = [
    new LearningAreaFixture({ id: 1, name: 'fooLearningArea' }),
    new LearningAreaFixture({ id: 2, name: 'barLearningArea' }),
    new LearningAreaFixture({ id: 3, name: 'bazLearningArea' })
  ];

  const mockMethods = [
    new MethodFixture({ id: 1, name: 'fooMethod', learningAreaId: 1 }),
    new MethodFixture({ id: 2, name: 'barMethod', learningAreaId: 2 }),
    new MethodFixture({ id: 3, name: 'bazMethod', learningAreaId: 5 })
  ];

  const mockEduNets = [
    new EduNetFixture({ id: 5, name: 'fooEduNet' }),
    new EduNetFixture({ id: 6, name: 'barEduNet' }),
    new EduNetFixture({ id: 7, name: 'bazEduNet' })
  ];

  const mockYears = [new YearFixture({ id: 3 }), new YearFixture({ id: 4 })];

  const mockSchoolTypes = [
    new SchoolTypeFixture({ id: 10, name: 'fooSchoolType' }),
    new SchoolTypeFixture({ id: 11, name: 'barSchoolType' })
  ];

  const mockEduContentProductTypes = [
    new EduContentProductTypeFixture({
      id: 12,
      name: 'fooProductType',
      parent: 0
    }),
    new EduContentProductTypeFixture({
      id: 13,
      name: 'barProductType',
      parent: 0
    }),
    new EduContentProductTypeFixture({
      id: 14,
      name: 'bazProductType',
      parent: 13
    })
  ];

  const mockLearningDomains = [
    new LearningDomainFixture({
      id: 15,
      learningAreaId: 1
    }),
    new LearningDomainFixture({
      id: 16,
      learningAreaId: 2
    }),
    new LearningDomainFixture({
      id: 17,
      learningAreaId: 10
    })
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        ...getStoreModuleForFeatures([
          LearningAreaReducer,
          MethodReducer,
          EduNetReducer,
          YearReducer,
          SchoolTypeReducer,
          LearningDomainReducer,
          EduContentProductTypeReducer
        ])
      ],
      providers: [Store, GlobalSearchTermFilterFactory]
    });

    store = TestBed.get(Store);
    factory = TestBed.get(GlobalSearchTermFilterFactory);
  });

  it('should be created', () => {
    expect(factory).toBeTruthy();
  });

  // describe('getFilters()', () => {
  //   beforeEach(() => {
  //     // fill the store with data
  //     hydrateStore();
  //   });

  //   it('should return the requested filters', () => {
  //     // set which filters are selected
  //     const filterCriteriaSelections = new Map<string, (number | string)[]>();
  //     filterCriteriaSelections.set('learningArea', [1, 2]);

  //     const mockSearchState: SearchStateInterface = {
  //       searchTerm: '',
  //       filterCriteriaSelections: filterCriteriaSelections
  //     };
  //     const expectedFilters = [
  //       getExpectedYearFilter(),
  //       getExpectedEduNetFilter(),
  //       getExpectedSchoolTypeFilter(),
  //       getExpectedLearningAreaFilter(),
  //       getExpectedMethodFilter(),
  //       getExpectedLearningDomainFilter(),
  //       getExpectedEduContentProductTypeFilter()
  //     ];

  //     const expected = hot('a', { a: expectedFilters });

  //     const result = factory.getFilters(mockSearchState);
  //     expect(result).toBeObservable(expected);
  //   });

  //   it('should not have method filters nor learning domain filters if no learning area is selected', () => {
  //     // no learning areas selected
  //     const filterCriteriaSelections = new Map<string, (number | string)[]>();

  //     const mockSearchState: SearchStateInterface = {
  //       searchTerm: '',
  //       filterCriteriaSelections: filterCriteriaSelections
  //     };

  //     const expectedFilters = [
  //       getExpectedYearFilter(),
  //       getExpectedEduNetFilter(),
  //       getExpectedSchoolTypeFilter(),
  //       getExpectedLearningAreaFilter(),
  //       getExpectedEduContentProductTypeFilter()
  //     ];

  //     const expected = hot('a', { a: expectedFilters });

  //     const result = factory.getFilters(mockSearchState);
  //     expect(result).toBeObservable(expected);
  //   });
  // });

  describe('', () => {
    beforeEach(() => {
      hydrateStore();
      // empty school types from store
      store.dispatch(new SchoolTypeActions.ClearSchoolTypes());

      store
        .select(SchoolTypeQueries.getAll)
        .subscribe(entities => console.log(entities));
    });
    fit('should remove filters without values', () => {
      // do selected learning areas
      const filterCriteriaSelections = new Map<string, (number | string)[]>();
      // filterCriteriaSelections.set('learningArea', [1, 2]);

      const mockSearchState: SearchStateInterface = {
        searchTerm: '',
        filterCriteriaSelections: filterCriteriaSelections
      };

      const expectedFilters = [
        getExpectedYearFilter(),
        getExpectedEduNetFilter(),
        getExpectedLearningAreaFilter(),
        getExpectedEduContentProductTypeFilter()
      ];

      const expected = hot('a', { a: expectedFilters });

      const result = factory.getFilters(mockSearchState);
      expect(result).toBeObservable(expected);
    });
  });

  function hydrateStore() {
    store.dispatch(
      new YearActions.YearsLoaded({
        years: mockYears
      })
    );
    store.dispatch(
      new SchoolTypeActions.SchoolTypesLoaded({
        schoolTypes: mockSchoolTypes
      })
    );
    store.dispatch(
      new EduContentProductTypeActions.EduContentProductTypesLoaded({
        eduContentProductTypes: mockEduContentProductTypes
      })
    );

    store.dispatch(
      new LearningAreaActions.LearningAreasLoaded({
        learningAreas: mockLearningAreas
      })
    );
    store.dispatch(
      new MethodActions.MethodsLoaded({
        methods: mockMethods
      })
    );
    store.dispatch(
      new EduNetActions.EduNetsLoaded({
        eduNets: mockEduNets
      })
    );
    store.dispatch(
      new LearningDomainActions.LearningDomainsLoaded({
        learningDomains: mockLearningDomains
      })
    );
  }

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

  function getExpectedLearningAreaFilter() {
    return getExpectedFilter(
      'learningArea',
      'Leergebied',
      'id',
      'name',
      mockLearningAreas,
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

  function getExpectedMethodFilter() {
    return getExpectedFilter(
      'methods',
      'Methode',
      'id',
      'name',
      mockMethods.filter(
        method => method.learningAreaId === 1 || method.learningAreaId === 2 // see mocks to know the learningAreaIds
      ),
      CheckboxListFilterComponent
    );
  }

  function getExpectedLearningDomainFilter() {
    return getExpectedFilter(
      'learningDomains',
      'Leergebied',
      'id',
      'name',
      mockLearningDomains.filter(
        ld => ld.learningAreaId === 1 || ld.learningAreaId === 2
      ),
      CheckboxListFilterComponent
    );
  }
});
