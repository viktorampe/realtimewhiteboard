import {
  AfterViewInit,
  Component,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { Router } from '@angular/router';
import {
  ClassGroupInterface,
  EduContent,
  EduContentTOCInterface,
  LearningPlanGoalInterface
} from '@campus/dal';
import {
  SearchComponent,
  SearchModeInterface,
  SearchPortalDirective,
  SearchResultInterface,
  SearchStateInterface
} from '@campus/search';
import {
  MultiCheckBoxTableChangeEventInterface,
  MultiCheckBoxTableItemColumnInterface,
  MultiCheckBoxTableRowHeaderColumnInterface,
  MultiCheckBoxTableSubLevelInterface
} from '@campus/ui';
import { Observable } from 'rxjs';
import { map, take, withLatestFrom } from 'rxjs/operators';
import { CurrentMethodParams, MethodViewModel } from '../method.viewmodel';

@Component({
  selector: 'campus-method-chapter',
  templateUrl: './method-chapter.component.html',
  styleUrls: ['./method-chapter.component.scss']
  // providers: [{ provide: MethodViewModel, useClass: MockMethodViewModel }]
})
export class MethodChapterComponent implements OnInit, AfterViewInit {
  public searchMode$: Observable<SearchModeInterface>;
  public initialSearchState$: Observable<SearchStateInterface>;
  public searchResults$: Observable<SearchResultInterface>;
  public autoCompleteValues$: Observable<string[]>;
  public boeke$: Observable<EduContent>;
  public lessonsForChapter$: Observable<EduContentTOCInterface[]>;
  public currentTab$: Observable<number>;
  public currentMethodParams$: Observable<CurrentMethodParams>;
  public breadCrumbTitles$: Observable<string>;
  public learningPlanGoalTableHeaders: MultiCheckBoxTableRowHeaderColumnInterface<
    LearningPlanGoalInterface
  >[];
  public classGroupColumns$: Observable<
    MultiCheckBoxTableItemColumnInterface<ClassGroupInterface>[]
  >;
  public learningPlanGoalsPerLessonWithSelectionForClassGroups$: Observable<
    MultiCheckBoxTableSubLevelInterface<
      EduContentTOCInterface,
      LearningPlanGoalInterface
    >[]
  >;

  @ViewChildren(SearchPortalDirective)
  private portalHosts: QueryList<SearchPortalDirective>;
  @ViewChild(SearchComponent) public searchComponent: SearchComponent;

  constructor(
    private methodViewModel: MethodViewModel,
    private router: Router
  ) {}

  ngOnInit() {
    this.searchMode$ = this.methodViewModel.getSearchMode('chapter-lesson');
    this.initialSearchState$ = this.methodViewModel.getInitialSearchState();
    this.searchResults$ = this.methodViewModel.searchResults$;
    this.boeke$ = this.methodViewModel.currentBoeke$;
    this.lessonsForChapter$ = this.methodViewModel.currentToc$;
    this.currentTab$ = this.methodViewModel.currentTab$;
    this.currentMethodParams$ = this.methodViewModel.currentMethodParams$;
    this.breadCrumbTitles$ = this.methodViewModel.breadCrumbTitles$;

    this.learningPlanGoalTableHeaders = this.methodViewModel.learningPlanGoalTableHeaders;
    this.classGroupColumns$ = this.getTableColumnsFromClassGroupsStream();
    this.learningPlanGoalsPerLessonWithSelectionForClassGroups$ = this.methodViewModel.learningPlanGoalsPerLessonWithSelectionForClassGroups$;
  }

  ngAfterViewInit() {
    this.searchComponent.searchPortals = this.portalHosts;
  }

  public onSelectedTabIndexChanged(tab: number) {
    this.router.navigate([], {
      queryParams: { tab }
    });
  }

  public onAutoCompleteRequest(term: string) {
    this.autoCompleteValues$ = this.methodViewModel.requestAutoComplete(term);
  }

  public onSearchStateChange(searchState: SearchStateInterface): void {
    this.methodViewModel.updateState(searchState);
  }

  public clearSearchFilters(): void {
    if (this.searchComponent) {
      this.searchComponent.reset(undefined, true);
    }
  }

  public clickOpenLesson(lessonId: number) {
    this.currentTab$
      .pipe(
        take(1),
        withLatestFrom(this.currentMethodParams$)
      )
      .subscribe(([tab, currentMethodParams]) => {
        this.router.navigate(
          [
            'methods',
            currentMethodParams.book,
            currentMethodParams.chapter,
            lessonId
          ],
          {
            queryParams: {
              tab
            }
          }
        );
      });
  }

  public clickBackLink() {
    this.currentTab$
      .pipe(
        take(1),
        withLatestFrom(this.currentMethodParams$)
      )
      .subscribe(([tab, currentMethodParams]) => {
        const urlParts = ['methods', currentMethodParams.book];
        if (currentMethodParams.lesson)
          urlParts.push(currentMethodParams.chapter);

        this.router.navigate(urlParts, {
          queryParams: {
            tab
          }
        });
      });
  }

  public clickOpenBoeke(eduContent: EduContent): void {
    this.methodViewModel.openBoeke(eduContent);
  }

  public checkBoxChanged(
    event: MultiCheckBoxTableChangeEventInterface<
      LearningPlanGoalInterface,
      ClassGroupInterface,
      EduContentTOCInterface
    >
  ) {
    this.methodViewModel.onLearningPlanGoalProgressChanged(
      event.column.id,
      event.item.id,
      event.subLevel.id,
      null
    );
  }

  public checkBoxesChanged(
    events: MultiCheckBoxTableChangeEventInterface<
      LearningPlanGoalInterface,
      ClassGroupInterface,
      EduContentTOCInterface
    >[]
  ) {
    if (events.length) {
      this.methodViewModel.onBulkLearningPlanGoalProgressChanged(
        events[0].column.id,
        events.map(e => e.item.id),
        events[0].subLevel.id
      );
    }
  }

  private getTableColumnsFromClassGroupsStream(): Observable<
    MultiCheckBoxTableItemColumnInterface<ClassGroupInterface>[]
  > {
    return this.methodViewModel.filteredClassGroups$.pipe(
      map(classGroups =>
        classGroups.map(
          (
            classGroup
          ): MultiCheckBoxTableItemColumnInterface<ClassGroupInterface> => ({
            item: classGroup,
            key: 'id',
            label: 'name'
          })
        )
      )
    );
  }
}
