import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  Component,
  Inject,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { MatDialog, MatSelectionList } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import {
  EduContent,
  EduContentInterface,
  LearningAreaInterface,
  TaskEduContentInterface,
  TaskInterface
} from '@campus/dal';
import {
  ButtonToggleFilterComponent,
  SearchFilterCriteriaInterface,
  SearchTermComponent
} from '@campus/search';
import {
  OpenStaticContentServiceInterface,
  OPEN_STATIC_CONTENT_SERVICE_TOKEN
} from '@campus/shared';
import { ConfirmationModalComponent, SideSheetComponent } from '@campus/ui';
import { FilterServiceInterface, FILTER_SERVICE_TOKEN } from '@campus/utils';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import {
  filter,
  map,
  shareReplay,
  switchMap,
  take,
  withLatestFrom
} from 'rxjs/operators';
import {
  AssigneeInterface,
  AssigneeTypesEnum
} from '../../interfaces/Assignee.interface';
import { TaskEduContentWithEduContentInterface } from '../../interfaces/TaskEduContentWithEduContent.interface';
import {
  TaskStatusEnum,
  TaskWithAssigneesInterface
} from '../../interfaces/TaskWithAssignees.interface';
import { KabasTasksViewModel } from '../kabas-tasks.viewmodel';
import { ManageKabasTasksAssigneeDataInterface } from '../manage-kabas-tasks-assignee-modal/manage-kabas-tasks-assignee-data.interface';
import { ManageKabasTasksAssigneeModalComponent } from '../manage-kabas-tasks-assignee-modal/manage-kabas-tasks-assignee-modal.component';
import {
  NewTaskComponent,
  NewTaskFormValues
} from '../new-task/new-task.component';

export interface FilterStateInterface {
  searchTerm?: string;
  diaboloPhase?: number[];
  required?: boolean[];
  level?: number[];
}

