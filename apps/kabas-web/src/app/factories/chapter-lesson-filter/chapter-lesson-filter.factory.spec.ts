import { TestBed } from '@angular/core/testing';
import { DalState, EduContentProductTypeActions, EduContentProductTypeFixture, EduContentProductTypeReducer, getStoreModuleForFeatures } from '@campus/dal';
import { SearchFilterInterface, SearchStateInterface, SelectFilterComponent } from '@campus/search';
import { Store, StoreModule } from '@ngrx/store';
import { cold } from '@nrwl/angular/testing';
import { configureTestSuite } from 'ng-bullet';
import { ChapterLessonFilterFactory } from './chapter-lesson-filter.factory';

describe('ChapterLessonFilterFactory', () => {
  let store: Store<DalState>;
  let factory: ChapterLessonFilterFactory;

  const mockEduContentProductTypes = [
    new EduContentProductTypeFixture({ id: 12, parent: 0 }),
    new EduContentProductTypeFixture({ id: 13, parent: 0 }),
    new EduContentProductTypeFixture({ id: 14, parent: 13 })
  ];

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
                StoreModule.forRoot({},{
          runtimeChecks: {
            strictStateImmutability: false,
            strictActionImmutability: false
          }}),
        ...getStoreModuleForFeatures([EduContentProductTypeReducer])
      ],
      providers: [ChapterLessonFilterFactory, Store]
    });
  });

  beforeEach(() => {
    store = TestBed.get(Store);
    factory = TestBed.get(ChapterLessonFilterFactory);

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
          a: [getExpectedEduContentProductTypeFilter()]
        })
      );
    });
  });

  describe('getPredictionFilterNames', () => {
    it('should return the correct filter names', () => {
      const filternames = factory.getPredictionFilterNames();
      expect(filternames).toEqual(['eduContentProductType']);
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

  function loadInStore() {
    store.dispatch(
      new EduContentProductTypeActions.EduContentProductTypesLoaded({
        eduContentProductTypes: mockEduContentProductTypes
      })
    );
  }
});
