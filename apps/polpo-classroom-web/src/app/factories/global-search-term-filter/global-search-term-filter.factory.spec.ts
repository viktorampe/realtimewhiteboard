import { DalState, LearningAreaFixture } from '@campus/dal';
import { SearchStateInterface } from '@campus/search';
import { Store } from '@ngrx/store';
import { hot } from '@nrwl/nx/testing';
import { of } from 'rxjs';
import { GlobalSearchTermFilterFactory } from './global-search-term-filter.factory';
// file.only
describe('GlobalSearchTermFilterFactory', () => {
  let factory: GlobalSearchTermFilterFactory;
  let mockSelect = {
    1: new LearningAreaFixture({ id: 1, name: 'foo' }),
    2: new LearningAreaFixture({ id: 2, name: 'bar' }),
    3: new LearningAreaFixture({ id: 3, name: 'baz' })
  };

  const mockStore = { select: () => of(mockSelect) };
  const filterCriteriaSelections = new Map<string, (string | number)[]>();

  beforeEach(() => {
    factory = new GlobalSearchTermFilterFactory(mockStore as Store<DalState>);
  });

  describe('getFilter()', () => {
    it('should return the requested filters', () => {
      filterCriteriaSelections.set('learningArea', [1, 2]);

      const mockSearchState = {
        searchTerm: '',
        filterCriteriaSelections: filterCriteriaSelections
      } as SearchStateInterface;

      const requestedFilters = factory.getFilters(mockSearchState);

      const expected = hot('a', { a: '' });
      expect(requestedFilters).toBeObservable(expected);
    });
  });
});
