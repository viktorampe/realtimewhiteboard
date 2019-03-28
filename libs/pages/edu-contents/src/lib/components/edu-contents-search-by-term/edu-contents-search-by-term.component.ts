import { Component, OnInit, ViewChild } from '@angular/core';
import {
  SearchComponent,
  SearchModeInterface,
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

  @ViewChild(SearchComponent) private searchComponent: SearchComponent;

  constructor(private eduContentsViewModel: EduContentsViewModel) {}

  ngOnInit(): void {
    this.searchMode = this.eduContentsViewModel.getSearchMode('search');
    this.searchState$ = this.eduContentsViewModel.getInitialSearchState();
  }

  clearSearchFilters() {
    if (this.searchComponent) {
      this.searchComponent.reset();
    }
  }
}
