import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  DebugElement,
  NgModule,
  QueryList,
  SimpleChange,
  Type,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { ComponentFactoryResolver } from '@angular/core/src/render3';
import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import { MatIconRegistry } from '@angular/material';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockMatIconRegistry } from '@campus/testing';
import { UiModule } from '@campus/ui';
import { hot } from 'jasmine-marbles';
import { BehaviorSubject } from 'rxjs';
import {
  SearchFilterCriteriaFixture,
  SearchFilterCriteriaValuesFixture,
  SearchPortalDirective
} from '../../..';
import {
  SearchFilterFactory,
  SearchFilterInterface,
  SearchModeInterface,
  SearchResultInterface,
  SearchStateInterface
} from '../../interfaces';
import { SearchModule } from '../../search.module';
import { BreadcrumbFilterComponent } from '../breadcrumb-filter/breadcrumb-filter.component';
import { CheckboxLineFilterComponent } from '../checkbox-line-filter/checkbox-line-filter-component';
import { CheckboxListFilterComponent } from '../checkbox-list-filter/checkbox-list-filter.component';
import { ColumnFilterComponent } from '../column-filter/column-filter.component';
import { ColumnFilterService } from '../column-filter/column-filter.service';
import { ResultItemBase } from '../results-list/result.component.base';
import { ResultsListComponent } from '../results-list/results-list.component';
import { SelectFilterComponent } from '../select-filter-component/select-filter.component';
import { SortModeInterface } from './../../interfaces/search-mode-interface';
import { SearchTermComponent } from './../search-term/search-term.component';
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

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'test-container',
  template: `
    <div><div searchPortal="hosttop"></div></div>
    <div><div searchPortal="hostleft"></div></div>
    <div searchPortal="mockHost"></div>
    <campus-search></campus-search>
  `
})
export class TestContainerComponent implements AfterViewInit {
  @ViewChildren(SearchPortalDirective)
  private portalHosts: QueryList<SearchPortalDirective>;

  @ViewChild(SearchComponent) private searchComponent: SearchComponent;

  ngAfterViewInit() {
    this.searchComponent.searchPortals = this.portalHosts;
  }
}

