import {
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  Input,
  OnChanges,
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
export class SearchComponent implements OnInit, OnChanges {
  private searchTermComponentFactory: ComponentFactory<SearchTermComponent>;

  @Input() public searchMode: SearchModeInterface;
  @Input() public autoComplete: string[];
  @Input() public initialState: SearchStateInterface;
  @Input() public searchResults: SearchResultInterface;

  @Output() public searchState$: Observable<SearchStateInterface>;

  constructor(
    private searchViewmodel: SearchViewModel,
    private componentFactoryResolver: ComponentFactoryResolver
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

    if (!this.searchTermComponentFactory) {
      this.searchTermComponentFactory = this.componentFactoryResolver.resolveComponentFactory(
        SearchTermComponent
      );
    }

    // const componentRef = this.resultListHost.viewContainerRef.createComponent(
    //   this.componentFactory
    // );
    // const resultItem = componentRef.instance as SearchResultItemComponentInterface;
    // resultItem.data = result;
    // resultItem.listRef = this.listview;
  }
}
