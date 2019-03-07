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
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnChanges, OnDestroy {
  // private portalhosts: DomPortalHost[] = [];
  // private portals = [];
  private subscriptions = new Subscription();

  @Input() public searchMode: SearchModeInterface;
  @Input() public autoComplete: string[];
  @Input() public initialState: SearchStateInterface;
  @Input() public searchResults: SearchResultInterface;

  @Output() public searchState$: Observable<SearchStateInterface>;

  private _portalHosts: QueryList<ViewContainerRef>;
  public get portalHosts(): QueryList<ViewContainerRef> {
    return this._portalHosts;
  }

  @Input()
  public set portalHosts(value: QueryList<ViewContainerRef>) {
    this._portalHosts = value;

    // this.createComponent(this._portalHosts.first);
    this.createSearchTermComponent(
      this.searchMode,
      this.initialState,
      this._portalHosts
    );
  }

  constructor(
    private searchViewmodel: SearchViewModel,
    private componentFactoryResolver: ComponentFactoryResolver // private injector: Injector, // private appRef: ApplicationRef, // private viewContainerRef: ViewContainerRef
  ) {
    this.searchState$ = this.searchViewmodel.searchState$;
  }

  ngOnInit() {
    this.reset(this.initialState);
    // this.createSearchTermComponent(this.searchMode, this.initialState);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.searchResults) {
      this.searchViewmodel.updateResult(this.searchResults);
    }
  }

  ngOnDestroy(): void {
    // this.portalhosts.forEach(host => host.detach());
    // this.portalhosts = [];
    this.portalHosts.forEach(host => host.clear());
    this.subscriptions.unsubscribe();
  }

  public reset(initialState: SearchStateInterface = null): void {
    this.searchViewmodel.reset(this.searchMode, initialState);
  }

  public onSort(event: SortModeInterface): void {
    this.searchViewmodel.changeSort(event);
  }

  public onFilterSelectionChange(): void {}
  public onSearchTermChange(searchTerm: string): void {
    console.log(searchTerm);
  }
  public onScroll(): void {
    this.searchViewmodel.getNextPage();
  }

  private createSearchTermComponent(
    searchMode: SearchModeInterface,
    searchState: SearchStateInterface,
    portalHosts: QueryList<ViewContainerRef>
  ): void {
    if (!searchMode.searchTerm || !searchState.searchTerm) return;

    // const portalContent = new ComponentPortal(
    //   SearchTermComponent,
    //   this.viewContainerRef
    // );
    // const portalHost = this.getPortalHost(searchMode.searchTerm.domHost);

    // if (portalHost !== null) {
    //   if (!this.portalhosts.includes(portalHost)) {
    //     this.portalhosts.push(portalHost);
    //   }

    //   const componentRef = portalHost.attachComponentPortal(portalContent);
    //   const searchTermComponent = componentRef.instance;
    //   this.portals.push(searchTermComponent);

    const viewContainerRef = portalHosts.find(
      host => host.element.nativeElement.id === searchMode.searchTerm.domHost
    );

    if (!viewContainerRef) {
      throw new Error(
        `specified host '${searchMode.searchTerm.domHost}' not found`
      );
    }

    const componentRef = viewContainerRef.createComponent(
      this.componentFactoryResolver.resolveComponentFactory(SearchTermComponent)
    );

    const searchTermComponent = componentRef.instance;

    searchTermComponent.initialValue = searchState.searchTerm;
    searchTermComponent.autoComplete = !!(
      this.autoComplete && this.autoComplete.length
    );
    searchTermComponent.autoCompleteValues = this.autoComplete;

    // needed to avoid ExpressionChangedAfterItHasBeenCheckedError
    componentRef.changeDetectorRef.detectChanges();

    this.subscriptions.add(
      searchTermComponent.valueChange.subscribe(value =>
        this.onSearchTermChange(value)
      )
    );

    console.log('end create', searchTermComponent, viewContainerRef);
  }
}

// private getPortalHost(
//   selector: string,
//   componentFactoryResolver: ComponentFactoryResolver = this
//     .componentFactoryResolver,
//   appRef: ApplicationRef = this.appRef,
//   injector: Injector = this.injector
// ): DomPortalHost {
//   //TODO  e2e test, see https://github.com/diekeure/campus/issues/206

//   const element = document.querySelector(selector);
//   if (element === null) return null;
//   return new DomPortalHost(
//     element,
//     componentFactoryResolver,
//     appRef,
//     injector
//   );
// }

// private createComponent(viewContainerRef: ViewContainerRef) {
//   const componentRef = viewContainerRef.createComponent(
//     this.componentFactoryResolver.resolveComponentFactory(SearchTermComponent)
//   );

//   componentRef.changeDetectorRef.detectChanges();
// }
