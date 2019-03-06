import { ComponentPortal, DomPortalHost } from '@angular/cdk/portal';
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
  SimpleChanges
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import {
  SearchFilterComponentInterface,
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

  @Input() public searchMode: SearchModeInterface;
  @Input() public autoComplete: string[];
  @Input() public initialState: SearchStateInterface;
  @Input() public searchResults: SearchResultInterface;

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
    this.createFilters();
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
    const portalHost = this.getPortalHost(filter.domHost);
    if (!portalHost || !portalHost.host) {
      return;
    }
    // create component
    const portal = new ComponentPortal(filter.component);

    // attach filter
    const componentRef = portalHost.host.attachComponentPortal(portal);
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
        // exclude element from change detection
        this.appRef.detachView(componentRef.hostView);

        // remove element from html
        componentRef.destroy();
      });
    });
  }

  private getPortalHost(
    selector: string,
    componentFactoryResolver: ComponentFactoryResolver = this
      .componentFactoryResolver,
    appRef: ApplicationRef = this.appRef,
    injector: Injector = this.injector
  ): {
    host: DomPortalHost;
    filters: ComponentRef<SearchFilterComponentInterface>[];
  } {
    // check if already created
    if (this.filterPortalHosts[selector]) {
      return this.filterPortalHosts[selector];
    }

    //TODO  e2e test, see https://github.com/diekeure/campus/issues/206
    const el = document.querySelector(selector);
    if (el === null) {
      return null;
    }

    const portalHost = new DomPortalHost(
      el,
      componentFactoryResolver,
      appRef,
      injector
    );
    this.filterPortalHosts[selector] = { host: portalHost, filters: [] };

    return this.filterPortalHosts[selector];
  }
}
