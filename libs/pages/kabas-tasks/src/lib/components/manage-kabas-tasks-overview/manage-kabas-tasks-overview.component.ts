import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { KabasTasksViewModel } from '../kabas-tasks.viewmodel';
import { TaskWithAssigneesInterface } from '../kabas-tasks.viewmodel.selectors';

@Component({
  selector: 'campus-manage-kabas-tasks-overview',
  templateUrl: './manage-kabas-tasks-overview.component.html',
  styleUrls: ['./manage-kabas-tasks-overview.component.scss']
})
export class ManageKabasTasksOverviewComponent implements OnInit {
  public tasksWithAssignments$: Observable<TaskWithAssigneesInterface[]>;
  public paperTasksWithAssignments: Observable<TaskWithAssigneesInterface[]>;

  constructor(private viewModel: KabasTasksViewModel) {}

  ngOnInit() {
    this.tasksWithAssignments$ = this.viewModel.tasksWithAssignments$;
    this.paperTasksWithAssignments = this.viewModel.paperTasksWithAssignments$;
  }
}
