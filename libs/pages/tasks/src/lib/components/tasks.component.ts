import { Component } from '@angular/core';
import { TasksViewModel } from './tasks.viewmodel';

@Component({
  selector: 'campus-tasks-component',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent {
  constructor(private tasksViewModel: TasksViewModel) {}

  //TODO add code
}
