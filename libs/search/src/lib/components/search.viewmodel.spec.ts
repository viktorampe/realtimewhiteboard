import { TestBed } from '@angular/core/testing';
import { LearningAreaFixture } from '@campus/dal';
import { SearchStateInterface } from '../interfaces';
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

  describe('changeFilters', () => {
    beforeEach(() => {
      const searchState: SearchStateInterface = {
        searchTerm: '',
        filterCriteriaSelections: new Map([['foo', [3]], ['bar', [1, 2]]])
      };
      searchViewModel.searchState$.next(searchState);
    });

    fit('should update searchFilterCriteria', done => {
      const searchFilterCriteria = {
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

      searchViewModel.searchState$.subscribe(state => {
        expect(state.filterCriteriaSelections).toEqual(
          new Map([['foo', [1, 2]], ['bar', [1, 2]]])
        );
        done();
      });
    });
  });
});
