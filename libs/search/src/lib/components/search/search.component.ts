import { Component, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { SearchModeInterface } from './../../interfaces/search-mode-interface';
import { SearchResultInterface } from './../../interfaces/search-result-interface';
import { SearchStateInterface } from './../../interfaces/search-state.interface';
import { SearchViewModel } from './../search.viewmodel';

@Component({
  selector: 'campus-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  @Input() public searchMode: SearchModeInterface;
  @Input() public autoComplete: string[];
  @Input() public initialState: SearchStateInterface;
  @Input() public searchResults: SearchResultInterface;

  @Output() public searchState: Observable<SearchStateInterface>;

  constructor(private searchViewmodel: SearchViewModel) {}

  ngOnInit() {
    this.searchState = this.searchViewmodel.searchState$;
  }

  public reset(): void {}
  public onSort(): void {}
  public onFilterSelectionChange(): void {}
  public onSearchTermChange(): void {}
  public onScroll(): void {}
}
