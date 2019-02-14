import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'campus-finding-nemo',
  templateUrl: './finding-nemo.component.html',
  styleUrls: ['./finding-nemo.component.scss']
})
export class FindingNemoComponent implements OnInit {
  selectFilter: any;

  constructor() {}

  ngOnInit() {
    this.selectFilter = {
      name: 'selectFilter',
      label: 'selectFilter',
      keyProperty: 'id',
      displayProperty: 'name',
      values: [
        {
          data: {
            id: 1,
            name: 'foo'
          },
          selected: false,
          prediction: 0,
          visible: true,
          children: null
        }
      ]
    };
  }
}
