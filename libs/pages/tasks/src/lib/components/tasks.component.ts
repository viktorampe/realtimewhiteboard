import { Component, OnInit } from '@angular/core';
import { TasksViewModel } from './tasks.viewmodel';

@Component({
  selector: 'campus-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {
  constructor(public taskViewModel: TasksViewModel) {}

  ngOnInit() {}
}
