import { TestBed } from '@angular/core/testing';
import { SortModeInterface } from '../interfaces';
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

    it('should replace the searchState', () => {
      const origSearchStateRef = searchViewModel['searchState'];

      searchViewModel.changeSort(mockSortMode);

      const newSearchStateRef = searchViewModel['searchState'];

      expect(newSearchStateRef).not.toBe(origSearchStateRef);
    });

    it('should trigger an emit the new searchState', () => {
      searchViewModel.searchState$.next = jest.fn();

      searchViewModel.changeSort(mockSortMode);

      const newSearchStateRef = searchViewModel['searchState'];
      expect(searchViewModel.searchState$.next).toHaveBeenCalled();
      expect(searchViewModel.searchState$.next).toHaveBeenCalledWith(
        newSearchStateRef
      );
    });
  });
});
