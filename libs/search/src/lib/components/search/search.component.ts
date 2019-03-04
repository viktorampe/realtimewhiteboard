import {
  Component,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { Observable } from 'rxjs';
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
export class SearchComponent implements OnInit, OnChanges {
  @Input() public searchMode: SearchModeInterface;
  @Input() public autoComplete: string[];
  @Input() public initialState: SearchStateInterface;
  @Input() public searchResults: SearchResultInterface;

  @Output() public searchState: Observable<SearchStateInterface>;

  constructor(private searchViewmodel: SearchViewModel) {}

  ngOnInit() {
    this.searchState = this.searchViewmodel.searchState$;
    this.reset(this.initialState);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    if (changes.searchResults) {
      this.searchViewmodel.updateResult(this.searchResults);
    }
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
}
