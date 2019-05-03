import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  Type,
  ViewContainerRef
} from '@angular/core';
import {
  SearchFilterComponentInterface,
  SearchFilterCriteriaInterface,
  SearchFilterInterface
} from '@campus/search';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, skipWhile, take } from 'rxjs/operators';
import { SearchPortalDirective } from '../../directives';
import { ColumnFilterService } from '../column-filter/column-filter.service';
import { SearchTermComponent } from '../search-term/search-term.component';
import { SearchViewModel } from '../search.viewmodel';
import {
  SearchModeInterface,
  SortModeInterface
} from './../../interfaces/search-mode-interface';
import { SearchResultInterface } from './../../interfaces/search-result-interface';
import { SearchStateInterface } from './../../interfaces/search-state.interface';

@Component({
  selector: 'campus-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  providers: [SearchViewModel, ColumnFilterService]
})
export class SearchComponent
  implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  private searchTermComponent: SearchTermComponent;
  private subscriptions = new Subscription();
  private _searchPortals: QueryList<SearchPortalDirective> = new QueryList();
  private portalsMap: {
    [key: string]: {
      host: ViewContainerRef;
      subscriptions: Subscription;
    };
  } = {};

  @Input() public searchMode: SearchModeInterface;
  @Input() public autoCompleteValues: string[];
  @Input() public autoCompleteDebounceTime = 300;
  @Input() public initialState: SearchStateInterface;
  @Input() public searchResults: SearchResultInterface;
  @Input() public autoFocusSearchTerm = false;
  @Input()
  public set searchPortals(searchPortals: QueryList<SearchPortalDirective>) {
    if (searchPortals) {
      this._searchPortals = searchPortals;
      searchPortals.forEach(portalHost => {
        this.portalsMap[portalHost.searchPortal] = {
          host: portalHost.viewContainerRef,
          subscriptions: new Subscription()
        };
      });
      this.createFilters();

      if (this.searchMode.searchTerm) {
        this.createSearchTermComponent();
      }
    }
  }
  public get searchPortals() {
    return this._searchPortals;
  }

  @Output() public searchState$: Observable<SearchStateInterface>;
  @Output() public searchTermChangeForAutoComplete = new EventEmitter<string>();

  constructor(
    private searchViewmodel: SearchViewModel,
    private componentFactoryResolver: ComponentFactoryResolver,
    private columnFilterService: ColumnFilterService
  ) {
    this.searchState$ = this.searchViewmodel.searchState$.pipe(
      skipWhile(searchState => !searchState) // first emit from viewmodel is null
    );
  }

  ngOnInit() {
    this.reset(this.initialState);
  }

  ngAfterViewInit() {
    this.warnMissingSearchPortals();
  }

  ngOnDestroy() {
    // remove filters
    this.removeFilters();

    // clean up subscriptions
    this.subscriptions.unsubscribe();

    // reset filter-specific services
    this.columnFilterService.reset();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.searchResults) {
      this.searchViewmodel.updateResult(this.searchResults);
    }
    if (changes.autoCompleteValues && this.searchTermComponent) {
      this.searchTermComponent.autoCompleteValues = this.autoCompleteValues;
    }
  }

  public reset(
    initialState: SearchStateInterface = this.initialState,
    clearSearchTerm?: boolean
  ): void {
    if (clearSearchTerm) {
      initialState.searchTerm = undefined;
      this.searchTermComponent.currentValue = undefined;
    }
    this.searchViewmodel.reset(this.searchMode, {
      ...initialState,
      filterCriteriaSelections: new Map(initialState.filterCriteriaSelections)
    });
  }

  public onSort(event: SortModeInterface): void {
    this.searchViewmodel.changeSort(event);
  }

  public onFilterSelectionChange(
    criteria: SearchFilterCriteriaInterface | SearchFilterCriteriaInterface[]
  ): void {
    this.searchViewmodel.changeFilters(criteria);
  }

  public onSearchTermChange(value: string): void {
    this.searchViewmodel.changeSearchTerm(value);
  }

  public onSearchTermChangeForAutoComplete(value: string): void {
    this.searchTermChangeForAutoComplete.emit(value);
  }

  public onScroll(): void {
    this.searchViewmodel.getNextPage();
  }

  // Creates a SearchTermComponent and appends it to the DOM
  // as a sibling to the domHost (as defined by the SearchMode)
  // Note: the SearchTermComponent must not by added to
  // the same domHost as the FilterComponent
  private createSearchTermComponent(): void {
    const componentRef = this.addComponent(
      this.searchMode.searchTerm.domHost,
      SearchTermComponent
    );

    this.searchTermComponent = componentRef.instance;

    this.searchTermComponent.initialValue = this.initialState.searchTerm;
    this.searchTermComponent.autoCompleteValues = this.autoCompleteValues;
    this.searchTermComponent.autofocus = this.autoFocusSearchTerm;

    // needed to avoid ExpressionChangedAfterItHasBeenCheckedError
    componentRef.changeDetectorRef.detectChanges();

    // listen for valueChange -> new search
    this.subscriptions.add(
      this.searchTermComponent.valueChange.subscribe(value =>
        this.onSearchTermChange(value)
      )
    );

    // listen for valueChangeForAutoComplete -> new autoComplete results
    this.subscriptions.add(
      this.searchTermComponent.valueChangeForAutoComplete
        .pipe(debounceTime(this.autoCompleteDebounceTime))
        .subscribe(value => this.onSearchTermChangeForAutoComplete(value))
    );
  }

  private createFilters(): void {
    this.subscriptions.add(
      this.searchViewmodel.searchFilters$.subscribe(searchFilters => {
        // remove old filters
        this.removeFilters(searchFilters);

        // add updated filters
        searchFilters.forEach(filter => this.addSearchFilter(filter));
      })
    );
  }

  private addSearchFilter(filter: SearchFilterInterface): void {
    const componentRef = this.addComponent<SearchFilterComponentInterface>(
      filter.domHost,
      filter.component
    );

    // set inputs
    const filterItem = componentRef.instance;
    filterItem.filterCriteria = filter.criteria;
    if (filter.options) filterItem.filterOptions = filter.options;

    // subscribe to outputs
    this.portalsMap[filter.domHost].subscriptions.add(
      filterItem.filterSelectionChange.subscribe(
        (
          criteria:
            | SearchFilterCriteriaInterface
            | SearchFilterCriteriaInterface[]
        ): void => {
          this.onFilterSelectionChange(criteria);
        }
      )
    );

    // solve "Expression has changed after it was checked" error
    componentRef.changeDetectorRef.detectChanges();
  }

  private removeFilters(filters?: SearchFilterInterface[]): void {
    let portals = [];
    if (filters) {
      portals = filters.map(filter => this.portalsMap[filter.domHost]);
      portals = Array.from(new Set(portals)); // only reset each host once
    } else {
      portals = Object.values(this.portalsMap);
    }

    portals.forEach(portal => {
      // close subscriptions
      portal.subscriptions.unsubscribe();
      portal.subscriptions = new Subscription();

      // remove filters from portals
      portal.host.clear();
    });
  }

  private addComponent<T>(
    domHost: string,
    component: Type<T>
  ): ComponentRef<T> {
    const portalHost = this.portalsMap[domHost];
    if (!portalHost) {
      throw new Error(
        `Portal ${domHost} not found! Did you add a 'searchPortal="${domHost}"' to the page?'`
      );
    }

    const componentRef = portalHost.host.createComponent(
      this.componentFactoryResolver.resolveComponentFactory(component)
    );

    return componentRef;
  }

  private warnMissingSearchPortals(): void {
    this.searchViewmodel.searchFilters$
      .pipe(
        skipWhile(filters => !filters.length),
        take(1)
      )
      .subscribe(() => {
        if (!this.searchPortals.length) {
          console.warn('The searchportals are not set');
        }
      });
  }
}
interface HostCollectionInterface {
  [key: string]: {
    host: ViewContainerRef;
    subscriptions: Subscription;
  };
}
