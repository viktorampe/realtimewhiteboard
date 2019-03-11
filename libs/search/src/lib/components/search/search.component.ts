import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
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
  private subscriptions = new Subscription();

  @Input() public searchMode: SearchModeInterface;
  @Input() public autoCompleteValues: string[];
  @Input() public initialState: SearchStateInterface;
  @Input() public searchResults: SearchResultInterface;

  @Output() public searchState$: Observable<SearchStateInterface>;

  private _portalHosts: QueryList<SearchPortalDirective>;
  private portalHostsMap: PortalHostDictionaryInterface = {};
  private searchTermComponent: SearchTermComponent;

  public get portalHosts(): QueryList<SearchPortalDirective> {
    return this._portalHosts;
  }

  @Input()
  public set portalHosts(portalHosts: QueryList<SearchPortalDirective>) {
    if (portalHosts) {
      portalHosts.forEach(portalHost => {
        this.portalHostsMap[portalHost.searchPortal] = {
          host: portalHost.viewContainerRef,
          filters: []
        };
      });
    }

    this._portalHosts = portalHosts;

    if (this.searchMode.searchTerm) {
      this.createSearchTermComponent(this.portalHostsMap);
    }
  }

  constructor(
    private searchViewmodel: SearchViewModel,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
    this.searchState$ = this.searchViewmodel.searchState$;
  }

  ngOnInit() {
    this.reset(this.initialState);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.searchResults) {
      this.searchViewmodel.updateResult(this.searchResults);
    }
    if (changes.autoCompleteValues && this.searchTermComponent) {
      // changing autoComplete value causes template change
      // this makes the input lose focus
      // I think we can safely assume that, once autoCompleteValues
      // have been passed, there will be more in the future.
      // once on -> stays on
      if (!this.searchTermComponent.autoComplete) {
        this.searchTermComponent.autoComplete =
          Array.isArray(this.autoCompleteValues) &&
          !!this.autoCompleteValues.length;
      }
      this.searchTermComponent.autoCompleteValues = this.autoCompleteValues;
    }
  }

  ngOnDestroy(): void {
    if (this.portalHosts)
      this.portalHosts.forEach(host => host.viewContainerRef.clear());
    this.subscriptions.unsubscribe();
  }

  public reset(initialState: SearchStateInterface = null): void {
    this.searchViewmodel.reset(this.searchMode, initialState);
  }

  public onSort(event: SortModeInterface): void {
    this.searchViewmodel.changeSort(event);
  }

  public onFilterSelectionChange(): void {}
  public onSearchTermChange(searchTerm: string): void {}
  public onScroll(): void {
    this.searchViewmodel.getNextPage();
  }

  // Creates a SearchTermComponent and appends it to the DOM
  // as a sibling to the portalHost (as defined by the SearchMode)
  private createSearchTermComponent(
    portalHostsMap: PortalHostDictionaryInterface
  ): void {
    const portalHost = portalHostsMap[this.searchMode.searchTerm.domHost];

    if (!portalHost) {
      throw new Error(
        `specified host '${this.searchMode.searchTerm.domHost}' not found`
      );
    }

    const componentRef = portalHost.host.createComponent(
      this.componentFactoryResolver.resolveComponentFactory(SearchTermComponent)
    );

    this.searchTermComponent = componentRef.instance;

    this.searchTermComponent.initialValue = this.initialState.searchTerm;
    this.searchTermComponent.autoComplete =
      Array.isArray(this.autoCompleteValues) &&
      !!this.autoCompleteValues.length;
    this.searchTermComponent.autoCompleteValues = this.autoCompleteValues;

    // needed to avoid ExpressionChangedAfterItHasBeenCheckedError
    componentRef.changeDetectorRef.detectChanges();

    this.subscriptions.add(
      this.searchTermComponent.valueChange.subscribe(value =>
        this.onSearchTermChange(value)
      )
    );
  }
}

interface PortalHostDictionaryInterface {
  [key: string]: {
    host: ViewContainerRef;
    filters: ComponentRef<any>[];
  };
}