@NgModule({
  declarations: [TestContainerComponent],
  imports: [CommonModule, UiModule, SearchModule, NoopAnimationsModule],
  exports: [TestContainerComponent],
  providers: [ColumnFilterService]
})
export class TestModule {}

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
      searchTerm: {
        domHost: 'mockHost'
      },
      results: {
        component: ResultItemComponent,
        sortModes: [mockSortMode],
        pageSize: 10
      }
    };
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
      declarations: [ResultItemComponent],
      providers: [
        { provide: SearchViewModel, useClass: MockSearchViewModel },
        { provide: MatIconRegistry, useClass: MockMatIconRegistry },
        { provide: ColumnFilterService, useValue: {} },
        { provide: ComponentFactoryResolver, useValue: {} }
      ]
    }).overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [
          ResultItemComponent,
          CheckboxLineFilterComponent,
          CheckboxListFilterComponent,
          BreadcrumbFilterComponent,
          ColumnFilterComponent,
          SelectFilterComponent,
          SearchTermComponent
        ]
      }
    });
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
      expect(searchViewmodel.reset).toHaveBeenCalledWith(
        mockSearchMode,
        component.initialState
      );

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
        results: [{ id: 1 }, { id: 2 }],
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
        results: [{ id: 1 }, { id: 2 }, { id: 3 }],
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

  describe('searchTermComponent in portal', () => {
    let hostFixture: ComponentFixture<TestContainerComponent>;
    let hostComponent: TestContainerComponent;
    let searchComponent: SearchComponent;

    describe('should create', () => {
      // creating a host component with a portal component
      beforeEach(() => {
        hostFixture = TestBed.createComponent(TestContainerComponent);
        hostComponent = hostFixture.componentInstance;

        searchComponent = hostFixture.debugElement.query(
          By.directive(SearchComponent)
        ).componentInstance;

        searchComponent.initialState = mockSearchState;
        searchComponent.searchMode = mockSearchMode;

        hostFixture.detectChanges();
      });

      it('should be defined', () => {
        expect(hostComponent).toBeDefined();
        expect(searchComponent).toBeDefined();
      });

      it('should create a searchTermComponent and add it to the specified portalHost', () => {
        // does the portalHost exist and does the searchComponent have a reference to it?
        expect(searchComponent.searchPortals.length).toBe(3);

        const searchPortal = searchComponent.searchPortals.find(
          portal => portal.searchPortal === mockSearchMode.searchTerm.domHost
        ).viewContainerRef;

        expect(searchPortal).toBeTruthy();

        // does the portalHost have an inner view?
        expect(searchPortal.length).toBe(1);

        // is there a SearchTermComponent?
        const searchTermComponentDE = hostFixture.debugElement.query(
          By.directive(SearchTermComponent)
        );

        expect(searchTermComponentDE.componentInstance).toBeTruthy();

        // is the SearchTermComponent in the portalHost?
        // it is appended to the DOM as a sibling to the host
        expect(searchPortal.element.nativeElement.nextSibling).toBe(
          searchTermComponentDE.nativeElement
        );

        // just to be sure
        // if I clear the portalHost's views,
        // then the searchTermComponent should be gone
        searchPortal.clear();

        const detachedSearchTermComponentDE = hostFixture.debugElement.query(
          By.directive(SearchTermComponent)
        );

        expect(detachedSearchTermComponentDE).toBeNull();
      });

      it('should subscribe to the valueChange event of the searchTermComponent', () => {
        const mockInput =
          'de kans dat deze string at random is ingevoerd, is nogal klein';

        const searchTermComponent = hostFixture.debugElement.query(
          By.directive(SearchTermComponent)
        ).componentInstance;

        searchComponent.onSearchTermChange = jest.fn();

        searchTermComponent.valueChange.next(mockInput);

        expect(searchComponent.onSearchTermChange).toHaveBeenCalled();
        expect(searchComponent.onSearchTermChange).toHaveBeenCalledWith(
          mockInput
        );
      });

      it('should call the changeSearchTerm method on the viewmodel', () => {
        const mockInput =
          'de kans dat deze string at random is ingevoerd, is nogal klein';

        searchViewmodel.changeSearchTerm = jest.fn();

        component.onSearchTermChange(mockInput);

        expect(searchViewmodel.changeSearchTerm).toHaveBeenCalled();
        expect(searchViewmodel.changeSearchTerm).toHaveBeenCalledWith(
          mockInput
        );
      });

      it(
        'should subscribe to the valueChangeForAutoComplete event of the searchTermComponent' +
          'and debounce the events',
        fakeAsync(() => {
          const mockInput =
            'de kans dat deze string at random is ingevoerd, is nogal klein';

          const searchTermComponent = hostFixture.debugElement.query(
            By.directive(SearchTermComponent)
          ).componentInstance;

          searchComponent.onSearchTermChangeForAutoComplete = jest.fn();

          searchTermComponent.valueChangeForAutoComplete.next(mockInput);

          // before debounce
          expect(
            searchComponent.onSearchTermChangeForAutoComplete
          ).not.toHaveBeenCalled();

          tick(component.autoCompleteDebounceTime);

          // after debounce
          expect(
            searchComponent.onSearchTermChangeForAutoComplete
          ).toHaveBeenCalled();
          expect(
            searchComponent.onSearchTermChangeForAutoComplete
          ).toHaveBeenCalledWith(mockInput);
        })
      );

      it('should emit the new value for AutoCompleteValues', () => {
        const mockInput =
          'de kans dat deze string at random is ingevoerd, is nogal klein';

        component.searchTermChangeForAutoComplete.emit = jest.fn();

        component.onSearchTermChangeForAutoComplete(mockInput);

        expect(
          component.searchTermChangeForAutoComplete.emit
        ).toHaveBeenCalled();
        expect(
          component.searchTermChangeForAutoComplete.emit
        ).toHaveBeenCalledWith(mockInput);
      });

      it('should update the autoCompleteValues of the searchTermComponent', () => {
        const newAutoCompleteValues = ['new1', 'new2'];

        // this does not trigger ngOnChanges
        searchComponent.autoCompleteValues = newAutoCompleteValues;
        // ... doing it manually
        searchComponent.ngOnChanges({
          autoCompleteValues: new SimpleChange(
            null,
            newAutoCompleteValues,
            false
          )
        });

        hostFixture.detectChanges();

        const searchTermComponent = hostFixture.debugElement.query(
          By.directive(SearchTermComponent)
        ).componentInstance;

        expect(searchTermComponent.autoCompleteValues).toBe(
          newAutoCompleteValues
        );
      });
    });

    describe('should not create', () => {
      beforeEach(() => {
        hostFixture = TestBed.createComponent(TestContainerComponent);
        hostComponent = hostFixture.componentInstance;

        searchComponent = hostFixture.debugElement.query(
          By.directive(SearchComponent)
        ).componentInstance;
      });

      it('because the searchMode is missing searchTerm', () => {
        const newSearchMode = { ...mockSearchMode, searchTerm: null };
        searchComponent.initialState = mockSearchState;
        searchComponent.searchMode = newSearchMode;

        hostFixture.detectChanges();

        const searchTermComponent = hostFixture.debugElement.query(
          By.directive(SearchTermComponent)
        );

        expect(searchTermComponent).toBeFalsy();
      });

      it("because specified domHost doesn't exist ", () => {
        const newSearchMode = {
          ...mockSearchMode,
          searchTerm: { domHost: 'bestaat niet' }
        };
        searchComponent.initialState = mockSearchState;
        searchComponent.searchMode = newSearchMode;

        expect(() => {
          hostFixture.detectChanges();
        }).toThrowError(
          `Portal ${
            newSearchMode.searchTerm.domHost
          } not found! Did you add a 'searchPortal="${
            newSearchMode.searchTerm.domHost
          }"' to the page?'`
        );

        const searchTermComponent = hostFixture.debugElement.query(
          By.directive(SearchTermComponent)
        );

        expect(searchTermComponent).toBeFalsy();
      });
    });
  });

  describe('searchFilters', () => {
    let hostFixture: ComponentFixture<TestContainerComponent>;
    let hostComponent: TestContainerComponent;
    let searchComponent: SearchComponent;
    let checkboxLineComponent: DebugElement;
    let checkboxListComponent: DebugElement;
    let breadcrumbFilterComponent: DebugElement;
    let columnFilterComponent: DebugElement;
    let selectFilterComponent: DebugElement;
    let searchFilterComponents: DebugElement[];

    beforeEach(() => {
      hostFixture = TestBed.createComponent(TestContainerComponent);
      hostComponent = hostFixture.componentInstance;

      searchComponent = hostFixture.debugElement.query(
        By.directive(SearchComponent)
      ).componentInstance;

      searchComponent.initialState = mockSearchState;
      searchComponent.searchMode = mockSearchMode;

      hostFixture.detectChanges();

      checkboxLineComponent = getFilterElement(CheckboxLineFilterComponent);
      checkboxListComponent = getFilterElement(CheckboxListFilterComponent);
      breadcrumbFilterComponent = getFilterElement(BreadcrumbFilterComponent);
      columnFilterComponent = getFilterElement(ColumnFilterComponent);
      selectFilterComponent = getFilterElement(SelectFilterComponent);

      searchFilterComponents = [
        checkboxLineComponent,
        checkboxListComponent,
        breadcrumbFilterComponent,
        columnFilterComponent,
        selectFilterComponent
      ];
    });

    it('should create and add all search filter components', () => {
      expect(hostComponent).toBeDefined();
      searchFilterComponents.forEach(componentDE => {
        expect(componentDE.componentInstance).toBeDefined();
      });
    });

    it('should add component to the correct host element', () => {
      const hosttop = getPortalContainer('hosttop');
      const hostleft = getPortalContainer('hostleft');

      // items are attached as siblings of the portal element, therefore we check if they have the same parent
      expect(checkboxLineComponent.parent.nativeElement).toBe(hostleft);
      expect(checkboxListComponent.parent.nativeElement).toBe(hostleft);
      expect(columnFilterComponent.parent.nativeElement).toBe(hostleft);

      expect(breadcrumbFilterComponent.parent.nativeElement).toBe(hosttop);
      expect(selectFilterComponent.parent.nativeElement).toBe(hosttop);
    });

    it('should set the filterCriteria', () => {
      const filterCriteria = (searchViewmodel.searchFilters$ as BehaviorSubject<
        SearchFilterInterface[]
      >).value;
      searchFilterComponents.forEach((componentDE, i) => {
        expect(componentDE.componentInstance.filterCriteria).toBe(
          filterCriteria[i].criteria
        );
      });
    });

    it('should set the maxVisibleItems', () => {
      const searchFilters = (searchViewmodel.searchFilters$ as BehaviorSubject<
        SearchFilterInterface[]
      >).value;
      searchFilterComponents.forEach((componentDE, i) => {
        if (
          searchFilters[i].options &&
          searchFilters[i].options.maxVisibleItems
        ) {
          expect(componentDE.componentInstance.maxVisibleItems).toBe(
            searchFilters[i].options.maxVisibleItems
          );
          expect(componentDE.name).toBe('campus-checkbox-list-filter');
        } else
          expect(componentDE.componentInstance.maxVisibleItems).toBeFalsy();
      });
    });

    it('should subscribe to the filterSelectionChange', () => {
      const mockData = 'foo bar baz';
      searchComponent.onFilterSelectionChange = jest.fn();
      checkboxLineComponent.componentInstance.filterSelectionChange.next(
        mockData
      );

      expect(searchComponent.onFilterSelectionChange).toHaveBeenCalledTimes(1);
      expect(searchComponent.onFilterSelectionChange).toHaveBeenCalledWith(
        mockData
      );
    });

    it('should call the vm.changeFilters when filters onFilterSelectionChange', () => {
      const filterCriteria = new SearchFilterCriteriaFixture();
      searchViewmodel.changeFilters = jest.fn();
      searchComponent.onFilterSelectionChange(filterCriteria);
      expect(searchViewmodel.changeFilters).toHaveBeenCalledTimes(1);
      expect(searchViewmodel.changeFilters).toHaveBeenCalledWith(
        filterCriteria
      );
    });

    it('should replace the filters when new filters are recieved', () => {
      const hosttop = getPortalContainer('hosttop');
      const hostleft = getPortalContainer('hostleft');
      // verify that our test starts with different numbers
      expect(hosttop.children.length).toBe(3);
      expect(hostleft.children.length).toBe(4);

      const filters = [
        {
          criteria: new SearchFilterCriteriaFixture({}, [
            new SearchFilterCriteriaValuesFixture(),
            new SearchFilterCriteriaValuesFixture({
              data: { id: 2, name: 'foo' }
            }),
            new SearchFilterCriteriaValuesFixture({
              data: { id: 3, name: 'foo bar' }
            })
          ]),
          component: CheckboxLineFilterComponent,
          domHost: 'hostleft'
        },
        {
          criteria: new SearchFilterCriteriaFixture({}, [
            new SearchFilterCriteriaValuesFixture(),
            new SearchFilterCriteriaValuesFixture({
              data: { id: 2, name: 'foo' }
            }),
            new SearchFilterCriteriaValuesFixture({
              data: { id: 3, name: 'foo bar' }
            })
          ]),
          component: CheckboxLineFilterComponent,
          domHost: 'hosttop'
        }
      ];

      jest.spyOn(searchComponent as any, 'removeFilters');

      (searchViewmodel.searchFilters$ as BehaviorSubject<
        SearchFilterInterface[]
      >).next(filters);
      fixture.detectChanges();

      // should only contain host element and the new filter
      expect(searchComponent['removeFilters']).toHaveBeenCalledTimes(1);
      expect(searchComponent['removeFilters']).toHaveBeenCalledWith(filters);
      expect(hosttop.children.length).toBe(2);
      expect(hostleft.children.length).toBe(2);
    });

    it('should clean up on destroy', () => {
      searchComponent['removeFilters'] = jest.fn();
      searchComponent['subscriptions'].unsubscribe = jest.fn();

      searchComponent.ngOnDestroy();

      expect(searchComponent['removeFilters']).toHaveBeenCalledTimes(1);
      expect(
        searchComponent['subscriptions'].unsubscribe
      ).toHaveBeenCalledTimes(1);
    });

    it('should throw error when target portal is not found', () => {
      const filter = { domHost: 'iDontExist' } as SearchFilterInterface;
      const expectedError = `Portal ${
        filter.domHost
      } not found! Did you add a 'searchPortal="${
        filter.domHost
      }"' to the page?'`;
      expect(() => searchComponent['addSearchFilter'](filter)).toThrow(
        expectedError
      );
    });

    function getFilterElement(componentDirective: any): DebugElement {
      return hostFixture.debugElement.query(By.directive(componentDirective));
    }

    function getPortalContainer(domHost: string): DebugElement {
      return searchComponent.searchPortals.find(
        host => host.searchPortal === domHost
      ).viewContainerRef.element.nativeElement.parentNode;
    }
  });
});
