import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SearchFilterCriteriaInterface } from '@campus/search';
import { take } from 'rxjs/operators';
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
    let currentTaskAssignees;

    this.viewModel.tasksWithAssignments$
      .pipe(take(1))
      .subscribe(tasksWithAssignments => {
        currentTaskAssignees = tasksWithAssignments[0].assignees;
      });

    const data: ManageKabasTasksAssigneeDataInterface = {
      title: 'Taak naam',
      // all available taskAssignees
      // these need to include related data (classGroup, group, person)
      classGroups: [],
      groups: [],
      students: [],
      // current values in page
      currentTaskAssignees
    };

    this.dialog
      .open(ManageKabasTasksAssigneeModalComponent, {
        data,
        // autoFocus: false
        panelClass: 'manage-task-assignees'
      })
      .afterClosed()
      .subscribe(res => console.log(res));
  }
}
