import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'campus-ui-page',
  templateUrl: './ui-page.component.html',
  styleUrls: ['./ui-page.component.scss']
})
export class UiPageComponent implements OnInit {
  teacher = {
    displayName: 'leerkracht een',
    name: 'Leerkracht',
    firstName: 'Een'
  };

  task = {
    name: 'taak 1',
    description:
      'this is a description of the first task jsut to see what will happen to the displayment of this task',
    teacher: this.teacher,
    start: new Date()
  };
  constructor() {}

  ngOnInit() {}
}
