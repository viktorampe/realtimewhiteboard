import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { Subscription } from 'rxjs';
import { SearchModeInterface } from './../../interfaces/search-mode-interface';
import { SearchResultInterface } from './../../interfaces/search-result-interface';
import { SearchStateInterface } from './../../interfaces/search-state.interface';
import { SearchViewModel } from './../search.viewmodel';

@Component({
  selector: 'campus-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();

  @Input() public searchMode: SearchModeInterface;
  @Input() public autoComplete: string[];
  @Input() public initialState: SearchStateInterface;
  @Input() public searchResults: SearchResultInterface;

  @Output() public searchState = new EventEmitter<SearchStateInterface>();

  constructor(private searchViewmodel: SearchViewModel) {}

  ngOnInit() {
    this.setupSubscriptions();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public reset(): void {}
  public onSort(): void {}
  public onFilterSelectionChange(): void {}
  public onSearchTermChange(): void {}
  public onScroll(): void {}

  private setupSubscriptions(): void {
    this.subscriptions.add(
      this.searchViewmodel.searchState$.subscribe(searchState =>
        this.searchState.emit(searchState)
      )
    );
  }
}
