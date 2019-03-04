import { TestBed } from '@angular/core/testing';
import { LearningAreaFixture } from '@campus/dal';
import { hot } from '@nrwl/nx/testing';
import {
  SearchFilterCriteriaInterface,
  SearchModeInterface,
  SearchStateInterface
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

    it('should not request new filters when dynamicfilters !== true', () => {
      searchViewModel['searchMode'] = {
        dynamicFilters: false
      } as SearchModeInterface;
      const spy = jest.spyOn(searchViewModel as any, 'getFilters');
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
      const spy = jest.spyOn(searchViewModel as any, 'getFilters');
      searchViewModel.changeFilters({
        values: []
      } as SearchFilterCriteriaInterface);
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
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
