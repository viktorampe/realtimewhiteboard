import { ComponentPortal, DomPortalHost } from '@angular/cdk/portal';
import {
  ApplicationRef,
  Component,
  ComponentFactoryResolver,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { Observable } from 'rxjs';
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
  private portalhosts: DomPortalHost[] = [];

  @Input() public searchMode: SearchModeInterface;
  @Input() public autoComplete: string[];
  @Input() public initialState: SearchStateInterface;
  @Input() public searchResults: SearchResultInterface;

  @Output() public searchState$: Observable<SearchStateInterface>;

  constructor(
    private searchViewmodel: SearchViewModel,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef
  ) {
    this.searchState$ = this.searchViewmodel.searchState$;
  }

  ngOnInit() {
    this.reset(this.initialState);
    this.createSearchTermComponent(this.searchMode);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.searchResults) {
      this.searchViewmodel.updateResult(this.searchResults);
    }
  }

  ngOnDestroy(): void {
    this.portalhosts.forEach(host => host.detach());
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

  private createSearchTermComponent(searchMode: SearchModeInterface): void {
    if (!searchMode.searchTerm) return;

    // needed to avoid
    setTimeout(() => {
      const portalContent = new ComponentPortal(SearchTermComponent);
      const portalHost = this.getPortalHost(searchMode.searchTerm.domHost);

      if (portalHost !== null) {
        if (!this.portalhosts.includes(portalHost)) {
          this.portalhosts.push(portalHost);
        }

        portalHost.attach(portalContent);
      }
    });
  }

  private getPortalHost(
    selector: string,
    componentFactoryResolver: ComponentFactoryResolver = this
      .componentFactoryResolver,
    appRef: ApplicationRef = this.appRef,
    injector: Injector = this.injector
  ): DomPortalHost {
    //TODO  e2e test, see https://github.com/diekeure/campus/issues/206

    const element = document.querySelector(selector);
    if (element === null) return null;
    return new DomPortalHost(
      element,
      componentFactoryResolver,
      appRef,
      injector
    );
  }
}
