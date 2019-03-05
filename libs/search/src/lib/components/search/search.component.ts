import { ComponentPortal, DomPortalHost } from '@angular/cdk/portal';
import {
  ApplicationRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  EmbeddedViewRef,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
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
  private portalHosts: { [key: string]: DomPortalHost } = {};
  private domHosts: { [key: string]: Element } = {};

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
          this.addFilterToPage(filter);
        });
      })
    );
  }

  private addFilterToPage(filter: SearchFilterInterface): void {
    // 0. Get DOM element where to append component
    const targetEl =
      this.domHosts[filter.domHost] || document.querySelector(filter.domHost);
    if (!this.domHosts[filter.domHost]) {
      if (!targetEl) {
        return;
      }
      // cache DOM element
      this.domHosts[filter.domHost] = targetEl;
    }

    // 1. Create a component reference from the component
    const componentRef = this.componentFactoryResolver
      .resolveComponentFactory(filter.component)
      .create(this.injector);
    if (!componentRef) {
      return;
    }

    const filterItem: SearchFilterComponentInterface = componentRef.instance;
    filterItem.filterCriteria = filter.criteria;
    filterItem.filterSelectionChange
      .pipe(take(1))
      .subscribe((criteria: SearchFilterCriteriaInterface) => {
        this.searchViewmodel.changeFilters(criteria);
      });

    // 2. Attach component to the appRef so that it's inside the ng component tree
    this.appRef.attachView(componentRef.hostView);

    // 3. Get DOM element from component
    const domElem = (componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;

    // 4. Append component DOM element to the page
    targetEl.appendChild(domElem);
  }

  private removeFilterComponent(
    componentRef: ComponentRef<SearchFilterInterface>
  ) {
    // 1. Detach the view from the ApplicationRef so that no change detection will be performed by Angular.
    this.appRef.detachView(componentRef.hostView);
    // 2. Destroy the Component Ref. This will automatically remove the DOM element from the document.
    componentRef.destroy();
  }

  private addFilter(filter: SearchFilterInterface): void {
    // find portal host
    const portalHost = this.getPortalHost(filter.domHost);
    if (!portalHost) {
      return;
    }
    const portal = new ComponentPortal(filter.component);

    const filterItem = portalHost.attach(portal)
      .instance as SearchFilterComponentInterface;

    filterItem.filterCriteria = filter.criteria;
    filterItem.filterSelectionChange
      .pipe(take(1))
      .subscribe((criteria: SearchFilterCriteriaInterface) => {
        this.searchViewmodel.changeFilters(criteria);
      });
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
