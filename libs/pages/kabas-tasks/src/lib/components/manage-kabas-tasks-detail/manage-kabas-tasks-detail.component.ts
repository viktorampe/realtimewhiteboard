import { Component, OnInit } from '@angular/core';
import { SearchFilterCriteriaInterface } from '@campus/search';
import { TaskWithAssigneesInterface } from '../../interfaces/TaskWithAssignees.interface';
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

  constructor(private viewModel: KabasTasksViewModel) {}

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

  public setArchivedTasks(
    taskIds: TaskWithAssigneesInterface[],
    isArchived: boolean
  ) {
    this.viewModel.setArchivedTasks(taskIds, isArchived);
  }
  public removeTasks(taskIds: TaskWithAssigneesInterface[]) {
    this.viewModel.removeTasks(taskIds);
  }
  public toggleFavorite(taskId: TaskWithAssigneesInterface) {
    this.viewModel.toggleFavorite(taskId);
  }
}
