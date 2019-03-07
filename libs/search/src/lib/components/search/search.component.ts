import { DomPortalHost } from '@angular/cdk/portal';
import {
  ApplicationRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewContainerRef
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { SearchPortalDirective } from '../../directives';
import {
  SearchFilterCriteriaInterface,
  SearchFilterInterface
} from '../../interfaces';
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
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy, OnChanges {
  private subscriptions = new Subscription();
  private filterSubscriptions = new Subscription();
  private filterPortalHosts: {
    [key: string]: {
      host: DomPortalHost;
      filters: ComponentRef<any>[];
    };
  } = {};
  private _portalHosts: QueryList<SearchPortalDirective>;
  private portalHostsMap: {
    [key: string]: {
      host: ViewContainerRef;
      filters: ComponentRef<any>[];
    };
  } = {};

  @Input() public searchMode: SearchModeInterface;
  @Input() public autoComplete: string[];
  @Input() public initialState: SearchStateInterface;
  @Input() public searchResults: SearchResultInterface;
  @Input()
  set portalHosts(portalHosts: QueryList<SearchPortalDirective>) {
    if (portalHosts) {
      portalHosts.forEach(portalHost => {
        this.portalHostsMap[portalHost.searchPortal] = {
          host: portalHost.viewContainerRef,
          filters: []
        };
      });
      this.createFilters();
    }
  }
  get portalHosts() {
    return this._portalHosts;
  }

  @Output() public searchState$: Observable<SearchStateInterface>;

  constructor(
    private searchViewmodel: SearchViewModel,
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {
    this.searchState$ = this.searchViewmodel.searchState$;
  }

  ngOnInit() {
    this.reset(this.initialState);
  }

  ngOnDestroy() {
    // remove filters
    this.removeFilters();

    // detach portalhost
    Object.values(this.filterPortalHosts).forEach(portalHost =>
      portalHost.host.detach()
    );

    // clean up subscriptions
    this.subscriptions.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.searchResults) {
      this.searchViewmodel.updateResult(this.searchResults);
    }
  }

  public reset(initialState: SearchStateInterface = null): void {
    this.searchViewmodel.reset(this.searchMode, initialState);
  }

  public onSort(event: SortModeInterface): void {
    this.searchViewmodel.changeSort(event);
  }

  public onFilterSelectionChange(): void {}
  public onSearchTermChange(): void {}
  public onScroll(): void {
    this.searchViewmodel.getNextPage();
  }

  private createFilters(): void {
    this.subscriptions.add(
      this.searchViewmodel.searchFilters$.subscribe(searchFilters => {
        // remove old filters
        this.removeFilters();

        // add updated filters
        searchFilters.forEach(filter => this.addFilter(filter));
      })
    );
  }

  private addFilter(filter: SearchFilterInterface): void {
    const portalHost = this.portalHostsMap[filter.domHost];
    if (!portalHost) {
      throw new Error(
        'portalhost ' +
          filter.domHost +
          ' not found! Did you add a `searchPortal="' +
          filter.domHost +
          '"` to the page?'
      );
    }

    const componentRef = portalHost.host.createComponent(
      this.componentFactoryResolver.resolveComponentFactory(filter.component)
    );
    portalHost.filters.push(componentRef);

    // set inputs
    const filterItem = componentRef.instance;
    filterItem.filterCriteria = filter.criteria;

    // subscribe to outputs
    this.filterSubscriptions.add(
      filterItem.filterSelectionChange.subscribe(
        (criteria: SearchFilterCriteriaInterface) => {
          this.searchViewmodel.changeFilters(criteria);
        }
      )
    );

    // solve "Expression has changed after it was checked" error
    componentRef.changeDetectorRef.detectChanges();
  }

  private removeFilters(): void {
    // close subscriptions
    this.filterSubscriptions.unsubscribe();

    // remove filters from portals
    Object.values(this.filterPortalHosts).forEach(portalHost => {
      portalHost.filters.forEach(componentRef => {
        // remove element from html
        componentRef.destroy();
      });
    });
  }
}
