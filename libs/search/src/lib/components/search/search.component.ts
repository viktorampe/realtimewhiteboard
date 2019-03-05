import { ComponentPortal, DomPortalHost } from '@angular/cdk/portal';
import {
  ApplicationRef,
  Component,
  ComponentFactoryResolver,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import {
  SearchFilterComponentInterface,
  SearchFilterCriteriaInterface,
  SearchFilterInterface
} from '../../interfaces';
import { SearchModeInterface } from './../../interfaces/search-mode-interface';
import { SearchResultInterface } from './../../interfaces/search-result-interface';
import { SearchStateInterface } from './../../interfaces/search-state.interface';
import { SearchViewModel } from './../search.viewmodel';

@Component({
  selector: 'campus-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  private portalHosts: { [key: string]: DomPortalHost };

  @Input() public searchMode: SearchModeInterface;
  @Input() public autoComplete: string[];
  @Input() public initialState: SearchStateInterface;
  @Input() public searchResults: SearchResultInterface;

  @Output() public searchState: Observable<SearchStateInterface>;

  constructor(
    private searchViewmodel: SearchViewModel,
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {}

  ngOnInit() {
    this.searchState = this.searchViewmodel.searchState$;
    this.portalHosts = {};
    this.createFilters();
    this.reset(this.initialState);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    Object.values(this.portalHosts).forEach(portal => portal.detach());
  }

  public reset(initialState: SearchStateInterface = null): void {
    this.searchViewmodel.reset(this.searchMode, initialState);
  }
  public onSort(): void {}
  public onFilterSelectionChange(): void {}
  public onSearchTermChange(): void {}
  public onScroll(): void {}

  private createFilters(): void {
    this.subscriptions.add(
      this.searchViewmodel.searchFilters$.subscribe(searchFilters => {
        if (!searchFilters) {
          return;
        }
        searchFilters.forEach(filter => {
          const filterItem = this.addFilter(filter);

          filterItem.filterCriteria = filter.criteria;
          filterItem.filterSelectionChange.subscribe(
            (criteria: SearchFilterCriteriaInterface) => {
              this.searchViewmodel.changeFilters(criteria);
            }
          );
        });
      })
    );
  }

  private addFilter(
    filter: SearchFilterInterface
  ): SearchFilterComponentInterface {
    // find portal host
    const portalHost = this.getPortalHost(filter.domHost);
    if (!portalHost) {
      return;
    }
    const portal = new ComponentPortal(filter.component);

    return portalHost.attach(portal).instance as SearchFilterComponentInterface;
  }

  private getPortalHost(
    selector: string,
    componentFactoryResolver: ComponentFactoryResolver = this
      .componentFactoryResolver,
    appRef: ApplicationRef = this.appRef,
    injector: Injector = this.injector
  ): DomPortalHost {
    // check if already created
    if (this.portalHosts[selector]) {
      return this.portalHosts[selector];
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
    this.portalHosts[selector] = portalHost;

    return portalHost;
  }
}
