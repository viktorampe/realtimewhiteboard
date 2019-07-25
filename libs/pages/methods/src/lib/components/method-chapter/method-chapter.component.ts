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
import { Observable } from 'rxjs';
import { MethodViewModel } from '../method.viewmodel';

@Component({
  selector: 'campus-method-chapter',
  templateUrl: './method-chapter.component.html',
  styleUrls: ['./method-chapter.component.scss']
})
export class MethodChapterComponent implements OnInit, AfterViewInit {
  public searchMode$: Observable<SearchModeInterface>;
  public initialSearchState$: Observable<SearchStateInterface>;
  public searchResults$: Observable<SearchResultInterface>;
  public autoCompleteValues$: Observable<string[]>;

  @ViewChildren(SearchPortalDirective)
  private portalHosts: QueryList<SearchPortalDirective>;
  @ViewChild(SearchComponent) public searchComponent: SearchComponent;

  constructor(private methodViewModel: MethodViewModel) {}

  ngOnInit() {
    this.searchMode$ = this.methodViewModel.getSearchMode('chapter-lesson');
    this.initialSearchState$ = this.methodViewModel.getInitialSearchState();
    this.searchResults$ = this.methodViewModel.searchResults$;
  }

  ngAfterViewInit() {
    this.searchComponent.searchPortals = this.portalHosts;
  }

  public onAutoCompleteRequest(term: string) {
    this.autoCompleteValues$ = this.methodViewModel.requestAutoComplete(term);
  }

  public onSearchStateChange(searchState: SearchStateInterface): void {
    this.methodViewModel.updateState(searchState);
  }

  public clearSearchFilters(): void {
    if (this.searchComponent) {
      this.searchComponent.reset(undefined, false);
    }
  }
}
