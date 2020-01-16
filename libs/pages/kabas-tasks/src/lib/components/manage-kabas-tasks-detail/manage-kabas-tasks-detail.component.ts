import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import {
  ClassGroupInterface,
  GroupInterface,
  PersonInterface
} from '@campus/dal';
import { SearchFilterCriteriaInterface } from '@campus/search';
import { take } from 'rxjs/operators';
import {
  AssigneeInterface,
  AssigneeTypesEnum
} from '../../interfaces/Assignee.interface';
import { TaskWithAssigneesInterface } from '../../interfaces/TaskWithAssignees.interface';
import { KabasTasksViewModel } from '../kabas-tasks.viewmodel';
import { ManageKabasTasksAssigneeDataInterface } from '../manage-kabas-tasks-assignee-modal/manage-kabas-tasks-assignee-data.interface';
import { ManageKabasTasksAssigneeModalComponent } from '../manage-kabas-tasks-assignee-modal/manage-kabas-tasks-assignee-modal.component';

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

  isPaperTask = true; // replace w/ stream

  constructor(
    private viewModel: KabasTasksViewModel,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.openAssigneeModal();

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
  }

  public setTaskAsArchived(
    tasks: TaskWithAssigneesInterface[],
    isArchived: boolean
  ) {
    this.viewModel.setTaskAsArchived(tasks, isArchived);
  }
  public removeTasks(tasks: TaskWithAssigneesInterface[]) {
    this.viewModel.removeTasks(tasks);
  }
  public toggleFavorite(task: TaskWithAssigneesInterface) {
    this.viewModel.toggleFavorite(task);
  }

  private openAssigneeModal() {
    let currentTaskAssignees: AssigneeInterface[];
    let possibleTaskAssignees: AssigneeInterface[];

    // TODO use currentTaskWithAssignment
    this.viewModel.tasksWithAssignments$
      .pipe(take(1))
      .subscribe(tasksWithAssignments => {
        currentTaskAssignees = tasksWithAssignments[0].assignees;
      });

    // TODO get actual values from store
    const classGroups: ClassGroupInterface[] = [];
    const groups: GroupInterface[] = [];
    const students: PersonInterface[] = [];

    possibleTaskAssignees = [
      ...classGroups.map(cG => ({
        type: AssigneeTypesEnum.CLASSGROUP,
        label: cG.name,
        relationId: cG.id
      })),
      ...groups.map(group => ({
        type: AssigneeTypesEnum.GROUP,
        label: group.name,
        relationId: group.id
      })),
      ...students.map(student => ({
        type: AssigneeTypesEnum.STUDENT,
        label: student.displayName,
        relationId: student.id
      }))
    ];

    const data: ManageKabasTasksAssigneeDataInterface = {
      title: 'Taak naam',
      // all available taskAssignees
      possibleTaskAssignees,

      // current values in page
      currentTaskAssignees
    };

    this.dialog
      .open(ManageKabasTasksAssigneeModalComponent, {
        data,
        panelClass: 'manage-task-assignees'
      })
      .afterClosed()
      .subscribe(res => {
        // TODO update assignees
        console.log(res);
      });
  }
}
