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
  constructor() {}

  ngOnInit() {}
}
