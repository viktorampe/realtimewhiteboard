import { TestBed } from '@angular/core/testing';
import { hot } from '@nrwl/nx/testing';
import { Observable, of } from 'rxjs';
import {
  SearchFilterFactory,
  SearchFilterInterface,
  SearchModeInterface,
  SearchStateInterface,
  SortModeInterface
} from '../interfaces';
import { SearchViewModel } from './search.viewmodel';

class MockClass implements SearchFilterFactory {
  getFilters(
    searchState: SearchStateInterface
  ): Observable<SearchFilterInterface[]> {
    return of();
  }
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
