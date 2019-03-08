import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  DebugElement,
  NgModule,
  SimpleChange,
  Type,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconRegistry } from '@angular/material';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LearningAreaFixture } from '@campus/dal';
import { MockMatIconRegistry } from '@campus/testing';
import { UiModule } from '@campus/ui';
import { hot } from 'jasmine-marbles';
import {
  SearchFilterCriteriaFixture,
  SearchFilterCriteriaValuesFixture
} from '../../+fixtures/search-filter-criteria.fixture';
import { SearchPortalDirective } from '../../directives';
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
  private portalHosts;

  @ViewChild(SearchComponent) private searchComponent: SearchComponent;

  ngAfterViewInit() {
    this.searchComponent.portalHosts = this.portalHosts;
  }
}

@NgModule({
  declarations: [TestContainerComponent],
  imports: [CommonModule, UiModule, SearchModule, NoopAnimationsModule],
  exports: [TestContainerComponent]
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

  describe('seachFilters', () => {
    let hostFixture: ComponentFixture<TestContainerComponent>;
    let hostComponent: TestContainerComponent;
    let searchComponent: SearchComponent;
    let checkboxLineComponent: DebugElement;
    let checkboxListComponent: DebugElement;
    let breadcrumbFilterComponent: DebugElement;
    let columnFilterComponent: DebugElement;
    let selectFilterComponent: DebugElement;

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
    });

    it('should create and add all search filter components', () => {
      expect(hostComponent).toBeDefined();
      expect(checkboxLineComponent.componentInstance).toBeDefined();
      expect(checkboxListComponent.componentInstance).toBeDefined();
      expect(breadcrumbFilterComponent.componentInstance).toBeDefined();
      expect(columnFilterComponent.componentInstance).toBeDefined();
      expect(selectFilterComponent.componentInstance).toBeDefined();
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
      const filterCriteria = searchViewmodel.searchFilters$.value;

      expect(checkboxLineComponent.componentInstance.filterCriteria).toBe(
        filterCriteria[0].criteria
      );
      expect(checkboxListComponent.componentInstance.filterCriteria).toBe(
        filterCriteria[1].criteria
      );
      expect(breadcrumbFilterComponent.componentInstance.filterCriteria).toBe(
        filterCriteria[2].criteria
      );
      expect(columnFilterComponent.componentInstance.filterCriteria).toBe(
        filterCriteria[3].criteria
      );
      expect(selectFilterComponent.componentInstance.filterCriteria).toBe(
        filterCriteria[4].criteria
      );
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

      searchViewmodel.searchFilters$.next(filters);
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
      const expectedError = `portalhost ${
        filter.domHost
      } not found! Did you add a 'searchPortal="${
        filter.domHost
      }"' to the page?'`;
      expect(() => searchComponent['addFilter'](filter)).toThrow(expectedError);
    });

    function getFilterElement(componentDirective: any): DebugElement {
      return hostFixture.debugElement.query(By.directive(componentDirective));
    }

    function getPortalContainer(domHost: string): DebugElement {
      return searchComponent.portalHosts.find(
        host => host.searchPortal === domHost
      ).viewContainerRef.element.nativeElement.parentNode;
    }
  });
});
