import {
  AfterViewInit,
  Component,
  HostBinding,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { Params, Router } from '@angular/router';
import { EduContent } from '@campus/dal';
import {
  SearchComponent,
  SearchModeInterface,
  SearchPortalDirective,
  SearchResultInterface,
  SearchStateInterface
} from '@campus/search';
import { Observable } from 'rxjs';
import { TaskWithAssigneesInterface } from '../../interfaces/TaskWithAssignees.interface';
import { KabasTasksViewModel } from '../kabas-tasks.viewmodel';

@Component({
  selector: 'campus-manage-task-content',
  templateUrl: './manage-task-content.component.html',
  styleUrls: ['./manage-task-content.component.scss']
})
export class ManageTaskContentComponent implements OnInit, AfterViewInit {
  public task$: Observable<TaskWithAssigneesInterface>;

  public searchMode$: Observable<SearchModeInterface>;
  public initialSearchState$: Observable<SearchStateInterface>;
  public searchResults$: Observable<SearchResultInterface>;
  public autoCompleteValues$: Observable<string[]>;
  public selectedBookTitle$: Observable<string>;

  @ViewChildren(SearchPortalDirective)
  private portalHosts: QueryList<SearchPortalDirective>;
  @ViewChild(SearchComponent, { static: true })
  public searchComponent: SearchComponent;

  constructor(private viewModel: KabasTasksViewModel, private router: Router) {}

  @HostBinding('class.manage-task-content')
  manageTaskContentClass = true;

  ngOnInit() {
    this.task$ = this.viewModel.currentTask$;
    this.selectedBookTitle$ = this.viewModel.selectedBookTitle$;

    this.searchMode$ = this.viewModel.getSearchMode('task-manage-content');
    this.initialSearchState$ = this.viewModel.getInitialSearchState();
    this.searchResults$ = this.viewModel.searchResults$;
  }

  ngAfterViewInit() {
    this.searchComponent.searchPortals = this.portalHosts;
  }

  public clickDone() {}

  addEduContentToTask(eduContent: EduContent, index?: number) {
    this.viewModel.addEduContentToTask(eduContent, index);
  }

  selectTOC(tocId: number, depth: number) {
    const queryParams: Params = {};
    switch (depth) {
      case 0:
        queryParams.chapter = tocId;
        break;
      case 1:
        queryParams.lesson = tocId;
        break;
    }
    this.router.navigate([], { queryParams, queryParamsHandling: 'merge' });
  }

  removeEduContentFromTask(eduContent: EduContent) {
    this.viewModel.removeEduContentFromTask(eduContent);
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
