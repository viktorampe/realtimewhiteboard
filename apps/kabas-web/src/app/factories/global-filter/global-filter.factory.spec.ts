import { TestBed } from '@angular/core/testing';
import {
  DalState,
  DiaboloPhaseActions,
  DiaboloPhaseFixture,
  DiaboloPhaseReducer,
  EduContentProductTypeActions,
  EduContentProductTypeFixture,
  EduContentProductTypeReducer,
  getStoreModuleForFeatures
} from '@campus/dal';
import {
  ButtonToggleFilterComponent,
  SearchFilterInterface,
  SearchStateInterface,
  SelectFilterComponent
} from '@campus/search';
import { Store, StoreModule } from '@ngrx/store';
import { cold } from '@nrwl/nx/testing';
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

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        ...getStoreModuleForFeatures([
          EduContentProductTypeReducer,
          DiaboloPhaseReducer
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
            getExpectedEduContentProductTypeFilter(),
            getExpectedDiaboloPhaseFilter()
          ]
        })
      );
    });
  });

  describe('getPredictionFilterNames', () => {
    it('should return the correct filter names', () => {
      const filternames = factory.getPredictionFilterNames();
      expect(filternames).toEqual(['eduContentProductType', 'diaboloPhase']);
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
      domHost: 'hostTop'
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
      SelectFilterComponent
    );
  }

  function getExpectedDiaboloPhaseFilter() {
    return getExpectedFilter(
      'diaboloPhase',
      'Diabolo-fase',
      'id',
      'icon',
      mockDiaboloPhases,
      ButtonToggleFilterComponent,
      { multiple: true }
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
  }
});
