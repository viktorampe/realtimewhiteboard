import {
  AfterViewInit,
  Component,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {
  SearchComponent,
  SearchModeInterface,
  SearchPortalDirective,
  SearchResultInterface,
  SearchStateInterface
} from '@campus/search';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GlobalSearchViewModel } from '../global-search.viewmodel';

@Component({
  selector: 'campus-global-search',
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.scss']
})
export class GlobalSearchComponent implements OnInit, AfterViewInit {
  public searchMode$: Observable<SearchModeInterface>;
  public initialSearchState$: Observable<SearchStateInterface>;
  public searchResults$: Observable<SearchResultInterface>;
  public autoCompleteValues$: Observable<string[]>;

  @ViewChildren(SearchPortalDirective)
  private portalHosts: QueryList<SearchPortalDirective>;
  @ViewChild(SearchComponent) public searchComponent: SearchComponent;

  constructor(private globalSearchViewModel: GlobalSearchViewModel) {}

  ngOnInit() {
    this.searchMode$ = this.globalSearchViewModel.getSearchMode('global');
    this.initialSearchState$ = combineLatest([
      this.searchMode$,
      this.globalSearchViewModel.getInitialSearchState()
    ]).pipe(
      map(([searchMode, initialSearchState]) => {
        return {
          ...initialSearchState,
          sort: searchMode.results.sortModes[0].name
        };
      })
    );
    this.searchResults$ = this.globalSearchViewModel.searchResults$;
  }

  ngAfterViewInit() {
    this.searchComponent.searchPortals = this.portalHosts;
  }

  public onAutoCompleteRequest(term: string) {
    this.autoCompleteValues$ = this.globalSearchViewModel.requestAutoComplete(
      term
    );
  }

  public onSearchStateChange(searchState: SearchStateInterface): void {
    this.globalSearchViewModel.updateState(searchState);
  }

  public clearSearchFilters(): void {
    if (this.searchComponent) {
      this.searchComponent.reset(undefined, true);
    }
  }
}
