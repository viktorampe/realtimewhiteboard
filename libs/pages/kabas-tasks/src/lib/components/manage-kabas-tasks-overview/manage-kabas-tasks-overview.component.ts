import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';

@Component({
  selector: 'campus-manage-kabas-tasks-overview',
  templateUrl: './manage-kabas-tasks-overview.component.html',
  styleUrls: ['./manage-kabas-tasks-overview.component.scss']
})
export class ManageKabasTasksOverviewComponent implements OnInit {
  // TODO: use the list component to determine if there are tasks selected
  selectedTasks$ = of(true);

  constructor() {}

  ngOnInit() {}

  // TODO: implement handler
  clickDeleteTasks() {}

  // TODO: implement handler
  clickArchiveTasks() {}

  // TODO: implement handler
  clickNewTask() {}
}
