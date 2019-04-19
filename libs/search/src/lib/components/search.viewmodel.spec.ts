import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { hot } from '@nrwl/nx/testing';
import { Observable, of } from 'rxjs';
import {
  SearchFilterCriteriaFixture,
  SearchFilterCriteriaValuesFixture
} from '../+fixtures/search-filter-criteria.fixture';
import {
  SearchFilterComponentInterface,
  SearchFilterCriteriaInterface,
  SearchFilterFactory,
  SearchFilterInterface,
  SearchModeInterface,
  SearchResultInterface,
  SearchStateInterface,
  SortModeInterface
} from '../interfaces';
import { CheckboxLineFilterComponent } from './checkbox-line-filter/checkbox-line-filter-component';
import { SearchViewModel } from './search.viewmodel';

class MockFilterFactory implements SearchFilterFactory {
  private mockFilter: SearchFilterInterface = {
    criteria: null,
    component: {} as Type<SearchFilterComponentInterface>,
    domHost: 'mockHost'
  };

  getFilters(
    searchState: SearchStateInterface
  ): Observable<SearchFilterInterface[]> {
    return of([this.mockFilter]);
  }

  getPredictionFilterNames(searchState: SearchStateInterface): string[] {
    return [];
  }
}
describe('SearchViewModel', () => {
  let searchViewModel: SearchViewModel;
  const mockSearchMode: SearchModeInterface = {
    name: 'searchMode',
    label: 'foo',
    dynamicFilters: true,
    searchFilterFactory: MockFilterFactory,
    results: null
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SearchViewModel, MockFilterFactory]
    });

    searchViewModel = TestBed.get(SearchViewModel);
  });

  it('should be defined', () => {
    expect(searchViewModel).toBeDefined();
  });

  describe('changeSearchTerm', () => {
    it('should next the state with an altered search term and the from value set to zero', () => {
      const searchTerm = 'rekenen';
      const startFrom = 10;

      searchViewModel.searchState$.next(<SearchStateInterface>{
        from: startFrom
      });

      searchViewModel.changeSearchTerm(searchTerm);
      expect(searchViewModel.searchState$).toBeObservable(
        hot('a', {
          a: {
            searchTerm: searchTerm,
            from: 0
          }
        })
      );
    });
  });

  describe('changeFilters', () => {
    beforeEach(() => {
      const searchState: SearchStateInterface = {
        from: 10,
        filterCriteriaSelections: new Map([['foo', [3]], ['bar', [4, 5, 6]]])
      } as SearchStateInterface;
      searchViewModel.reset(mockSearchMode, searchState);
      // searchViewModel.searchState$.next(searchState);
    });

    it('should update `searchFilterCriteria` and reset `from` in searchState', () => {
      const searchFilterCriteria: SearchFilterCriteriaInterface = {
        name: 'foo',
        label: 'foo',
        keyProperty: 'id',
        displayProperty: 'name',
        values: [
          {
            data: { id: 1, name: 'wiskunde' },
            selected: true,
            visible: true,
            child: null
          },
          {
            data: { id: 2, name: 'geschiedenis' },
            selected: true,
            visible: true,
            child: null
          }
        ]
      };
      searchViewModel.changeFilters(searchFilterCriteria);

      expect(searchViewModel.searchState$).toBeObservable(
        hot('a', {
          a: {
            from: 0,
            filterCriteriaSelections: new Map([
              ['foo', [1, 2]],
              ['bar', [4, 5, 6]]
            ])
          }
        })
      );
    });

    it('should update `searchFilterCriteria` with child for the same searchFilter name', () => {
      const searchFilterCriteria: SearchFilterCriteriaInterface = {
        name: 'foo',
        label: 'foo',
        keyProperty: 'id',
        displayProperty: 'name',
        values: [
          {
            data: { id: 1, name: 'wiskunde' },
            selected: true,
            visible: true,
            child: null
          }
        ]
      };
      searchFilterCriteria.values[0].child = {
        name: 'foo',
        label: 'foo sub',
        keyProperty: 'id',
        displayProperty: 'name',
        values: [
          {
            data: { id: 2, name: 'geschiedenis' },
            selected: true,
            visible: true,
            child: null
          },
          {
            data: { id: 3, name: 'aardrijkskunde' },
            selected: true,
            visible: true,
            child: null
          }
        ]
      };
      searchViewModel.changeFilters(searchFilterCriteria);

      expect(searchViewModel.searchState$).toBeObservable(
        hot('a', {
          a: {
            from: 0,
            filterCriteriaSelections: new Map([
              ['foo', [1, 2, 3]],
              ['bar', [4, 5, 6]]
            ])
          }
        })
      );
    });

    it('should update `searchFilterCriteria` with child for different searchFilter name', () => {
      const searchFilterCriteria: SearchFilterCriteriaInterface = {
        name: 'foo',
        label: 'foo',
        keyProperty: 'id',
        displayProperty: 'name',
        values: [
          {
            data: { id: 1, name: 'wiskunde' },
            selected: true,
            visible: true,
            child: null
          }
        ]
      };
      searchFilterCriteria.values[0].child = {
        name: 'baz',
        label: 'baz',
        keyProperty: 'id',
        displayProperty: 'name',
        values: [
          {
            data: { id: 1, name: 'wiskunde' },
            selected: true,
            visible: true,
            child: null
          },
          {
            data: { id: 3, name: 'aardrijkskunde' },
            selected: true,
            visible: true,
            child: null
          }
        ]
      };
      searchViewModel.changeFilters(searchFilterCriteria);

      expect(searchViewModel.searchState$).toBeObservable(
        hot('a', {
          a: {
            from: 0,
            filterCriteriaSelections: new Map([
              ['foo', [1]],
              ['bar', [4, 5, 6]],
              ['baz', [1, 3]]
            ])
          }
        })
      );
    });

    it('should update `searchFilterCriteria` with array of searchFilters', () => {
      const searchFilterCriteria: SearchFilterCriteriaInterface[] = [
        {
          name: 'foo',
          label: 'foo',
          keyProperty: 'id',
          displayProperty: 'name',
          values: [
            {
              data: { id: 1, name: 'wiskunde' },
              selected: true,
              visible: true,
              child: null
            }
          ]
        },
        {
          name: 'baz',
          label: 'baz',
          keyProperty: 'id',
          displayProperty: 'name',
          values: [
            {
              data: { id: 1, name: 'wiskunde' },
              selected: true,
              visible: true,
              child: null
            },
            {
              data: { id: 3, name: 'aardrijkskunde' },
              selected: true,
              visible: true,
              child: null
            }
          ]
        }
      ];

      searchFilterCriteria[0].values[0].child = {
        name: 'blah',
        label: 'blah',
        keyProperty: 'id',
        displayProperty: 'name',
        values: [
          {
            data: { id: 8, name: 'wiskunde' },
            selected: true,
            visible: true,
            child: null
          },
          {
            data: { id: 9, name: 'aardrijkskunde' },
            selected: true,
            visible: true,
            child: null
          }
        ]
      };

      searchViewModel.changeFilters(searchFilterCriteria);

      expect(searchViewModel.searchState$).toBeObservable(
        hot('a', {
          a: {
            from: 0,
            filterCriteriaSelections: new Map([
              ['foo', [1]],
              ['bar', [4, 5, 6]],
              ['blah', [8, 9]],
              ['baz', [1, 3]]
            ])
          }
        })
      );
    });

    it('should not request new filters when dynamicfilters !== true', () => {
      searchViewModel['searchMode'] = {
        dynamicFilters: false
      } as SearchModeInterface;
      const spy = jest.spyOn(searchViewModel as any, 'updateFilters');
      searchViewModel.changeFilters({
        values: []
      } as SearchFilterCriteriaInterface);
      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });

    it('should request new filters when dynamicfilters === true', () => {
      searchViewModel['filterFactory'] = new MockFilterFactory();
      searchViewModel['searchMode'] = {
        dynamicFilters: true
      } as SearchModeInterface;
      const spy = jest.spyOn(searchViewModel as any, 'updateFilters');
      searchViewModel.changeFilters({
        values: []
      } as SearchFilterCriteriaInterface);
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });
  });

  describe('changeSort', () => {
    let mockSortMode: SortModeInterface;

    beforeEach(() => {
      mockSortMode = {
        name: 'new sort mode',
        description: 'this is the hottest new sortmode',
        icon: 'foo'
      };
    });

    it('should trigger an emit the new searchState', () => {
      const oldValue: SearchStateInterface = {
        searchTerm: 'some term',
        filterCriteriaSelections: new Map<string, (number | string)[]>()
      };
      searchViewModel.searchState$.next(oldValue);
      searchViewModel.changeSort(mockSortMode);

      const expected = { ...oldValue };
      expected.sort = mockSortMode.name;
      expected.from = 0;
      expect(searchViewModel.searchState$).toBeObservable(
        hot('a', { a: expected })
      );
    });
  });

  describe('getNextPage', () => {
    it('should next the state with the from value augmented by the pageSize in the mode', () => {
      [
        { pageSize: 10, from: undefined, expectedFrom: 10 },
        { pageSize: 20, from: 0, expectedFrom: 20 },
        { pageSize: 30, from: 10, expectedFrom: 40 }
      ].forEach(values => {
        searchViewModel.searchState$.next(<SearchStateInterface>{
          from: values.from
        });
        searchViewModel['searchMode'] = <SearchModeInterface>{
          results: { pageSize: values.pageSize }
        };
        searchViewModel.getNextPage();
        expect(searchViewModel.searchState$).toBeObservable(
          hot('a', {
            a: {
              from: values.expectedFrom
            }
          })
        );
      });
    });
  });

  describe('reset', () => {
    let mockSelections: Map<string, string[]>;
    beforeEach(() => {
      mockSelections = new Map<string, string[]>();
      mockSelections.set('foo', ['bar', 'baz']);

      const mockSearchState: SearchStateInterface = {
        searchTerm: 'foo',
        from: 30,
        filterCriteriaSelections: new Map(mockSelections) // clone of map -> gets reset
      };

      // set initial state
      searchViewModel.searchState$.next(mockSearchState);
    });

    it('should update the state', () => {
      searchViewModel.reset(
        {
          name: 'foo',
          searchFilterFactory: MockFilterFactory,
          label: '',
          dynamicFilters: null,
          results: null
        } as SearchModeInterface,
        {
          searchTerm: 'bar',
          from: 60,
          filterCriteriaSelections: new Map()
        } as SearchStateInterface
      );

      expect(searchViewModel.searchState$).toBeObservable(
        hot('a', {
          a: {
            searchTerm: 'bar',
            from: 60,
            filterCriteriaSelections: new Map()
          }
        })
      );
    });

    it('should reset the state', () => {
      searchViewModel.reset(
        {
          name: 'foo',
          searchFilterFactory: MockFilterFactory,
          label: '',
          dynamicFilters: null,
          results: null
        } as SearchModeInterface,
        null
      );

      expect(searchViewModel.searchState$).toBeObservable(
        hot('a', {
          a: {
            searchTerm: '',
            filterCriteriaSelections: mockSelections, // empty selections for predictions
            from: 0
          }
        })
      );
    });
  });

  describe('updateFilters', () => {
    it('should update the filters via the filterFactory', () => {
      searchViewModel['filterFactory'] = new MockFilterFactory();
      const spy = jest.spyOn(searchViewModel['filterFactory'], 'getFilters');

      // set initial state
      const mockSearchState = {
        searchTerm: 'foo'
      } as SearchStateInterface;
      searchViewModel.searchState$.next(mockSearchState);

      searchViewModel['updateFilters']();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(mockSearchState);
    });
  });

  describe('searchFilters$', () => {
    it('should have an empty array as results to start with', () => {
      expect(searchViewModel.searchFilters$).toBeObservable(
        hot('a', { a: [] })
      );
    });
    it('should have an empty array if only the searchState$ is updated', () => {
      searchViewModel.searchState$.next(getTestSearchState('someName', [1]));

      expect(searchViewModel.searchFilters$).toBeObservable(
        hot('a', { a: [] })
      );
    });
    it('should have an empty array if only the results$ is updated', () => {
      searchViewModel.updateResult(
        getTestSearchResult('someOtherName', new Map([[1, 0]]))
      );

      expect(searchViewModel.searchFilters$).toBeObservable(
        hot('a', { a: [] })
      );
    });
    it('should have an empty array if only the searchState$ and the results$ are is updated', () => {
      searchViewModel.searchState$.next(getTestSearchState('someName', [1]));
      searchViewModel.updateResult(
        getTestSearchResult('someOtherName', new Map([[1, 0]]))
      );

      expect(searchViewModel.searchFilters$).toBeObservable(
        hot('a', { a: [] })
      );
    });
    it(
      'should return the unchanged filters' +
        'if no state and no result updates are done with the prediction set to 0' +
        ' if it was not set before',
      () => {
        [true, false].forEach(criteriaIsArray => {
          searchViewModel['filters$'].next([
            getTestFilter(
              'firstFilter',
              140,
              undefined,
              false,
              criteriaIsArray
            ),
            getTestFilter('secondFilter', 3484, 38, false, criteriaIsArray)
          ]);
          searchViewModel.updateResult(
            getTestSearchResult('someOtherName', new Map()) // searchResult without predictions
          );

          expect(searchViewModel.searchFilters$).toBeObservable(
            hot('(ab)', {
              a: [], // initial value
              b: [
                getTestFilter('firstFilter', 140, null, false, criteriaIsArray),
                getTestFilter('secondFilter', 3484, 38, false, criteriaIsArray)
              ]
            })
          );
        });
      }
    );
    it('should not change null values to 0 and also not change 0 values if no new predictions where given', () => {
      [true, false].forEach(criteriaIsArray => {
        searchViewModel['filters$'].next([
          getTestFilter('firstFilter', 140, null, false, criteriaIsArray),
          getTestFilter('secondFilter', 140, 0, false, criteriaIsArray),
          getTestFilter('thirdFilter', 3484, 38, false, criteriaIsArray)
        ]);
        searchViewModel.updateResult(
          getTestSearchResult('someOtherName', new Map()) // searchResult without predictions
        );
        expect(searchViewModel.searchFilters$).toBeObservable(
          hot('(ab)', {
            a: [], // initial value
            b: [
              getTestFilter('firstFilter', 140, null, false, criteriaIsArray),
              getTestFilter('secondFilter', 140, 0, false, criteriaIsArray),
              getTestFilter('thirdFilter', 3484, 38, false, criteriaIsArray)
            ]
          })
        );
      });
    });
    it('should update selections and predictions for all criteria, including children', () => {
      [true, false].forEach(criteriaIsArray => {
        const initFilters = [
          getTestFilter(
            'shouldNotBeChanged',
            0,
            1,
            false,
            criteriaIsArray,
            getTestFilterCriteria('shouldAlsoNotChange', 1999, 1, false)
          ),
          getTestFilter(
            'onlyChildShouldChange',
            0,
            1,
            false,
            criteriaIsArray,
            getTestFilterCriteria('updatingFilter', 1999, 1, false)
          ),
          getTestFilter('updatingFilter', 122, 39, false, criteriaIsArray),
          getTestFilter('updatingFilter', 140, 40, false, criteriaIsArray),
          getTestFilter('updatingFilter', 3048, 3380, false, criteriaIsArray),
          getTestFilter(
            'nonUpdatingFilter',
            3048,
            3380,
            false,
            criteriaIsArray
          ),
          getTestFilter('nonUpdatingFilter', 140, 40, false, criteriaIsArray)
        ];
        const expectedFilters = [
          getTestFilter(
            'shouldNotBeChanged',
            0,
            1,
            false,
            criteriaIsArray,
            getTestFilterCriteria('shouldAlsoNotChange', 1999, 1, false)
          ),
          getTestFilter(
            'onlyChildShouldChange',
            0,
            1,
            false,
            criteriaIsArray,
            getTestFilterCriteria('updatingFilter', 1999, 1, true) // false to true
          ),
          getTestFilter('updatingFilter', 122, 30, false, criteriaIsArray), //39 to 30
          getTestFilter('updatingFilter', 140, 40, true, criteriaIsArray), //false to true
          getTestFilter('updatingFilter', 3048, 390, true, criteriaIsArray), //3380 to 390 and false to true
          getTestFilter(
            'nonUpdatingFilter',
            3048,
            3380,
            false,
            criteriaIsArray
          ),
          getTestFilter('nonUpdatingFilter', 140, 40, false, criteriaIsArray)
        ];
        const searchResults = getTestSearchResult(
          'updatingFilter',
          new Map([[122, 30], [3048, 390]])
        );
        const searchState = getTestSearchState('updatingFilter', [
          140,
          1999,
          3048
        ]);
        searchViewModel.updateResult(searchResults);
        searchViewModel.searchState$.next(searchState);
        searchViewModel['filters$'].next(initFilters);
        expect(searchViewModel.searchFilters$).toBeObservable(
          hot('(ab)', {
            a: [], // initial value
            b: expectedFilters
          })
        );
      });
    });
  });
});

