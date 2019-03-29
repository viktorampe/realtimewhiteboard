import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  SearchComponent,
  SearchModeInterface,
  SearchResultInterface,
  SearchStateInterface
} from '@campus/search';
import { Observable } from 'rxjs';
import { EduContentsViewModel } from '../edu-contents.viewmodel';

@Component({
  selector: 'campus-edu-contents-search-by-term',
  templateUrl: './edu-contents-search-by-term.component.html',
  styleUrls: ['./edu-contents-search-by-term.component.scss']
})
export class EduContentSearchByTermComponent implements OnInit {
  public searchMode: SearchModeInterface;
  public searchState$: Observable<SearchStateInterface>;
  public searchResults$: Observable<SearchResultInterface>;
  public autoCompleteValues$: Observable<string[]>;

  @ViewChild(SearchComponent) public searchComponent: SearchComponent;

  constructor(
    private eduContentsViewModel: EduContentsViewModel,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.searchMode = this.eduContentsViewModel.getSearchMode(
      this.activatedRoute.snapshot.routeConfig.path,
      +this.activatedRoute.snapshot.params.area
    );
    this.searchState$ = this.eduContentsViewModel.getInitialSearchState();
    this.searchResults$ = this.eduContentsViewModel.searchResults$;
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
      this.searchComponent.reset();
    }
  }
}
