import {
  AfterViewInit,
  Component,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { Router } from '@angular/router';
import {
  SearchComponent,
  SearchModeInterface,
  SearchPortalDirective,
  SearchResultInterface,
  SearchStateInterface
} from '@campus/search';
import { Observable } from 'rxjs';
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

  constructor(
    private globalSearchViewModel: GlobalSearchViewModel,
    private router: Router
  ) {}

  ngOnInit() {
    this.searchMode$ = this.globalSearchViewModel.getSearchMode('global');
    this.initialSearchState$ = this.globalSearchViewModel.getInitialSearchState();
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
      this.searchComponent.reset(undefined, false);
    }
  }

  public clickBackLink() {
    const urlParts = [];
    this.router.navigate(urlParts);
  }
}
