import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchModeInterface, SearchStateInterface } from '../../interfaces';
import { ResultItemBase } from '../results-list/result.component.base';
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

  let mockSearchState: SearchStateInterface;
  let mockSearchMode: SearchModeInterface;

  beforeAll(() => {
    mockSearchState = {
      searchTerm: 'nemo',
      filterCriteriaSelections: new Map<string, string[]>()
    };

    mockSearchMode = {
      name: 'mock',
      label: 'mockSearchMode',
      dynamicFilters: false,
      searchFilterFactory: [],

      results: {
        component: ResultItemComponent,
        sortModes: [],
        pageSize: 10
      }
    };
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchComponent],
      providers: [{ provide: SearchViewModel, useClass: MockSearchViewModel }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;

    searchViewmodel = TestBed.get(SearchViewModel);
    component.initialState = mockSearchState;
    component.searchMode = mockSearchMode;

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
      expect(searchViewmodel.reset).toHaveBeenCalledWith(null, mockSearchMode);

      jest.resetAllMocks();

      component.reset(mockSearchState);

      expect(searchViewmodel.reset).toHaveBeenCalled();
      expect(searchViewmodel.reset).toHaveBeenCalledWith(
        mockSearchState,
        mockSearchMode
      );
    });

    it('should call reset with the initial state on init', () => {
      component.reset = jest.fn();

      component.ngOnInit();
      expect(component.reset).toHaveBeenCalled();
      expect(component.reset).toHaveBeenCalledWith(component.initialState);
    });
  });
});
