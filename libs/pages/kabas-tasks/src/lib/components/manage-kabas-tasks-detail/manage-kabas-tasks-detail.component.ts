import { Component, OnInit } from '@angular/core';
import { SearchFilterCriteriaInterface } from '@campus/search';
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
  constructor(private viewModel: KabasTasksViewModel) {}

  public setArchivedTasks(taskIds: number[], isArchived: boolean) {
    this.viewModel.setArchivedTasks(taskIds, isArchived);
  }
  public removeTasks(taskIds: number[]) {
    this.viewModel.removeTasks(taskIds);
  }
  public toggleFavorite(taskId: number) {
    this.viewModel.toggleFavorite(taskId);
  }
  public TaskSortEnum = TaskSortEnum;
  public diaboloPhaseFilter: SearchFilterCriteriaInterface;
  public selectedItems = [];

  public clickedListItem(clickedOptions) {
    this.selectedItems = clickedOptions.selectedOptions.selected;
  }
  istaskDigital = false; // replace w/ stream

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
}
