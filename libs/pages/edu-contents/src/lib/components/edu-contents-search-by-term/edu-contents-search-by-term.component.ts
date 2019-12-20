import {
  AfterViewInit,
  Component,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  SearchComponent,
  SearchModeInterface,
  SearchPortalDirective,
  SearchResultInterface,
  SearchStateInterface
} from '@campus/search';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { EduContentsViewModel } from '../edu-contents.viewmodel';

@Component({
  selector: 'campus-edu-contents-search-by-term',
  templateUrl: './edu-contents-search-by-term.component.html',
  styleUrls: ['./edu-contents-search-by-term.component.scss']
})
export class EduContentSearchByTermComponent implements OnInit, AfterViewInit {
  public searchMode: SearchModeInterface;
  public initialSearchState$: Observable<SearchStateInterface>;
  public searchResults$: Observable<SearchResultInterface>;
  public autoCompleteValues$: Observable<string[]>;
  public autoFocusSearchTerm: boolean;
  public currentLearningArea: number;

  @ViewChildren(SearchPortalDirective)
  private portalHosts: QueryList<SearchPortalDirective>;
  @ViewChild(SearchComponent, { static: true }) public searchComponent: SearchComponent;

  constructor(
    private eduContentsViewModel: EduContentsViewModel,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.searchMode = this.eduContentsViewModel.getSearchMode(
        this.activatedRoute.routeConfig.path,
        +params.area
      );
      this.currentLearningArea = +params.area;
    });

    this.initialSearchState$ = this.eduContentsViewModel.getInitialSearchState();
    this.initialSearchState$.pipe(take(1)).subscribe(state => {
      this.autoFocusSearchTerm = this.isSearchTermEmpty(state);
    });
    this.searchResults$ = this.eduContentsViewModel.searchResults$;
  }

  private isSearchTermEmpty(searchState: SearchStateInterface) {
    return searchState.searchTerm.length === 0;
  }

  ngAfterViewInit(): void {
    this.searchComponent.searchPortals = this.portalHosts;
  }

  onSearchStateChange(searchState: SearchStateInterface): void {
    this.eduContentsViewModel.updateState(searchState);
  }

  onAutoCompleteRequest(term: string) {
    this.autoCompleteValues$ = this.eduContentsViewModel.requestAutoComplete(
      term
    );
  }

  clearSearchFilters() {
    if (this.searchComponent) {
      this.searchComponent.reset(undefined, true);
    }
  }
}
