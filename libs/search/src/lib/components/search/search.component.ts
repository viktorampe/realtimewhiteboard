import {
  Component,
  ComponentFactoryResolver,
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
  private _portalHosts: QueryList<SearchPortalDirective> = new QueryList();
  private portalHostsMap: {
    [key: string]: {
      host: ViewContainerRef;
      subscriptions: Subscription;
    };
  } = {};

  @Input() public searchMode: SearchModeInterface;
  @Input() public autoComplete: string[];
  @Input() public initialState: SearchStateInterface;
  @Input() public searchResults: SearchResultInterface;
  @Input()
  public set portalHosts(portalHosts: QueryList<SearchPortalDirective>) {
    if (portalHosts) {
      this._portalHosts = portalHosts;
      portalHosts.forEach(portalHost => {
        this.portalHostsMap[portalHost.searchPortal] = {
          host: portalHost.viewContainerRef,
          subscriptions: new Subscription()
        };
      });
      this.createFilters();
    }
  }
  public get portalHosts() {
    return this._portalHosts;
  }

  @Output() public searchState$: Observable<SearchStateInterface>;

  constructor(
    private searchViewmodel: SearchViewModel,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
    this.searchState$ = this.searchViewmodel.searchState$;
  }

  ngOnInit() {
    this.reset(this.initialState);
  }

  ngOnDestroy() {
    // remove filters
    this.removeFilters();

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

  public onFilterSelectionChange(
    criteria: SearchFilterCriteriaInterface
  ): void {
    this.searchViewmodel.changeFilters(criteria);
  }
  public onSearchTermChange(): void {}
  public onScroll(): void {
    this.searchViewmodel.getNextPage();
  }

  private createFilters(): void {
    this.subscriptions.add(
      this.searchViewmodel.searchFilters$.subscribe(searchFilters => {
        // remove old filters
        this.removeFilters(searchFilters);

        // add updated filters
        searchFilters.forEach(filter => this.addFilter(filter));
      })
    );
  }

  private addFilter(filter: SearchFilterInterface): void {
    const portalHost = this.portalHostsMap[filter.domHost];
    if (!portalHost) {
      throw new Error(
        `portalhost ${filter.domHost} not found! Did you add a 'searchPortal="${
          filter.domHost
        }"' to the page?'`
      );
    }

    const componentRef = portalHost.host.createComponent(
      this.componentFactoryResolver.resolveComponentFactory(filter.component)
    );

    // set inputs
    const filterItem = componentRef.instance;
    filterItem.filterCriteria = filter.criteria;

    // subscribe to outputs
    portalHost.subscriptions.add(
      filterItem.filterSelectionChange.subscribe(
        (criteria: SearchFilterCriteriaInterface) => {
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
      portals = filters.map(filter => this.portalHostsMap[filter.domHost]);
      portals = Array.from(new Set(portals)); // only reset each host once
    } else {
      portals = Object.values(this.portalHostsMap);
    }

    portals.forEach(portal => {
      // close subscriptions
      portal.subscriptions.unsubscribe();
      portal.subscriptions = new Subscription();

      // remove filters from portals
      portal.host.clear();
    });
  }
}
