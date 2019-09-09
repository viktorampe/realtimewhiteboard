/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconRegistry } from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ResultItemMockComponent,
  SearchComponent,
  SearchStateInterface,
  SearchTestModule
} from '@campus/search';
import {
  ENVIRONMENT_ICON_MAPPING_TOKEN,
  ENVIRONMENT_SEARCHMODES_TOKEN,
  SharedModule
} from '@campus/shared';
import { MockMatIconRegistry, ViewModelInterface } from '@campus/testing';
import { UiModule } from '@campus/ui';
import { configureTestSuite } from 'ng-bullet';
import { GlobalSearchViewModel } from '../global-search.viewmodel';
import { MockGlobalSearchViewModel } from '../global-search.viewmodel.mock';
import { GlobalSearchComponent } from './global-search.component';

describe('GlobalSearchComponent', () => {
  let component: GlobalSearchComponent;
  let fixture: ComponentFixture<GlobalSearchComponent>;
  let searchComponent;
  let globalSearchViewModel: ViewModelInterface<GlobalSearchViewModel>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [GlobalSearchComponent],
      imports: [
        SearchTestModule,
        NoopAnimationsModule,
        UiModule,
        RouterTestingModule,
        SharedModule
      ],
      providers: [
        { provide: MatIconRegistry, useClass: MockMatIconRegistry },
        {
          provide: ENVIRONMENT_SEARCHMODES_TOKEN,
          useValue: {}
        },
        { provide: GlobalSearchViewModel, useClass: MockGlobalSearchViewModel },
        { provide: ENVIRONMENT_ICON_MAPPING_TOKEN, useValue: {} }
      ]
    }).overrideModule(BrowserDynamicTestingModule, {
      set: { entryComponents: [ResultItemMockComponent] }
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalSearchComponent);
    component = fixture.componentInstance;
    searchComponent = TestBed.get(SearchComponent);
    globalSearchViewModel = TestBed.get(GlobalSearchViewModel);
    component.searchComponent = searchComponent;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('search', () => {
    let mockSearchState;

    beforeEach(() => {
      mockSearchState = {
        searchTerm: 'breuken'
      } as SearchStateInterface;
    });

    it('should reset search filters when clearSearchFilters is called', () => {
      component.searchComponent.reset = jest.fn();
      component.clearSearchFilters();

      expect(component.searchComponent.reset).toHaveBeenCalledTimes(1);
    });

    it('should send searchText to viewmodel subject', () => {
      jest.spyOn(globalSearchViewModel, 'requestAutoComplete');

      component.onAutoCompleteRequest('foo');

      expect(globalSearchViewModel.requestAutoComplete).toHaveBeenCalledTimes(
        1
      );
      expect(globalSearchViewModel.requestAutoComplete).toHaveBeenCalledWith(
        'foo'
      );
    });

    it('should send searchstate to viewmodel on change', () => {
      jest.spyOn(globalSearchViewModel, 'updateState');

      component.onSearchStateChange(mockSearchState);

      expect(globalSearchViewModel.updateState).toHaveBeenCalledTimes(1);
      expect(globalSearchViewModel.updateState).toHaveBeenCalledWith(
        mockSearchState
      );
    });
  });
});
