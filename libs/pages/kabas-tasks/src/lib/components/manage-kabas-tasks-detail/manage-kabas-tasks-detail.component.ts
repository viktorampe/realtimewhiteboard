import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSelectionList } from '@angular/material';
import { Router } from '@angular/router';
import { EduContentInterface, LearningAreaInterface } from '@campus/dal';
import { SearchFilterCriteriaInterface } from '@campus/search';
import { SideSheetComponent } from '@campus/ui';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AssigneeTypesEnum } from '../../interfaces/Assignee.interface';
import { TaskWithAssigneesInterface } from '../../interfaces/TaskWithAssignees.interface';
import { KabasTasksViewModel } from '../kabas-tasks.viewmodel';
import {
  NewTaskComponent,
  NewTaskFormValues
} from '../new-task/new-task.component';

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
  public selectedContents$ = new BehaviorSubject<EduContentInterface[]>([]);
  public task$: Observable<TaskWithAssigneesInterface>;
  public isNewTask$: Observable<boolean>;
  public selectableLearningAreas$: Observable<LearningAreaInterface[]>;

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
    private router: Router
  ) {
    this.isNewTask$ = this.viewModel.currentTaskParams$.pipe(
      map(currentTaskParams => !currentTaskParams.id)
    );

    this.selectableLearningAreas$ = this.viewModel.selectableLearningAreas$;
  }

  ngOnInit() {
    this.task$ = this.viewModel.currentTask$;
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
  public removeTasks(tasks: TaskWithAssigneesInterface[]) {
    this.viewModel.removeTasks(tasks);
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

  public openNewTaskDialog() {
    this.selectableLearningAreas$.pipe(take(1)).subscribe(learningAreas => {
      this.dialog
        .open(NewTaskComponent, {
          data: {
            learningAreas
          },
          panelClass: 'pages-kabas-tasks-new-task__dialog'
        })
        .afterClosed()
        .pipe(take(1))
        .subscribe((formData: NewTaskFormValues) => {
          if (formData) {
            this.viewModel.createTask(
              formData.title,
              formData.learningArea.id,
              formData.type
            );
          } else {
            this.router.navigate(['tasks', 'manage']);
          }
        });
    });
  }
}
