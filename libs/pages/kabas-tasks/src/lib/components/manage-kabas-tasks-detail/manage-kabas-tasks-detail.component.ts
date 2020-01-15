import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SearchFilterCriteriaInterface } from '@campus/search';
import { TaskWithAssigneesInterface } from '../../interfaces/TaskWithAssignees.interface';
import { AddAssigneeComponent } from '../add-assignee/add-assignee.component';
import { KabasTasksViewModel } from '../kabas-tasks.viewmodel';

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
  public iClicked() {
    this.dialog.open(AddAssigneeComponent, {
      data: {},
      panelClass: 'pages-kabas-tasks-new-task__dialog'
    });
  }
}
