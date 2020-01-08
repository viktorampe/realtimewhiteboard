import { Component, OnInit } from '@angular/core';
import { KabasTasksViewModel } from '../kabas-tasks.viewmodel';

@Component({
  selector: 'campus-manage-kabas-tasks-detail',
  templateUrl: './manage-kabas-tasks-detail.component.html',
  styleUrls: ['./manage-kabas-tasks-detail.component.scss']
})
export class ManageKabasTasksDetailComponent implements OnInit {
  constructor(private viewModel: KabasTasksViewModel) {}

  ngOnInit() {}

  public setArchivedTasks(taskIds: number[], isArchived: boolean) {
    this.viewModel.setArchivedTasks(taskIds, isArchived);
  }
  public removeTasks(taskIds: number[]) {
    this.viewModel.removeTasks(taskIds);
  }
  public toggleFavorite(taskId: number) {
    this.viewModel.toggleFavorite(taskId);
  }
}
