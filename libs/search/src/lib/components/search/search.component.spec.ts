import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatBadgeModule,
  MatCheckboxModule,
  MatIconModule,
  MatIconRegistry,
  MatListModule,
  MatSelectModule
} from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { MockMatIconRegistry } from '@campus/testing';
import { UiModule } from '@campus/ui';
import { hot } from 'jasmine-marbles';
import { SearchModeInterface, SearchStateInterface } from '../../interfaces';
import { BreadcrumbFilterComponent } from '../breadcrumb-filter/breadcrumb-filter.component';
import { CheckboxLineFilterComponent } from '../checkbox-line-filter/checkbox-line-filter-component';
import { CheckboxFilterComponent } from '../checkbox-list-filter/checkbox-filter/checkbox-filter.component';
import { CheckboxListFilterComponent } from '../checkbox-list-filter/checkbox-list-filter.component';
import { ColumnFilterComponent } from '../column-filter/column-filter.component';
import { ResultItemBase } from '../results-list/result.component.base';
import { SelectFilterComponent } from '../select-filter-component/select-filter.component';
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
      searchFilterFactory: null,
      results: {
        component: ResultItemComponent,
        sortModes: [],
        pageSize: 10
      }
    };
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatCheckboxModule,
        UiModule,
        MatIconModule,
        MatListModule,
        MatSelectModule,
        MatBadgeModule,
        ReactiveFormsModule
      ],
      declarations: [
        SearchComponent,
        ResultItemComponent,
        CheckboxFilterComponent,
        CheckboxLineFilterComponent,
        CheckboxListFilterComponent,
        BreadcrumbFilterComponent,
        ColumnFilterComponent,
        SelectFilterComponent
      ],
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

        expect(component.searchState).toBeObservable(
          hot('a', { a: mockSearchState })
        );
      });
    });
  });
});
