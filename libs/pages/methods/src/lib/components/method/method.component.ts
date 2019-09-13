import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  ClassGroupInterface,
  EduContent,
  EduContentBookInterface,
  EduContentProductTypeInterface,
  EduContentTOCInterface,
  LearningPlanGoalInterface,
  MethodInterface
} from '@campus/dal';
import {
  MultiCheckBoxTableItemChangeEventInterface,
  MultiCheckBoxTableItemColumnInterface,
  MultiCheckBoxTableItemInterface,
  MultiCheckBoxTableRowHeaderColumnInterface
} from '@campus/ui';
import { Dictionary } from '@ngrx/entity';
import { Observable } from 'rxjs';
import { map, take, withLatestFrom } from 'rxjs/operators';
import { CurrentMethodParams, MethodViewModel } from '../method.viewmodel';

@Component({
  selector: 'campus-method',
  templateUrl: './method.component.html',
  styleUrls: ['./method.component.scss']
  // providers: [{ provide: MethodViewModel, useClass: MockMethodViewModel }]
})
export class MethodComponent implements OnInit {
  public boeke$: Observable<EduContent>;
  public book$: Observable<EduContentBookInterface>;
  public chapters$: Observable<EduContentTOCInterface[]>;
  public generalFilesByType$: Observable<Dictionary<EduContent[]>>;
  public method$: Observable<MethodInterface>;
  public productTypes$: Observable<EduContentProductTypeInterface[]>;
  public currentTab$: Observable<number>;
  public breadcrumbTitles$: Observable<string>;
  public isBoekeFavorite$: Observable<boolean>;

  public learningPlanGoalTableHeaders: MultiCheckBoxTableRowHeaderColumnInterface<
    LearningPlanGoalInterface
  >[];
  public classGroupColumns$: Observable<
    MultiCheckBoxTableItemColumnInterface<ClassGroupInterface>[]
  >;
  public learningPlanGoalsWithSelectionForClassGroups$: Observable<
    MultiCheckBoxTableItemInterface<LearningPlanGoalInterface>[]
  >;

  private currentMethodParams$: Observable<CurrentMethodParams>;

  constructor(private viewModel: MethodViewModel, private router: Router) {}

  ngOnInit() {
    this.book$ = this.viewModel.currentBook$;
    this.boeke$ = this.viewModel.currentBoeke$;
    this.isBoekeFavorite$ = this.viewModel.isCurrentBoekeFavorite$;
    this.chapters$ = this.viewModel.currentToc$;
    this.generalFilesByType$ = this.viewModel.generalFilesByType$;
    this.method$ = this.viewModel.currentMethod$;
    this.productTypes$ = this.viewModel.eduContentProductTypes$;
    this.currentTab$ = this.viewModel.currentTab$;
    this.currentMethodParams$ = this.viewModel.currentMethodParams$;
    this.breadcrumbTitles$ = this.viewModel.breadCrumbTitles$;

    this.learningPlanGoalTableHeaders = this.viewModel.learningPlanGoalTableHeaders;
    this.classGroupColumns$ = this.getTableColumnsFromClassGroupsStream();
    this.learningPlanGoalsWithSelectionForClassGroups$ = this.viewModel.learningPlanGoalsWithSelectionForClassGroups$;
  }

  public onSelectedTabIndexChanged(tab: number) {
    this.router.navigate([], {
      queryParams: { tab }
    });
  }

  public clickOpenChapter(chapterId: number) {
    this.currentTab$
      .pipe(
        take(1),
        withLatestFrom(this.currentMethodParams$)
      )
      .subscribe(([tab, currentMethodParams]) => {
        this.router.navigate(['methods', currentMethodParams.book, chapterId], {
          queryParams: {
            tab
          }
        });
      });
  }

  public clickOpenBoeke(eduContent: EduContent): void {
    this.viewModel.openBoeke(eduContent);
  }

  public clickOpenGeneralFile(eduContent: EduContent): void {
    this.viewModel.openEduContentAsDownload(eduContent);
  }

  public clickProgress(
    event: MultiCheckBoxTableItemChangeEventInterface<
      LearningPlanGoalInterface,
      ClassGroupInterface,
      EduContentTOCInterface
    >
  ) {
    if (event.isChecked) {
      // if the checkbox is checked
      this.viewModel.openLearningPlanGoalProgressManagementDialog(
        event.item, // lpg
        event.column // classGroup
      );
    } else {
      this.viewModel.deleteLearningPlanGoalProgressForLearningPlanGoalsClassGroups(
        event.item,
        event.column
      );
    }
  }

  public clickExportGoals(): void {
    this.viewModel.exportLearningPlanGoalProgress();
  }

  public toggleBoekeFavorite(boeke: EduContent) {
    this.viewModel.toggleBoekeFavorite(boeke);
  }

  private getTableColumnsFromClassGroupsStream(): Observable<
    MultiCheckBoxTableItemColumnInterface<ClassGroupInterface>[]
  > {
    return this.viewModel.filteredClassGroups$.pipe(
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
