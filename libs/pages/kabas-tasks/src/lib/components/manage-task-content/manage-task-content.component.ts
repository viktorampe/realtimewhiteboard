import {
  AfterViewInit,
  Component,
  HostBinding,
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
import { KabasTasksViewModel } from '../kabas-tasks.viewmodel';

@Component({
  selector: 'campus-manage-task-content',
  templateUrl: './manage-task-content.component.html',
  styleUrls: ['./manage-task-content.component.scss']
})
export class ManageTaskContentComponent implements OnInit, AfterViewInit {
  public searchMode$: Observable<SearchModeInterface>;
  public initialSearchState$: Observable<SearchStateInterface>;
  public searchResults$: Observable<SearchResultInterface>;
  public autoCompleteValues$: Observable<string[]>;

  @ViewChildren(SearchPortalDirective)
  private portalHosts: QueryList<SearchPortalDirective>;
  @ViewChild(SearchComponent, { static: true })
  public searchComponent: SearchComponent;

  constructor(private viewModel: KabasTasksViewModel) {}

  @HostBinding('class.manage-task-content')
  manageTaskContentClass = true;

  ngOnInit() {
    this.searchMode$ = this.viewModel.getSearchMode('task-manage-content');
    this.initialSearchState$ = this.viewModel.getInitialSearchState();
    this.searchResults$ = this.viewModel.searchResults$;
  }

  ngAfterViewInit() {
    this.searchComponent.searchPortals = this.portalHosts;
  }

  public clickDone() {}

  addEduContentToTask(eduContentId: number, taskId: number, index: number) {
    throw new Error('not implemented');
  }

  selectTOC(tocId: number, depth: number) {
    // TODO: implement
    throw new Error('Not yet implemented');
  }

  removeEduContentFromTask(taskEduContentId: number) {
    throw new Error('not implemented');
  }

  clearSearchFilters() {
    if (this.searchComponent) {
      this.searchComponent.reset(undefined, true);
    }
  }

  public onAutoCompleteRequest(term: string) {
    this.autoCompleteValues$ = this.viewModel.requestAutoComplete(term);
  }

  onSearchStateChange(searchState: SearchStateInterface) {
    this.viewModel.updateSearchState(searchState);
  }
}
