import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSelectionList } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import {
  EduContent,
  EduContentInterface,
  LearningAreaInterface,
  TaskEduContentInterface,
  TaskInterface
} from '@campus/dal';
import { SearchFilterCriteriaInterface } from '@campus/search';
import {
  ContentActionInterface,
  ContentActionsServiceInterface,
  CONTENT_ACTIONS_SERVICE_TOKEN,
  OpenStaticContentServiceInterface,
  OPEN_STATIC_CONTENT_SERVICE_TOKEN
} from '@campus/shared';
import { ConfirmationModalComponent, SideSheetComponent } from '@campus/ui';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, map, switchMap, take, withLatestFrom } from 'rxjs/operators';
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
import { PrintPaperTaskModalResultEnum } from '../print-paper-task-modal/print-paper-task-modal-result.enum';
import { PrintPaperTaskModalComponent } from '../print-paper-task-modal/print-paper-task-modal.component';

export enum TaskSortEnum {
  'NAME' = 'NAME',
  'LEARNINGAREA' = 'LEARNINGAREA',
  'STARTDATE' = 'STARTDATE'
}

@Component({
  selector: 'campus-manage-kabas-tasks-detail',
  templateUrl: './manage-kabas-tasks-detail.component.html',
  styleUrls: ['./manage-kabas-tasks-detail.component.scss']
})
export class ManageKabasTasksDetailComponent implements OnInit {
  public TaskSortEnum = TaskSortEnum;
  public diaboloPhaseFilter: SearchFilterCriteriaInterface;

  public isNewTask$: Observable<boolean>;
  public selectableLearningAreas$: Observable<LearningAreaInterface[]>;
  isReordering = false;
  isPaperTask = true; // replace w/ stream
  public selectedContents$ = new BehaviorSubject<TaskEduContentInterface[]>([]);
  public task$: Observable<TaskWithAssigneesInterface>;
  public reorderableTaskEduContents$ = new BehaviorSubject<
    TaskEduContentWithEduContentInterface[]
  >([]);

  public assigneeTypesEnum: typeof AssigneeTypesEnum = AssigneeTypesEnum;

  @ViewChild('taskContent', { static: false })
  private contentSelectionList: MatSelectionList;

  private sideSheet: SideSheetComponent;
  @ViewChild('taskSidesheet', { static: false })
  set sideSheetComponent(sidesheet: SideSheetComponent) {
    this.sideSheet = sidesheet;
  }

  constructor(
    private viewModel: KabasTasksViewModel,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(CONTENT_ACTIONS_SERVICE_TOKEN)
    private contentActionService: ContentActionsServiceInterface,
    @Inject(OPEN_STATIC_CONTENT_SERVICE_TOKEN)
    private openStaticContentService: OpenStaticContentServiceInterface
  ) {
    this.isNewTask$ = this.viewModel.currentTaskParams$.pipe(
      map(currentTaskParams => !currentTaskParams.id)
    );

    this.selectableLearningAreas$ = this.viewModel.selectableLearningAreas$;
  }

  ngOnInit() {
    this.task$ = this.viewModel.currentTask$.pipe(
      map(task => {
        const taskEduContents = task.taskEduContents.map(tE => {
          return {
            ...tE,
            actions: this.contentActionService.getActionsForEduContent(
              tE.eduContent
            )
          };
        });

        return { ...task, taskEduContents };
      })
    );

    this.diaboloPhaseFilter = {
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

    this.isNewTask$.pipe(take(1)).subscribe(isNewTask => {
      if (isNewTask) {
        this.openNewTaskDialog();
      }
    });

    this.task$.subscribe(task => {
      this.reorderableTaskEduContents$.next([...task.taskEduContents]);
    });
  }

  public onSelectionChange() {
    const selected: TaskEduContentInterface[] = this.contentSelectionList.selectedOptions.selected
      .map(option => option.value)
      .sort((a: TaskEduContentInterface, b: TaskEduContentInterface) =>
        a.eduContent.publishedEduContentMetadata.title <
        b.eduContent.publishedEduContentMetadata.title
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

  clickDeleteTask(task: TaskWithAssigneesInterface) {
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

  public clickPrintTask() {
    this.task$
      .pipe(
        take(1),
        switchMap(task => {
          const disable = [];

          if (!task.assignees.length) {
            disable.push(PrintPaperTaskModalResultEnum.WITH_NAMES);
          }

          return this.dialog
            .open(PrintPaperTaskModalComponent, {
              data: { disable },
              panelClass: 'manage-task-detail-print'
            })
            .afterClosed() as Observable<PrintPaperTaskModalResultEnum>;
        }),
        withLatestFrom(this.task$)
      )
      .subscribe(([modalResult, task]) => {
        switch (modalResult) {
          case PrintPaperTaskModalResultEnum.WITH_NAMES:
            this.printTask(task, true);
            break;
          case PrintPaperTaskModalResultEnum.WITHOUT_NAMES:
            this.printTask(task, false);
            break;
          case PrintPaperTaskModalResultEnum.SOLUTION:
            this.printSolution(task);
            break;
        }
      });
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

  public handleTaskEduContentAction(
    action: ContentActionInterface,
    eduContent: EduContent
  ) {
    action.handler(eduContent);
  }

  public isActiveTask(task: TaskWithAssigneesInterface) {
    return task.status === TaskStatusEnum.ACTIVE;
  }
}
