import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  SearchComponent,
  SearchModeInterface,
  SearchStateInterface
} from '@campus/search';
import { EduContentSearchResultInterface } from '@campus/shared';
import { Observable } from 'rxjs';
import { EduContentsViewModel } from '../edu-contents.viewmodel';

@Component({
  selector: 'campus-edu-contents-search-by-term',
  templateUrl: './edu-contents-search-by-term.component.html',
  styleUrls: ['./edu-contents-search-by-term.component.scss']
})
export class EduContentSearchByTermComponent {
  public searchMode: SearchModeInterface;
  public initialSearchState$: Observable<SearchStateInterface>;
  public searchState$: Observable<SearchStateInterface>;
  public searchResults$: Observable<EduContentSearchResultInterface[]>;
  public autoCompleteValues$: Observable<string[]>;

  @ViewChild(SearchComponent) public searchComponent: SearchComponent;

  constructor(
    private eduContentsViewModel: EduContentsViewModel,
    private activatedRoute: ActivatedRoute
  ) {
    this.initialize();
  }

  initialize(): void {
    this.searchMode = this.eduContentsViewModel.getSearchMode(
      this.activatedRoute.snapshot.routeConfig.path
    );
    this.initialSearchState$ = this.eduContentsViewModel.getInitialSearchState();
    this.searchState$ = this.eduContentsViewModel.searchState$;
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
}
