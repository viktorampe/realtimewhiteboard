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

  taskInstance = {
    task: {
      name: 'taak 1',
      description:
        'this is a description of the first task jsut to see what will happen to the displayment of this task'
    },
    start: new Date()
  };

  content = {
    name: 'Title',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    extension: 'xls',
    productType: 'polpo-presentatie',
    methods: ['opmijkunjerekenen']
  };
  constructor() {}

  ngOnInit() {}
}
