import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  AfterViewInit,
  Component,
  HostBinding,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { Params, Router } from '@angular/router';
import { EduContent, EduContentTOCInterface } from '@campus/dal';
import {
  SearchComponent,
  SearchModeInterface,
  SearchPortalDirective,
  SearchResultInterface,
  SearchStateInterface
} from '@campus/search';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { filter, map, switchMapTo, take } from 'rxjs/operators';
import { TaskEduContentWithEduContentInterface } from '../../interfaces/TaskEduContentWithEduContent.interface';
import { TaskWithAssigneesInterface } from '../../interfaces/TaskWithAssignees.interface';
import {
  CurrentTaskParams,
  KabasTasksViewModel
} from '../kabas-tasks.viewmodel';

@Component({
  selector: 'campus-manage-task-content',
  templateUrl: './manage-task-content.component.html',
  styleUrls: ['./manage-task-content.component.scss']
})
export class ManageTaskContentComponent
  implements OnInit, AfterViewInit, OnDestroy {
  public currentContent$: Observable<TaskEduContentWithEduContentInterface[]>;
  public reorderableTaskEduContents$ = new BehaviorSubject<
    TaskEduContentWithEduContentInterface[]
  >([]);
  public task$: Observable<TaskWithAssigneesInterface>;

  public searchMode$: Observable<SearchModeInterface>;
  public initialSearchState$: Observable<SearchStateInterface>;
  public searchResults$: Observable<SearchResultInterface>;
  public autoCompleteValues$: Observable<string[]>;
  public currentToc$: Observable<EduContentTOCInterface[]>;
  public currentTaskParams$: Observable<CurrentTaskParams>;
  public selectedBookTitle$: Observable<string>;

  @ViewChildren(SearchPortalDirective)
  private portalHosts: QueryList<SearchPortalDirective>;
  @ViewChild(SearchComponent, { static: true })
  public searchComponent: SearchComponent;
  private subscriptions = new Subscription();

  constructor(private viewModel: KabasTasksViewModel, private router: Router) {}

  @HostBinding('class.manage-task-content')
  manageTaskContentClass = true;

  ngOnInit() {
    // redirect to favorite
    this.viewModel.currentTaskParams$
      .pipe(
        filter(params => !params.book),
        switchMapTo(this.viewModel.favoriteBookIdsForTask$),
        take(1)
      )
      .subscribe((favoriteBookIds: number[]) => {
        if (favoriteBookIds.length === 1) {
          this.router.navigate([this.router.url], {
            queryParams: { book: favoriteBookIds[0] }
          });
        }
      });

    this.currentContent$ = this.viewModel.currentTask$.pipe(
      map(task => task.taskEduContents)
    );
    this.task$ = this.viewModel.currentTask$;
    this.selectedBookTitle$ = this.viewModel.selectedBookTitle$;

    this.searchMode$ = this.viewModel.getSearchMode('task-manage-content');
    this.initialSearchState$ = this.viewModel.getInitialSearchState();
    this.searchResults$ = this.viewModel.searchResults$;

    this.currentToc$ = this.viewModel.currentToc$;
    this.currentTaskParams$ = this.viewModel.currentTaskParams$;
    this.subscriptions.add(
      this.task$.subscribe(task => {
        this.reorderableTaskEduContents$.next([...task.taskEduContents]);
      })
    );
  }

  ngAfterViewInit() {
    this.searchComponent.searchPortals = this.portalHosts;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public dropTaskEduContent(
    taskEduContents: TaskEduContentWithEduContentInterface[],
    event: CdkDragDrop<TaskEduContentWithEduContentInterface[]>
  ) {
    if (event.previousIndex === event.currentIndex) {
      return;
    }

    moveItemInArray(taskEduContents, event.previousIndex, event.currentIndex);
    this.viewModel.updateTaskEduContentsOrder(taskEduContents);
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
        queryParams.lesson = undefined;
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
