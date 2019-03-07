import { Component, SimpleChange, Type } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconRegistry } from '@angular/material';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { LearningAreaFixture } from '@campus/dal';
import { MockMatIconRegistry } from '@campus/testing';
import { hot } from 'jasmine-marbles';
import {
  SearchFilterFactory,
  SearchModeInterface,
  SearchResultInterface,
  SearchStateInterface
} from '../../interfaces';
import { SearchModule } from '../../search.module';
import { BreadcrumbFilterComponent } from '../breadcrumb-filter/breadcrumb-filter.component';
import { CheckboxLineFilterComponent } from '../checkbox-line-filter/checkbox-line-filter-component';
import { CheckboxListFilterComponent } from '../checkbox-list-filter/checkbox-list-filter.component';
import { ColumnFilterComponent } from '../column-filter/column-filter.component';
import { ResultItemBase } from '../results-list/result.component.base';
import { ResultsListComponent } from '../results-list/results-list.component';
import { SelectFilterComponent } from '../select-filter-component/select-filter.component';
import { SortModeInterface } from './../../interfaces/search-mode-interface';
import { SearchViewModel } from './../search.viewmodel';
import { MockSearchViewModel } from './../search.viewmodel.mock';
import { SearchComponent } from './search.component';

@Component({
  selector: 'campus-result-item',
  template: '{{data}}'
})
class ResultItemComponent extends ResultItemBase {
  data: any;
  listRef: null;
}

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let searchViewmodel: SearchViewModel;
  let resultList: ResultsListComponent;

  let mockSearchState: SearchStateInterface;
  let mockSearchMode: SearchModeInterface;
  let mockSortMode: SortModeInterface;

  beforeAll(() => {
    mockSearchState = {
      searchTerm: 'nemo',
      filterCriteriaSelections: new Map<string, string[]>()
    };

    mockSortMode = {
      name: 'foo',
      description: 'bar',
      icon: 'icon'
    };

    mockSearchMode = {
      name: 'mock',
      label: 'mockSearchMode',
      dynamicFilters: false,
      searchFilterFactory: {} as Type<SearchFilterFactory>,

      results: {
        component: ResultItemComponent,
        sortModes: [mockSortMode],
        pageSize: 10
      }
    };
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SearchModule],
      declarations: [ResultItemComponent],
      providers: [
        { provide: SearchViewModel, useClass: MockSearchViewModel },
        { provide: MatIconRegistry, useClass: MockMatIconRegistry }
      ]
    })
      .overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [
            ResultItemComponent,
            CheckboxLineFilterComponent,
            CheckboxListFilterComponent,
            BreadcrumbFilterComponent,
            ColumnFilterComponent,
            SelectFilterComponent
          ]
        }
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;

    searchViewmodel = TestBed.get(SearchViewModel);
    component.initialState = mockSearchState;
    component.searchMode = mockSearchMode;

    resultList = fixture.debugElement.query(By.directive(ResultsListComponent))
      .componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('reset()', () => {
    it('should call the reset method on the viewmodel', () => {
      searchViewmodel.reset = jest.fn();

      component.reset();

      expect(searchViewmodel.reset).toHaveBeenCalled();
      expect(searchViewmodel.reset).toHaveBeenCalledWith(mockSearchMode, null);

      jest.resetAllMocks();

      component.reset(mockSearchState);

      expect(searchViewmodel.reset).toHaveBeenCalled();
      expect(searchViewmodel.reset).toHaveBeenCalledWith(
        mockSearchMode,
        mockSearchState
      );
    });

    it('should call reset with the initial state on init', () => {
      component.reset = jest.fn();

      component.ngOnInit();
      expect(component.reset).toHaveBeenCalled();
      expect(component.reset).toHaveBeenCalledWith(component.initialState);
    });
    describe('searchState', () => {
      it('should emit the viewmodel searchState$ value', () => {
        searchViewmodel.searchState$.next(mockSearchState);

        expect(component.searchState$).toBeObservable(
          hot('a', { a: mockSearchState })
        );
      });
    });
  });

  describe('events from ResultsListComponent', () => {
    describe('sort', () => {
      it('should call changeSort() on the viewmodel', () => {
        searchViewmodel.changeSort = jest.fn();

        const newSortMode = { ...mockSortMode, name: 'new name' };

        resultList.sortBy.emit(newSortMode);

        expect(searchViewmodel.changeSort).toHaveBeenCalled();
        expect(searchViewmodel.changeSort).toHaveBeenCalledWith(newSortMode);
      });
    });
    describe('scroll', () => {
      it('should call getNextPage() on the viewmodel', () => {
        searchViewmodel.getNextPage = jest.fn();

        resultList.getNextPage.emit();

        expect(searchViewmodel.getNextPage).toHaveBeenCalled();
      });
    });
  });

  describe('searchResults', () => {
    let mockSearchResults: SearchResultInterface;

    beforeEach(() => {
      mockSearchResults = {
        count: 2,
        results: [
          new LearningAreaFixture({ id: 1 }),
          new LearningAreaFixture({ id: 2 })
        ],
        filterCriteriaPredictions: new Map([
          ['LearningArea', new Map([[1, 100], [2, 50]])]
        ])
      };
    });

    it('should pass the searchResults to the viewmodel', () => {
      searchViewmodel.updateResult = jest.fn();

      // this does not trigger ngOnChanges
      component.searchResults = mockSearchResults;
      // ... doing it manually
      component.ngOnChanges({
        searchResults: new SimpleChange(null, mockSearchResults, false)
      });

      fixture.detectChanges();

      expect(searchViewmodel.updateResult).toHaveBeenCalled();
      expect(searchViewmodel.updateResult).toHaveBeenCalledWith(
        mockSearchResults
      );
    });

    it('set the searchResults on the ResultListComponent', () => {
      const setterSpy = jest.spyOn(resultList, 'resultsPage', 'set');

      const newSearchResults = {
        count: 3,
        results: [
          new LearningAreaFixture({ id: 1 }),
          new LearningAreaFixture({ id: 2 }),
          new LearningAreaFixture({ id: 3 })
        ],
        filterCriteriaPredictions: new Map([
          ['LearningArea', new Map([[1, 100], [2, 50], [3, 0]])]
        ])
      } as SearchResultInterface;

      component.searchResults = newSearchResults;

      fixture.detectChanges();

      // testing if the setter has been called,
      // the rest of the flow is the ResultListComponent's problem
      expect(setterSpy).toHaveBeenCalled();
      expect(setterSpy).toHaveBeenCalledWith(newSearchResults);
    });
  });
});
