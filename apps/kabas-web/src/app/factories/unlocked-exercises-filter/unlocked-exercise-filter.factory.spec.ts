import { TestBed } from '@angular/core/testing';
import { DalState, getStoreModuleForFeatures, MethodLevelActions, MethodLevelFixture, MethodLevelReducer } from '@campus/dal';
import { ButtonToggleFilterComponent, SearchFilterInterface, SearchStateInterface } from '@campus/search';
import { Store, StoreModule } from '@ngrx/store';
import { cold } from '@nrwl/angular/testing';
import { configureTestSuite } from 'ng-bullet';
import { UnlockedExerciseFilterFactory } from './unlocked-exercise-filter.factory';

describe('ChapterLessonFilterFactory', () => {
  let store: Store<DalState>;
  let factory: UnlockedExerciseFilterFactory;

  const mockMethodLevels = [
    new MethodLevelFixture({ id: 11, methodId: 1, levelId: 1, label: 'basis' }),
    new MethodLevelFixture({ id: 12, methodId: 1, levelId: 2, label: 'extra' }),
    new MethodLevelFixture({ id: 21, methodId: 2, levelId: 1, label: 'groen' }),
    new MethodLevelFixture({ id: 22, methodId: 2, levelId: 2, label: 'blauw' })
  ];

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
                StoreModule.forRoot({},{
          runtimeChecks: {
            strictStateImmutability: false,
            strictActionImmutability: false
          }}),
        ...getStoreModuleForFeatures([MethodLevelReducer])
      ],
      providers: [UnlockedExerciseFilterFactory, Store]
    });
  });

  beforeEach(() => {
    store = TestBed.get(Store);
    factory = TestBed.get(UnlockedExerciseFilterFactory);

    loadInStore();
  });

  it('should be created', () => {
    expect(factory).toBeTruthy();
  });

  describe('getFilters', () => {
    const mockSearchState: SearchStateInterface = {
      searchTerm: '',
      filterCriteriaSelections: new Map<string, (number | string)[]>([
        ['methods', [2]]
      ])
    };

    it('should return the right filters', () => {
      const result = factory.getFilters(mockSearchState);

      expect(result).toBeObservable(
        cold('a', {
          a: [getExpectedMethodLevelFilter()]
        })
      );
    });
  });

  describe('getPredictionFilterNames', () => {
    it('should return the correct filter names', () => {
      const filternames = factory.getPredictionFilterNames();
      expect(filternames).toEqual(['level']);
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
          visible: true
        }))
      },
      component: component,
      domHost: 'hostTop'
    } as SearchFilterInterface;
    if (options) searchFilter.options = options;
    return searchFilter;
  }

  function getExpectedMethodLevelFilter() {
    return getExpectedFilter(
      'level',
      'Type',
      'levelId',
      'icon',
      [mockMethodLevels[2], mockMethodLevels[3]],
      ButtonToggleFilterComponent
    );
  }

  function loadInStore() {
    store.dispatch(
      new MethodLevelActions.MethodLevelsLoaded({
        methodLevels: mockMethodLevels
      })
    );
  }
});
