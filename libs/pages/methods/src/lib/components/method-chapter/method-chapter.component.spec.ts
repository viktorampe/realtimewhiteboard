import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import {
  ResultItemMockComponent,
  SearchComponent,
  SearchStateInterface,
  SearchTestModule
} from '@campus/search';
import { UiModule } from '@campus/ui';
import { configureTestSuite } from 'ng-bullet';
import { MethodViewModel } from './../method.viewmodel';
import { MockMethodViewModel } from './../method.viewmodel.mock';
import { MethodChapterComponent } from './method-chapter.component';

describe('MethodChapterComponent', () => {
  let component: MethodChapterComponent;
  let fixture: ComponentFixture<MethodChapterComponent>;
  let searchComponent;
  let methodViewModel;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [SearchTestModule, UiModule],
      declarations: [MethodChapterComponent],
      providers: [{ provide: MethodViewModel, useClass: MockMethodViewModel }]
    }).overrideModule(BrowserDynamicTestingModule, {
      set: { entryComponents: [ResultItemMockComponent] }
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MethodChapterComponent);
    component = fixture.componentInstance;
    searchComponent = TestBed.get(SearchComponent);
    methodViewModel = TestBed.get(MethodViewModel);
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
      jest.spyOn(methodViewModel, 'requestAutoComplete');

      component.onAutoCompleteRequest('foo');

      expect(methodViewModel.requestAutoComplete).toHaveBeenCalledTimes(1);
      expect(methodViewModel.requestAutoComplete).toHaveBeenCalledWith('foo');
    });

    it('should send searchstate to viewmodel on change', () => {
      jest.spyOn(methodViewModel, 'updateState');

      component.onSearchStateChange(mockSearchState);

      expect(methodViewModel.updateState).toHaveBeenCalledTimes(1);
      expect(methodViewModel.updateState).toHaveBeenCalledWith(mockSearchState);
    });
  });
});