function getTestSearchResult(
  name: string,
  predictions: Map<string | number, number>
): SearchResultInterface {
  return {
    count: 0,
    results: [],
    filterCriteriaPredictions: new Map<string, Map<string | number, number>>([
      [name, new Map<string | number, number>(predictions)]
    ])
  };
}

function getTestSearchState(
  name: string,
  selections: (number | string)[]
): SearchStateInterface {
  return {
    searchTerm: '',
    filterCriteriaSelections: new Map<string, (number | string)[]>([
      [name, selections]
    ])
  };
}

function getTestFilter(
  name: string,
  id: string | number,
  prediction: number,
  selected: boolean,
  criteriaIsArray: boolean,
  child?: SearchFilterCriteriaInterface
) {
  return {
    criteria: criteriaIsArray
      ? [getTestFilterCriteria(name, id, prediction, selected, child)]
      : getTestFilterCriteria(name, id, prediction, selected, child),
    component: CheckboxLineFilterComponent,
    domHost: 'hostleft'
  };
}

function getTestFilterCriteria(
  name: string,
  id: string | number,
  prediction: number,
  selected: boolean,
  child?: SearchFilterCriteriaInterface
): SearchFilterCriteriaInterface {
  return new SearchFilterCriteriaFixture({ name: name }, [
    new SearchFilterCriteriaValuesFixture(
      {
        data: { id: id },
        prediction: prediction,
        selected: selected
      },
      child
    ),
    new SearchFilterCriteriaValuesFixture({})
  ]);
}
