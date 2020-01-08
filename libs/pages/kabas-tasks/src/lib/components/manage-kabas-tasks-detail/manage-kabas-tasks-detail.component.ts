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

  public setArchivedTasks(taskIds, isArchived) {
    this.viewModel.setArchivedTasks(taskIds, isArchived);
  }
  public removeTasks(taskIds) {
    this.viewModel.removeTasks(taskIds);
  }
  public toggleFavorite(taskId) {
    this.viewModel.toggleFavorite(taskId);
  }
}