@Component({
  selector: 'campus-manage-kabas-tasks-detail',
  templateUrl: './manage-kabas-tasks-detail.component.html',
  styleUrls: ['./manage-kabas-tasks-detail.component.scss']
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageKabasTasksDetailComponent implements OnInit {
  public assigneeTypesEnum: typeof AssigneeTypesEnum = AssigneeTypesEnum;

  public diaboloPhaseFilterCriteria: SearchFilterCriteriaInterface;
  public requiredFilterCriteria: SearchFilterCriteriaInterface;
  public levelFilterCriteria: SearchFilterCriteriaInterface;
  public isReordering = false;

  public isNewTask$: Observable<boolean>;
  public selectableLearningAreas$: Observable<LearningAreaInterface[]>;

  public selectedContents$ = new BehaviorSubject<EduContentInterface[]>([]);
  public task$: Observable<TaskWithAssigneesInterface>;
  public reorderableTaskEduContents$ = new BehaviorSubject<
    TaskEduContentWithEduContentInterface[]
  >([]);

  public filteredTaskEduContents$: Observable<TaskEduContentInterface[]>;

  private filterState$ = new BehaviorSubject<any>({});

  @ViewChild('taskContent', { static: false })
  private contentSelectionList: MatSelectionList;

  private sideSheet: SideSheetComponent;
  @ViewChild('taskSidesheet', { static: false })
  set sideSheetComponent(sidesheet: SideSheetComponent) {
    this.sideSheet = sidesheet;
  }

  @ViewChildren(SearchTermComponent)
  private searchTermFilters: QueryList<SearchTermComponent>;

  @ViewChildren(ButtonToggleFilterComponent)
  private buttonToggleFilters: QueryList<ButtonToggleFilterComponent>;

  constructor(
    private viewModel: KabasTasksViewModel,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(OPEN_STATIC_CONTENT_SERVICE_TOKEN)
    private openStaticContentService: OpenStaticContentServiceInterface,
    @Inject(FILTER_SERVICE_TOKEN) private filterService: FilterServiceInterface
  ) {}

  ngOnInit() {
    this.isNewTask$ = this.viewModel.currentTaskParams$.pipe(
      map(currentTaskParams => !currentTaskParams.id)
    );

    this.selectableLearningAreas$ = this.viewModel.selectableLearningAreas$;
    this.task$ = this.viewModel.currentTask$;
    this.diaboloPhaseFilterCriteria = this.getDiaboloPhaseFilterCriteria();
    this.requiredFilterCriteria = this.getRequiredFilterCriteria();
    this.levelFilterCriteria = this.getLevelFilterCriteria();

    this.isNewTask$.pipe(take(1)).subscribe(isNewTask => {
      if (isNewTask) {
        this.openNewTaskDialog();
      }
    });

    this.task$.subscribe(task => {
      this.reorderableTaskEduContents$.next([...task.taskEduContents]);
    });

    this.filteredTaskEduContents$ = this.getFilteredTaskEduContents$().pipe(
      shareReplay(1)
    );
  }

  public onSelectionChange() {
    const selected: EduContentInterface[] = this.contentSelectionList.selectedOptions.selected
      .map(option => option.value.eduContent as EduContentInterface)
      .sort((a, b) =>
        a.publishedEduContentMetadata.title <
        b.publishedEduContentMetadata.title
          ? -1
          : 1
      );
    this.selectedContents$.next(selected);
    this.sideSheet.toggle(true);
  }

  public setTaskAsArchived(
    tasks: TaskWithAssigneesInterface[],
    isArchived: boolean
  ) {
    this.viewModel.startArchivingTasks(tasks, isArchived);
  }

  public clickDeleteTask(task: TaskWithAssigneesInterface) {
    const dialogData = {
      title: 'Taak verwijderen',
      message: 'Ben je zeker dat je de geselecteerde taak wil verwijderen?'
    };

    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      data: dialogData
    });

    dialogRef
      .afterClosed()
      .pipe(filter(confirmed => confirmed))
      .subscribe(() => this.removeTask(task));
  }

  public removeTask(tasks: TaskWithAssigneesInterface) {
    this.viewModel.removeTasks([tasks], true);
  }

  public updateTitle(task: TaskWithAssigneesInterface, title: string) {
    this.viewModel.updateTask({ id: task.id, name: title });
  }

  public updateDescription(
    task: TaskWithAssigneesInterface,
    description: string
  ) {
    this.viewModel.updateTask({ id: task.id, name: task.name, description });
  }

  public toggleFavorite(task: TaskWithAssigneesInterface) {
    this.viewModel.toggleFavorite(task);
  }

  public searchTermFilterValueChanged(searchTerm: string) {
    const currentFilterState = this.filterState$.value;
    const newFilterState = { ...currentFilterState, searchTerm };

    this.filterState$.next(newFilterState);
  }

  public diaboloPhaseFilterSelectionChanged(
    diaboloPhaseFilterCriteria: SearchFilterCriteriaInterface[]
  ) {
    // emit is always an array with 1 value
    const diaboloPhaseFilterCriterium = diaboloPhaseFilterCriteria[0];

    const diaboloPhase = diaboloPhaseFilterCriterium.values
      .filter(value => value.selected)
      .map(selectedValue => selectedValue.data.id);

    this.updateFilterState({ diaboloPhase });
  }

  public requiredFilterSelectionChanged(
    requiredFilterCriteria: SearchFilterCriteriaInterface[]
  ) {
    // emit is always an array with 1 value
    const requiredFilterCriterium = requiredFilterCriteria[0];

    const required = requiredFilterCriterium.values
      .filter(value => value.selected)
      .map(selectedValue => selectedValue.data.required);

    this.updateFilterState({ required });
  }

  public levelFilterSelectionChanged(
    levelFilterCriteria: SearchFilterCriteriaInterface[]
  ) {
    // emit is always an array with 1 value
    const levelFilterCriterium = levelFilterCriteria[0];

    const level = levelFilterCriterium.values
      .filter(value => value.selected)
      .map(selectedValue => selectedValue.data.level);

    this.updateFilterState({ level });
  }

  public clickResetFilters(): void {
    [
      ...this.searchTermFilters.toArray(),
      ...this.buttonToggleFilters.toArray()
    ].forEach(searchFilter => {
      searchFilter.reset(false);
    });

    this.filterState$.next({});
  }

  public openAssigneeModal() {
    this.getAssigneeModalData()
      .pipe(
        switchMap(data =>
          this.dialog
            .open(ManageKabasTasksAssigneeModalComponent, {
              data,
              panelClass: 'manage-task-assignees'
            })
            .afterClosed()
        ),
        withLatestFrom(this.task$)
      )
      .subscribe(([assignees, task]) => {
        if (assignees) this.viewModel.updateTaskAccess(task, assignees);
      });
  }

  public openNewTaskDialog() {
    this.selectableLearningAreas$
      .pipe(
        take(1),
        switchMap(learningAreas =>
          this.dialog
            .open(NewTaskComponent, {
              data: {
                learningAreas
              },
              panelClass: 'pages-kabas-tasks-new-task__dialog'
            })
            .afterClosed()
        )
      )
      .subscribe((formData: NewTaskFormValues) => {
        if (formData) {
          this.viewModel.createTask(
            formData.title,
            formData.learningArea.id,
            formData.type
          );
        } else {
          const queryParams = { tab: 0 };
          if (this.route.snapshot.queryParams.paper) {
            queryParams.tab = 1;
          }
          this.router.navigate(['tasks', 'manage'], { queryParams });
        }
      });
  }

  public removeAssignee(
    task: TaskWithAssigneesInterface,
    assignee: AssigneeInterface
  ) {
    const remainingAssignees = task.assignees.filter(
      taskAssignee => taskAssignee !== assignee
    );

    this.viewModel.updateTaskAccess(task, remainingAssignees);
  }

  public toggleIsReordering() {
    if (!this.isReordering) {
      this.task$.pipe(take(1)).subscribe(task => {
        this.reorderableTaskEduContents$.next([...task.taskEduContents]);
      });
    }
    this.isReordering = !this.isReordering;
  }

  public dropTaskEduContent(
    taskEduContents: TaskEduContentWithEduContentInterface[],
    event: CdkDragDrop<TaskEduContentWithEduContentInterface[]>
  ) {
    moveItemInArray(taskEduContents, event.previousIndex, event.currentIndex);
    this.reorderableTaskEduContents$.next(taskEduContents);
  }

  public saveOrder() {
    this.viewModel.updateTaskEduContentsOrder(
      this.reorderableTaskEduContents$.value
    );
    this.toggleIsReordering();
  }

  public printTask(task: TaskInterface, withNames: boolean) {
    this.viewModel.printTask(task.id, withNames);
  }

  public printSolution(task: TaskInterface) {
    this.viewModel.printSolution(task.id);
  }

  public preview(eduContent: EduContentInterface, openDialog: boolean = false) {
    const content = Object.assign<EduContent, EduContentInterface>(
      new EduContent(),
      eduContent
    );
    this.openStaticContentService.open(content, false, !!openDialog);
  }

  public clickRemoveTaskEduContents(
    taskEduContents: TaskEduContentInterface[]
  ) {
    this.viewModel.deleteTaskEduContents(taskEduContents.map(tec => tec.id));
  }

  public isActiveTask(task: TaskWithAssigneesInterface) {
    return task.status === TaskStatusEnum.ACTIVE;
  }

  private getAssigneeModalData(): Observable<
    ManageKabasTasksAssigneeDataInterface
  > {
    return combineLatest([
      this.task$,
      this.viewModel.classGroups$,
      this.viewModel.groups$,
      this.viewModel.students$
    ]).pipe(
      take(1),
      map(([currentTask, classGroups, groups, students]) => {
        const possibleTaskClassGroups: AssigneeInterface[] = classGroups.map(
          classGroup => ({
            type: AssigneeTypesEnum.CLASSGROUP,
            label: classGroup.name,
            relationId: classGroup.id
          })
        );

        const possibleTaskGroups: AssigneeInterface[] = groups.map(group => ({
          type: AssigneeTypesEnum.GROUP,
          label: group.name,
          relationId: group.id
        }));

        const possibleTaskStudents: AssigneeInterface[] = students.map(
          student => ({
            type: AssigneeTypesEnum.STUDENT,
            label: student.displayName,
            relationId: student.id
          })
        );

        const data: ManageKabasTasksAssigneeDataInterface = {
          title: currentTask.name,
          isPaperTask: currentTask.isPaperTask,

          // all available taskAssignees
          possibleTaskClassGroups,
          possibleTaskGroups,
          possibleTaskStudents,

          // current values in page
          currentTaskAssignees: currentTask.assignees
        };

        return data;
      })
    );
  }

  private updateFilterState(filterStateChanges) {
    const currentFilterState = this.filterState$.value;
    const newFilterState = { ...currentFilterState, ...filterStateChanges };

    this.filterState$.next(newFilterState);
  }

  private getFilteredTaskEduContents$(): Observable<TaskEduContentInterface[]> {
    return combineLatest([this.filterState$, this.task$]).pipe(
      map(([filterState, task]) => {
        return this.filterTaskEduContents(filterState, task.taskEduContents);
      })
    );
  }

  private filterTaskEduContents(
    filterState,
    taskEduContents
  ): TaskEduContentInterface[] {
    if (taskEduContents.length === 0) return [];

    const filteredTaskEduContents = [...taskEduContents].filter(
      tEC =>
        this.filterOnDiaboloPhase(filterState, tEC) &&
        this.filterOnRequired(filterState, tEC) &&
        this.filterOnLevel(filterState, tEC) &&
        this.filterOnTitle(filterState, tEC)
    );

    return filteredTaskEduContents;
  }

  private filterOnTitle(
    filterState: FilterStateInterface,
    taskEduContent: TaskEduContentInterface
  ): boolean {
    return (
      !filterState.searchTerm ||
      this.filterService.matchFilters(taskEduContent, {
        eduContent: {
          publishedEduContentMetadata: { title: filterState.searchTerm }
        }
      })
    );
  }

  private filterOnDiaboloPhase(
    filterState: FilterStateInterface,
    taskEduContent: TaskEduContentInterface
  ): boolean {
    return (
      !filterState.diaboloPhase ||
      !filterState.diaboloPhase.length ||
      filterState.diaboloPhase.includes(
        taskEduContent.eduContent.publishedEduContentMetadata.diaboloPhaseId
      )
    );
  }

  private filterOnRequired(
    filterState: FilterStateInterface,
    taskEduContent: TaskEduContentInterface
  ): boolean {
    return (
      !filterState.required ||
      !filterState.required.length ||
      filterState.required.includes(taskEduContent.required)
    );
  }

  private filterOnLevel(
    filterState: FilterStateInterface,
    taskEduContent: TaskEduContentInterface
  ): boolean {
    return (
      !filterState.level ||
      !filterState.level.length ||
      filterState.level.includes(
        taskEduContent.eduContent.publishedEduContentMetadata.levelId
      )
    );
  }

  private getDiaboloPhaseFilterCriteria(): SearchFilterCriteriaInterface {
    return {
      name: 'diaboloPhase',
      label: 'Diabolo-fase',
      keyProperty: 'id',
      displayProperty: 'icon',
      values: [
        {
          data: {
            id: 1,
            icon: 'diabolo-intro'
          },
          visible: true
        },
        {
          data: {
            id: 2,
            icon: 'diabolo-midden'
          },
          visible: true
        },
        {
          data: {
            id: 3,
            icon: 'diabolo-outro'
          },
          visible: true
        }
      ]
    };
  }

  private getRequiredFilterCriteria(): SearchFilterCriteriaInterface {
    return {
      name: 'required',
      label: 'Moetje-magje',
      keyProperty: 'required',
      displayProperty: 'icon',
      values: [
        {
          data: {
            required: true,
            icon: 'edu-content:required'
          },
          visible: true
        },
        {
          data: {
            required: false,
            icon: 'edu-content:optional'
          },
          visible: true
        }
      ]
    };
  }

  private getLevelFilterCriteria(): SearchFilterCriteriaInterface {
    return {
      name: 'level',
      label: 'Moeilijkheidsgraad',
      keyProperty: 'level',
      displayProperty: 'icon',
      values: [
        {
          data: {
            level: 1,
            icon: 'edu-content:level-basic'
          },
          visible: true
        },
        {
          data: {
            level: 2,
            icon: 'edu-content:level-advanced'
          },
          visible: true
        }
      ]
    };
  }
}
