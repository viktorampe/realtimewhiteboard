import { TestBed } from '@angular/core/testing';
import { LearningAreaFixture } from '@campus/dal';
import { hot } from '@nrwl/nx/testing';
import {
  SearchFilterCriteriaInterface,
  SearchModeInterface,
  SearchStateInterface,
  SortModeInterface
} from '../interfaces';
import { SearchViewModel } from './search.viewmodel';

class MockClass {
  constructor() {}
}
describe('SearchViewModel', () => {
  let searchViewModel: SearchViewModel;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SearchViewModel]
    });

    searchViewModel = TestBed.get(SearchViewModel);
  });

  it('should be defined', () => {
    expect(searchViewModel).toBeDefined();
  });

  describe('changeFilters', () => {
    beforeEach(() => {
      const searchState: SearchStateInterface = {
        from: 10,
        filterCriteriaSelections: new Map([['foo', [3]], ['bar', [4, 5, 6]]])
      } as SearchStateInterface;
      searchViewModel.searchState$.next(searchState);
    });

    it('should update `searchFilterCriteria` and reset `from` in searchState', () => {
      const searchFilterCriteria: SearchFilterCriteriaInterface = {
        name: 'foo',
        label: 'foo',
        keyProperty: 'id',
        displayProperty: 'name',
        values: [
          {
            data: new LearningAreaFixture({ id: 1, name: 'wiskunde' }),
            selected: true,
            visible: true,
            child: null
          },
          {
            data: new LearningAreaFixture({ id: 2, name: 'geschiedenis' }),
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
            data: new LearningAreaFixture({ id: 1, name: 'wiskunde' }),
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
            data: new LearningAreaFixture({ id: 2, name: 'geschiedenis' }),
            selected: true,
            visible: true,
            child: null
          },
          {
            data: new LearningAreaFixture({ id: 3, name: 'aardrijkskunde' }),
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
            data: new LearningAreaFixture({ id: 1, name: 'wiskunde' }),
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
            data: new LearningAreaFixture({ id: 1, name: 'wiskunde' }),
            selected: true,
            visible: true,
            child: null
          },
          {
            data: new LearningAreaFixture({ id: 3, name: 'aardrijkskunde' }),
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
      const oldValue = searchViewModel.searchState$.value;
      searchViewModel.changeSort(mockSortMode);

      const expected = oldValue;
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
    beforeEach(() => {
      const mockSelections = new Map<string, string[]>();
      mockSelections.set('foo', ['bar', 'baz']);

      const mockSearchState: SearchStateInterface = {
        searchTerm: 'foo',
        from: 30,
        filterCriteriaSelections: mockSelections
      };

      // set initial state
      searchViewModel.searchState$.next(mockSearchState);
    });

    it('should update the state', () => {
      searchViewModel.reset(
        <SearchModeInterface>{
          name: 'foo',
          searchFilterFactory: MockClass
        },
        <SearchStateInterface>{ searchTerm: 'bar', from: 60 }
      );

      expect(searchViewModel.searchState$).toBeObservable(
        hot('a', { a: { searchTerm: 'bar', from: 60 } })
      );
    });

    it('should reset the state', () => {
      searchViewModel.reset(
        <SearchModeInterface>{
          name: 'foo',
          searchFilterFactory: MockClass
        },
        null
      );

      expect(searchViewModel.searchState$).toBeObservable(
        hot('a', {
          a: {
            searchTerm: '',
            filterCriteriaSelections: new Map<string, string[]>(),
            from: 0
          }
        })
      );
    });
  });
});
