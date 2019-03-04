import { TestBed } from '@angular/core/testing';
import { hot } from '@nrwl/nx/testing';
import {
  SearchModeInterface,
  SearchStateInterface,
  SortModeInterface
} from '../interfaces';
import { SearchViewModel } from './search.viewmodel';

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
      expected.from = null;

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
});
