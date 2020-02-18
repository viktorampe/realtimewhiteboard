import {
  AfterViewInit,
  Component,
  HostBinding,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { EduContentTOCFixture, EduContentTOCInterface } from '@campus/dal';
import {
  SearchComponent,
  SearchModeInterface,
  SearchPortalDirective,
  SearchResultInterface,
  SearchStateInterface
} from '@campus/search';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { TaskEduContentWithEduContentInterface } from '../../interfaces/TaskEduContentWithEduContent.interface';
import {
  CurrentTaskParams,
  KabasTasksViewModel
} from '../kabas-tasks.viewmodel';

@Component({
  selector: 'campus-manage-task-content',
  templateUrl: './manage-task-content.component.html',
  styleUrls: ['./manage-task-content.component.scss']
})
export class ManageTaskContentComponent implements OnInit, AfterViewInit {
  // ----TODO REMOVE MOCKS ----
  bookId = 1;
  chapterTocs = [
    new EduContentTOCFixture({
      id: 1,
      treeId: this.bookId,
      title: 'Chapter 1',
      depth: 0,
      lft: 1,
      rgt: 6,
      learningPlanGoalIds: [1, 2, 3]
    }),
    new EduContentTOCFixture({
      id: 2,
      treeId: this.bookId,
      title: 'Chapter 2',
      depth: 0,
      lft: 7,
      rgt: 12,
      learningPlanGoalIds: [1, 2, 3, 4]
    })
  ];

  lessonTocs = [
    new EduContentTOCFixture({
      id: 3,
      treeId: this.bookId,
      title: 'Lesson 1',
      depth: 1,
      lft: 2,
      rgt: 3,
      learningPlanGoalIds: [1, 2]
    }),
    new EduContentTOCFixture({
      id: 4,
      treeId: this.bookId,
      title: 'Lesson 2',
      depth: 1,
      lft: 4,
      rgt: 5,
      learningPlanGoalIds: [2, 3, 4]
    }),
    new EduContentTOCFixture({
      id: 4,
      treeId: this.bookId,
      title: 'Lesson 3',
      depth: 1,
      lft: 8,
      rgt: 9,
      learningPlanGoalIds: [1, 2]
    }),
    new EduContentTOCFixture({
      id: 5,
      treeId: this.bookId,
      title: 'Lesson 4',
      depth: 1,
      lft: 10,
      rgt: 11,
      learningPlanGoalIds: [2, 3, 4]
    })
  ];

  mockVmCurrentToc$ = new BehaviorSubject<EduContentTOCInterface[]>([
    this.chapterTocs[0],
    this.lessonTocs[0],
    this.lessonTocs[1],
    this.chapterTocs[1],
    this.lessonTocs[2],
    this.lessonTocs[3]
  ]);

  // ----END REMOVE MOCKS ----

  public currentContent$: Observable<TaskEduContentWithEduContentInterface[]>;

  public searchMode$: Observable<SearchModeInterface>;
  public initialSearchState$: Observable<SearchStateInterface>;
  public searchResults$: Observable<SearchResultInterface>;
  public autoCompleteValues$: Observable<string[]>;
  public currentToc$: Observable<EduContentTOCInterface[]>;
  public currentTaskParams$: Observable<CurrentTaskParams>;

  @ViewChildren(SearchPortalDirective)
  private portalHosts: QueryList<SearchPortalDirective>;
  @ViewChild(SearchComponent, { static: true })
  public searchComponent: SearchComponent;

  constructor(private viewModel: KabasTasksViewModel) {}

  @HostBinding('class.manage-task-content')
  manageTaskContentClass = true;

  ngOnInit() {
    this.currentContent$ = this.viewModel.currentTask$.pipe(
      map(task => task.taskEduContents)
    );

    this.searchMode$ = this.viewModel.getSearchMode('task-manage-content');
    this.initialSearchState$ = this.viewModel.getInitialSearchState();
    this.searchResults$ = this.viewModel.searchResults$;

    // TODO: replace with this.viewModel.currentToc$
    this.currentToc$ = this.mockVmCurrentToc$;
    this.currentTaskParams$ = this.viewModel.currentTaskParams$.pipe(
      tap(params => console.log(params))
    );
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
