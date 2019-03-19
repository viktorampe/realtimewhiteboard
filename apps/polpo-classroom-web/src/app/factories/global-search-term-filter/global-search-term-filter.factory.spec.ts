import { TestBed } from '@angular/core/testing';
import {
  DalState,
  EduNetActions,
  EduNetFixture,
  EduNetReducer,
  getStoreModuleForFeatures,
  LearningAreaActions,
  LearningAreaFixture,
  LearningAreaReducer,
  MethodActions,
  MethodFixture,
  MethodReducer
} from '@campus/dal';
import {
  CheckboxLineFilterComponent,
  CheckboxListFilterComponent,
  SearchFilterInterface,
  SearchStateInterface
} from '@campus/search';
import { Store, StoreModule } from '@ngrx/store';
import { hot } from '@nrwl/nx/testing';
import { GlobalSearchTermFilterFactory } from './global-search-term-filter.factory';
// file.only
describe('GlobalSearchTermFilterFactory', () => {
  let store: Store<DalState>;
  let factory: GlobalSearchTermFilterFactory;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        ...getStoreModuleForFeatures([
          LearningAreaReducer,
          MethodReducer,
          EduNetReducer
        ])
      ],
      providers: [Store, GlobalSearchTermFilterFactory]
    });

    store = TestBed.get(Store);
    factory = TestBed.get(GlobalSearchTermFilterFactory);
  });

  it('should be created', () => {
    const factory: GlobalSearchTermFilterFactory = TestBed.get(
      GlobalSearchTermFilterFactory
    );
    expect(factory).toBeTruthy();
  });

  describe('getFilters()', () => {
    const filterCriteriaSelections = new Map<string, (number | string)[]>();
    filterCriteriaSelections.set('learningArea', [1, 2]);
    filterCriteriaSelections.set('methods', [1]);
    filterCriteriaSelections.set('eduNets', [6]);

    const mockLearningAreas = [
      new LearningAreaFixture({ id: 1, name: 'foo' }),
      new LearningAreaFixture({ id: 2, name: 'bar' }),
      new LearningAreaFixture({ id: 3, name: 'baz' })
    ];
    const mockMethods = [
      new MethodFixture({ id: 1, name: 'foo' }),
      new MethodFixture({ id: 2, name: 'bar' }),
      new MethodFixture({ id: 3, name: 'baz' })
    ];

    const mockEduNets = [
      new EduNetFixture({ id: 5, name: 'fooEduNet' }),
      new EduNetFixture({ id: 6, name: 'barEduNet' }),
      new EduNetFixture({ id: 7, name: 'bazEduNet' })
    ];

    beforeEach(() => {
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
    });

    let mockSearchState: SearchStateInterface = {
      searchTerm: '',
      filterCriteriaSelections: filterCriteriaSelections
    };

    const expectedSearchFilterCriteria: SearchFilterInterface[] = [
      {
        criteria: {
          name: 'learningDomains',
          label: 'Leerdomein',
          keyProperty: 'id',
          displayProperty: 'name',
          values: []
        },
        component: CheckboxListFilterComponent,
        domHost: 'hostLeft'
      },
      {
        criteria: {
          name: 'methods',
          label: 'Methode',
          keyProperty: 'id',
          displayProperty: 'name',
          values: [
            {
              data: mockMethods[0],
              selected: true
            },
            {
              data: mockMethods[1],
              selected: false
            },
            {
              data: mockMethods[2],
              selected: false
            }
          ]
        },
        component: CheckboxListFilterComponent,
        domHost: 'hostLeft'
      },
      {
        criteria: {
          name: 'years',
          label: 'Jaar',
          keyProperty: 'id',
          displayProperty: 'name',
          values: []
        },
        component: CheckboxLineFilterComponent,
        domHost: 'hostLeft'
      },
      {
        criteria: {
          name: 'grades',
          label: 'Graad',
          keyProperty: 'id',
          displayProperty: 'name',
          values: []
        },
        component: CheckboxLineFilterComponent,
        domHost: 'hostLeft'
      },
      {
        criteria: {
          name: 'eduNets',
          label: 'Onderwijsnet',
          keyProperty: 'id',
          displayProperty: 'name',
          values: [
            {
              data: mockEduNets[0],
              selected: false
            },
            {
              data: mockEduNets[1],
              selected: true
            },
            {
              data: mockEduNets[2],
              selected: false
            }
          ]
        },
        component: CheckboxListFilterComponent,
        domHost: 'hostLeft'
      },
      {
        criteria: {
          name: 'schoolTypes',
          label: 'Onderwijsvorm',
          keyProperty: 'id',
          displayProperty: 'name',
          values: []
        },
        component: CheckboxListFilterComponent,
        domHost: 'hostLeft'
      },
      {
        criteria: {
          name: 'eduContentProductType',
          label: 'Type',
          keyProperty: 'id',
          displayProperty: 'name',
          values: []
        },
        component: CheckboxListFilterComponent,
        domHost: 'hostLeft'
      },
      {
        criteria: {
          name: 'learningArea',
          label: 'Leergebied',
          keyProperty: 'id',
          displayProperty: 'name',
          values: [
            {
              data: mockLearningAreas[0],
              selected: true
            },
            {
              data: mockLearningAreas[1],
              selected: true
            },
            {
              data: mockLearningAreas[2],
              selected: false
            }
          ]
        },
        component: CheckboxListFilterComponent,
        domHost: 'hostLeft'
      }
    ];

    it('should return the requested filters', () => {
      const expected = hot('(a|)', { a: expectedSearchFilterCriteria });
      const result = factory.getFilters(mockSearchState);
      expect(result).toBeObservable(expected);
    });
  });
});
