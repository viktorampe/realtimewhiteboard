import { Component, OnInit } from '@angular/core';
import { SearchFilterCriteriaInterface } from '@campus/search';
import { BehaviorSubject } from 'rxjs';
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
  istaskDigital = true; // replace w/ stream
  public selectedItems = [];
  public selectedItems$ = new BehaviorSubject<any>({});
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

  public clickedListItem(clickedOptions) {
    this.selectedItems$.next(clickedOptions.selectedOptions.selected);
    console.log(this.selectedItems$.value);
    console.log(this.selectedItems);
    //this.selectedItems = clickedOptions.selectedOptions.selected;
  }

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
